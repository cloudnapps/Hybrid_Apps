package com.cloudnapps.plugins;

import android.content.Intent;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;

public class Shake extends CordovaPlugin {

    private CordovaInterface mCordova;

    /**
     * Constructor.
     */
    public Shake() {

    }

    /**
     * Sets the context of the Command. This can then be used to do things like
     * get file paths associated with the Activity.
     *
     * @param cordova The context of the main Activity.
     * @param webView The CordovaWebView Cordova is running in.
     */
    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        mCordova = cordova;

        BeaconMonitorService.Config.BEACON_UUID = preferences.getString("beaconUUID", "");
        BeaconMonitorService.Config.BEACON_SERVER = preferences.getString("serverURL", "");
        BeaconMonitorService.Config.BEACON_APP_KEY = preferences.getString("android_appKey", "");
        BeaconMonitorService.Config.BEACON_APP_SECRET = preferences.getString("android_appSecret", "");
        BeaconMonitorService.Config.NOTIFICATION_ICON = preferences.getString("android_notification_icon", "ic_launcher");
    }

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action            The action to execute.
     * @param args              JSONArry of arguments for the plugin.
     * @param callbackContext   The callback id used when calling back into JavaScript.
     * @return                  True if the action was valid, false if not.
     */
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if("shakeByBeacon".equals(action)) {
          Intent intent = new Intent(mCordova.getActivity(), BeaconMonitorService.class);
          mCordova.getActivity().startService(intent);
          
          Intent activity = new Intent(mCordova.getActivity(), ShakeActivity.class);
          mCordova.getActivity().startActivity(activity);          
        } else {
            return false;
        }
        return true;
    }
}
