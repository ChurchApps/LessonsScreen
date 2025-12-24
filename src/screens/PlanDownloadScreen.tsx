import React, { useEffect } from "react";
import { View, Text, TouchableHighlight, ActivityIndicator, BackHandler, ImageBackground } from "react-native";
import { ApiHelper, CachedData, Styles } from "../helpers";
import { DimensionHelper } from "../helpers/DimensionHelper";
import { PlanInterface, FeedVenueInterface, LessonPlaylistFileInterface, PlanItemInterface } from "../interfaces";
import LinearGradient from "react-native-linear-gradient";

type Props = {
  navigateTo(page: string): void;
  sidebarState: (state: boolean) => void;
  sidebarExpanded?: boolean;
};

export const PlanDownloadScreen = (props: Props) => {
  const [plan, setPlan] = React.useState<PlanInterface | null>(null);
  const [venue, setVenue] = React.useState<FeedVenueInterface | null>(null);
  const [planItems, setPlanItems] = React.useState<PlanItemInterface[]>([]);
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

  // Build maps for both actionId -> files and sectionId -> files
  const buildFileMaps = (venueData: FeedVenueInterface): { actionMap: Map<string, LessonPlaylistFileInterface[]>, sectionMap: Map<string, LessonPlaylistFileInterface[]> } => {
    const actionMap = new Map<string, LessonPlaylistFileInterface[]>();
    const sectionMap = new Map<string, LessonPlaylistFileInterface[]>();

    venueData.sections?.forEach(section => {
      const sectionFiles: LessonPlaylistFileInterface[] = [];

      section.actions?.forEach(action => {
        const actionType = action.actionType?.toLowerCase();
        if (actionType === "play" || actionType === "add-on") {
          const files: LessonPlaylistFileInterface[] = [];
          action.files?.forEach(file => {
            const fileEntry: LessonPlaylistFileInterface = {
              id: file.id,
              name: file.name,
              url: file.url || "",
              seconds: file.seconds || 10,
              fileType: file.fileType
            };
            files.push(fileEntry);
            sectionFiles.push(fileEntry); // Also add to section files
          });
          if (action.id) {
            actionMap.set(action.id, files);
          }
        }
      });

      // Store all play files for this section
      if (section.id) {
        sectionMap.set(section.id, sectionFiles);
      }
    });

    return { actionMap, sectionMap };
  };

  // Recursively collect relatedIds from planItems in sorted order
  // Returns array of { id, type } where type is 'action', 'item' (section), 'addOn', or other
  const collectRelatedIds = (items: PlanItemInterface[]): { id: string, itemType: string }[] => {
    const relatedIds: { id: string, itemType: string }[] = [];
    const sortedItems = [...items].sort((a, b) => (a.sort || 0) - (b.sort || 0));

    for (const item of sortedItems) {
      // 'item' type means it references a section, 'action' means it references an action, 'addOn' means it references an add-on
      if (item.relatedId && (item.itemType === "action" || item.itemType === "item" || item.itemType === "addOn")) {
        relatedIds.push({ id: item.relatedId, itemType: item.itemType });
      }
      if (item.children && item.children.length > 0) {
        relatedIds.push(...collectRelatedIds(item.children));
      }
    }

    return relatedIds;
  };

  const getFilesFromVenue = (venueData: FeedVenueInterface, customPlanItems?: PlanItemInterface[]): LessonPlaylistFileInterface[] => {
    const { actionMap, sectionMap } = buildFileMaps(venueData);
    console.log("actionMap size:", actionMap.size, "keys:", Array.from(actionMap.keys()));
    console.log("sectionMap size:", sectionMap.size, "keys:", Array.from(sectionMap.keys()));

    // If we have planItems, use them to determine order and which actions/sections to include
    if (customPlanItems && customPlanItems.length > 0) {
      const relatedIds = collectRelatedIds(customPlanItems);
      console.log("Collected relatedIds from planItems:", relatedIds);

      // If planItems exist but have no related IDs, fall back to full venue
      if (relatedIds.length === 0) {
        console.log("No related IDs found in planItems, using full venue");
      } else {
        const result: LessonPlaylistFileInterface[] = [];

        for (const { id, itemType } of relatedIds) {
          let files: LessonPlaylistFileInterface[] | undefined;

          if (itemType === "item") {
            // 'item' type references a section - get all play files from that section
            files = sectionMap.get(id);
            console.log("Looking for sectionId:", id, "found files:", files?.length || 0);
          } else if (itemType === "action" || itemType === "addOn") {
            // 'action' and 'addOn' types reference a specific action
            files = actionMap.get(id);
            console.log("Looking for actionId:", id, "(type:", itemType, ") found files:", files?.length || 0);
          }

          if (files) {
            result.push(...files);
          }
        }

        if (result.length > 0) {
          return result;
        }
        console.log("No files found for planItems, falling back to full venue");
      }
    }

    // No planItems or no matching items - return all files from venue in original order
    const result: LessonPlaylistFileInterface[] = [];
    venueData.sections?.forEach(section => {
      section.actions?.forEach(action => {
        const actionType = action.actionType?.toLowerCase();
        if (actionType === "play" || actionType === "add-on") {
          action.files?.forEach(file => {
            result.push({
              id: file.id,
              name: file.name,
              url: file.url || "",
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
      console.log("Loading plan for planTypeId:", planTypeId);
      if (!planTypeId) {
        console.log("No planTypeId found, failing");
        setLoadFailed(true);
        setLoading(false);
        return;
      }

      console.log("Fetching from DoingApi: /plans/public/current/" + planTypeId);
      const currentPlan: PlanInterface = await ApiHelper.getAnonymous(
        `/plans/public/current/${planTypeId}`,
        "DoingApi"
      );
      console.log("Got plan:", JSON.stringify(currentPlan));

      if (!currentPlan) {
        console.log("No plan returned, failing");
        setLoadFailed(true);
        setLoading(false);
        return;
      }

      setPlan(currentPlan);
      CachedData.currentPlan = currentPlan;
      await CachedData.setAsyncStorage("currentPlan", currentPlan);

      // Fetch planItems for the plan
      if (currentPlan.id && currentPlan.churchId) {
        try {
          console.log("Fetching planItems for plan:", currentPlan.id);
          const items: PlanItemInterface[] = await ApiHelper.getAnonymous(
            `/planItems/presenter/${currentPlan.churchId}/${currentPlan.id}`,
            "DoingApi"
          );
          console.log("Got planItems:", items?.length || 0);
          setPlanItems(items || []);
          await CachedData.setAsyncStorage("planItems", items || []);
        } catch (err) {
          console.log("Failed to fetch planItems, will use full venue:", err);
          setPlanItems([]);
        }
      }

      // If plan has venue content, load it
      console.log("Plan contentType:", currentPlan.contentType, "contentId:", currentPlan.contentId);
      if (currentPlan.contentType === "venue" && currentPlan.contentId) {
        console.log("Fetching from LessonsApi: /venues/public/feed/" + currentPlan.contentId);
        const venueData: FeedVenueInterface = await ApiHelper.getAnonymous(
          `/venues/public/feed/${currentPlan.contentId}`,
          "LessonsApi"
        );
        console.log("Got venue data:", JSON.stringify(venueData));
        setVenue(venueData);
        CachedData.planVenue = venueData;
        await CachedData.setAsyncStorage("planVenue", venueData);
      } else {
        console.log("Plan does not have venue content type");
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
    console.log("startDownload called, venue:", venue ? "exists" : "null", "planItems:", planItems?.length || 0);
    if (venue) {
      // Pass planItems to get files in the customized order (if any)
      const files = getFilesFromVenue(venue, planItems);
      console.log("Files to download:", files.length, JSON.stringify(files.slice(0, 3))); // Log first 3
      if (files.length > 0) {
        CachedData.messageFiles = files;
        await CachedData.setAsyncStorage("messageFiles", files);
        setReady(false);
        CachedData.prefetch(files, updateCounts).then(() => {
          console.log("Prefetch complete");
          setReady(true);
        });
      } else {
        // No media files, still mark as ready
        console.log("No files to download, marking ready");
        CachedData.messageFiles = [];
        setReady(true);
      }
    }
  };

  const handleBack = () => {
    props.sidebarState(true);
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
  // Start download when venue is loaded (planItems will already be set by then)
  useEffect(() => { if (venue) startDownload(); }, [venue, planItems]);
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

  const backgroundImage = venue?.lessonImage;

  const contentOverlay = (
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
  );

  // If we have a background image, show it with overlay gradient
  if (backgroundImage) {
    return (
      <View style={{ ...Styles.menuScreen, flex: 1, flexDirection: "row" }}>
        <ImageBackground
          source={{ uri: backgroundImage }}
          resizeMode="cover"
          style={{ flex: 1, width: "100%" }}
        >
          {contentOverlay}
        </ImageBackground>
      </View>
    );
  }

  // Otherwise show a nice gradient background
  return (
    <View style={{ ...Styles.menuScreen, flex: 1, flexDirection: "row" }}>
      <LinearGradient
        colors={["#0f1724", "#1a2a4a", "#0a1628"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, width: "100%" }}
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
    </View>
  );
};
