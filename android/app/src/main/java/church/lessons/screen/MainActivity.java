package church.lessons.screen;

import android.app.Activity;
import android.media.AudioManager;
import android.os.Bundle;
import android.view.View;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "LessonsScreen";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    hideNavigationBar();
    stopBackgroundAudio();
  }

  protected void stopBackgroundAudio() {
    AudioManager am = (AudioManager) this.getSystemService(Activity.AUDIO_SERVICE);
    int result = am.requestAudioFocus(null,  AudioManager.STREAM_MUSIC,  AudioManager.AUDIOFOCUS_GAIN);
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) {
      hideNavigationBar();
    }
  }

  private void hideNavigationBar() {
    getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
    );
  }

}
