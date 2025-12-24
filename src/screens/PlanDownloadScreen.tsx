import React, { useEffect } from "react";
import { View, Text, TouchableHighlight, ActivityIndicator, BackHandler, ImageBackground } from "react-native";
import { ApiHelper, CachedData, Styles } from "../helpers";
import { DimensionHelper } from "../helpers/DimensionHelper";
import { PlanInterface, FeedVenueInterface, LessonPlaylistFileInterface } from "../interfaces";
import LinearGradient from "react-native-linear-gradient";

type Props = { navigateTo(page: string): void; };

export const PlanDownloadScreen = (props: Props) => {
  const [plan, setPlan] = React.useState<PlanInterface | null>(null);
  const [venue, setVenue] = React.useState<FeedVenueInterface | null>(null);
  const [totalItems, setTotalItems] = React.useState(0);
  const [cachedItems, setCachedItems] = React.useState(0);
  const [ready, setReady] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState("");
  const [loadFailed, setLoadFailed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [offlineCheck, setOfflineCheck] = React.useState(false);

  const updateCounts = (cached: number, total: number): void => {
    setCachedItems(cached);
    setTotalItems(total);
  };

  const getFilesFromVenue = (venueData: FeedVenueInterface): LessonPlaylistFileInterface[] => {
    const result: LessonPlaylistFileInterface[] = [];

    venueData.sections?.forEach(section => {
      section.actions?.forEach(action => {
        if (action.actionType === "Play" || action.actionType === "Add-on") {
          action.files?.forEach(file => {
            result.push({
              id: file.id,
              name: file.name,
              url: file.streamUrl || file.url || "",
              seconds: file.seconds || 10,
              fileType: file.fileType
            });
          });
        }
      });
    });

    return result;
  };

  const handleStart = () => {
    props.navigateTo("player");
  };

  const getVersion = () => {
    let pkg = require("../../package.json");
    return (
      <Text style={{ ...Styles.smallWhiteText, textAlign: "left", fontSize: 12, paddingBottom: 15, color: "#999999", paddingTop: 15 }}>
        Version: {pkg.version}
      </Text>
    );
  };

  const getContent = () => {
    if (!plan) return <ActivityIndicator size="small" color="gray" animating={true} />;
    else {
      if (ready && cachedItems === totalItems) {
        return (
          <>
            <Text style={Styles.H2}>{plan.name || "Service Plan"}</Text>
            {plan.serviceDate && (
              <Text style={Styles.H3}>
                {new Date(plan.serviceDate).toLocaleDateString()}
              </Text>
            )}
            {venue?.lessonName && (
              <Text style={{ ...Styles.smallerWhiteText, color: "#CCCCCC" }}>
                {venue.lessonName}
              </Text>
            )}
            <TouchableHighlight
              style={{
                ...Styles.smallMenuClickable,
                backgroundColor: "#0086d1",
                width: DimensionHelper.wp("18%"),
                marginTop: DimensionHelper.hp("1%"),
                borderRadius: 5
              }}
              underlayColor={"#03a9f4"}
              onPress={() => handleStart()}
              hasTVPreferredFocus={true}
            >
              <Text style={{ ...Styles.smallWhiteText, width: "100%" }} numberOfLines={1}>
                Start Plan
              </Text>
            </TouchableHighlight>
            {getVersion()}
          </>
        );
      } else {
        return (
          <>
            <Text style={Styles.H2}>{plan.name || "Service Plan"}</Text>
            {plan.serviceDate && (
              <Text style={Styles.H3}>
                {new Date(plan.serviceDate).toLocaleDateString()}
              </Text>
            )}
            <TouchableHighlight
              style={{
                ...Styles.smallMenuClickable,
                backgroundColor: "#999999",
                width: DimensionHelper.wp("35%"),
                marginTop: DimensionHelper.hp("1%"),
                borderRadius: 5
              }}
              underlayColor={"#999999"}
            >
              <Text style={{ ...Styles.smallWhiteText, width: "100%" }} numberOfLines={1}>
                Downloading item {cachedItems} of {totalItems}
              </Text>
            </TouchableHighlight>
            {getVersion()}
          </>
        );
      }
    }
  };

  const loadData = async () => {
    setLoading(true);

    // Load cached data first
    const cachedPlan = await CachedData.getAsyncStorage("currentPlan");
    if (cachedPlan) setPlan(cachedPlan);

    try {
      // Load current plan by planTypeId
      const planTypeId = CachedData.planTypeId;
      if (!planTypeId) {
        setLoadFailed(true);
        setLoading(false);
        return;
      }

      const currentPlan: PlanInterface = await ApiHelper.getAnonymous(
        `/plans/public/current/${planTypeId}`,
        "DoingApi"
      );

      if (!currentPlan) {
        setLoadFailed(true);
        setLoading(false);
        return;
      }

      setPlan(currentPlan);
      CachedData.currentPlan = currentPlan;
      await CachedData.setAsyncStorage("currentPlan", currentPlan);

      // If plan has venue content, load it
      if (currentPlan.contentType === "venue" && currentPlan.contentId) {
        const venueData: FeedVenueInterface = await ApiHelper.getAnonymous(
          `/venues/public/feed/${currentPlan.contentId}`,
          "LessonsApi"
        );
        setVenue(venueData);
        CachedData.planVenue = venueData;
        await CachedData.setAsyncStorage("planVenue", venueData);
      }
    } catch (ex) {
      console.error("Error loading plan:", ex);
      if (ex.toString().indexOf("Network request failed") > -1) {
        props.navigateTo("offline");
      }
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const startDownload = async () => {
    if (venue) {
      const files = getFilesFromVenue(venue);
      if (files.length > 0) {
        CachedData.messageFiles = files;
        await CachedData.setAsyncStorage("messageFiles", files);
        setReady(false);
        CachedData.prefetch(files, updateCounts).then(() => {
          setReady(true);
        });
      } else {
        // No media files, still mark as ready
        CachedData.messageFiles = [];
        setReady(true);
      }
    }
  };

  const handleBack = () => {
    props.navigateTo("selectPairingMode");
  };

  const init = () => {
    const timer = setInterval(() => {
      setRefreshKey(new Date().getTime().toString());
    }, 60 * 60 * 1000); // Refresh hourly

    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      handleBack();
      return true;
    });

    setTimeout(() => setOfflineCheck(true), 5000);

    return () => {
      clearInterval(timer);
      backHandler.remove();
    };
  };

  useEffect(init, []);
  useEffect(() => { loadData(); }, [refreshKey]);
  useEffect(() => { if (venue) startDownload(); }, [venue]);
  useEffect(() => {
    if (offlineCheck && loading) props.navigateTo("offline");
  }, [offlineCheck]);

  if (loadFailed) {
    return (
      <View style={{ ...Styles.menuScreen, flex: 1, width: DimensionHelper.wp("100%"), flexDirection: "column" }}>
        <Text style={{ ...Styles.bigWhiteText, flex: 1, verticalAlign: "bottom" }}>
          The plan could not be loaded.
        </Text>
        <Text style={{ ...Styles.whiteText, flex: 1 }}>
          Make sure a plan is scheduled for this plan type.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ ...Styles.menuScreen, flex: 1, flexDirection: "row" }}>
      <ImageBackground
        source={{ uri: venue?.lessonDescription ? "about:blank" : "about:blank" }}
        resizeMode="cover"
        style={{ flex: 1, width: "100%" }}
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0)"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 9, justifyContent: "flex-end", flexDirection: "column" }}>
            <View
              style={{
                justifyContent: "flex-start",
                flexDirection: "row",
                paddingLeft: DimensionHelper.wp("5%")
              }}
            >
              <View style={{ maxWidth: "60%" }}>{getContent()}</View>
            </View>
          </View>
          <View style={{ flex: 1 }}></View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};
