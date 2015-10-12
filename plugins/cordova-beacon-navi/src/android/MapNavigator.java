package com.cloudnapps.plugins.map;

import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class MapNavigator extends CordovaPlugin {

    private Context mContext;
    private CordovaInterface mCordova;

    protected String mCityId;
    protected String mBuildingId;
    protected String mUserId;
    protected String mLicense;
    protected String mBeaconUUID;
    /**
     * Constructor.
     */
    public MapNavigator() {

    }

    /**
     * Sets the context of the Command. This can then be used to do things like
     * get file paths associated with the Activity.
     *
     * @param cordova The context of the main Activity.
     * @param webView The CordovaWebView Cordova is running in.
     */
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        mCordova = cordova;
        mContext = cordova.getActivity();

        Intent intent = cordova.getActivity().getIntent();
        if (intent != null) {
            mCityId = this.preferences.getString("cityID", "");
            mBuildingId = this.preferences.getString("buildingID", "");
            mUserId = this.preferences.getString("userID", "");
            mLicense = this.preferences.getString("licenseID", "");
            mBeaconUUID = this.preferences.getString("beaconUUID", "");
        }
    }

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action            The action to execute.
     * @param args              JSONArry of arguments for the plugin.
     * @param callbackContext   The callback id used when calling back into JavaScript.
     * @return                  True if the action was valid, false if not.
     */
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if ("showShopMap".equals(action) || "showMapNavigator".equals(action)) {
            Intent intent = new Intent(mContext, MapActivity.class);

            intent.putExtra("cityID", mCityId);
            intent.putExtra("buildingID", mBuildingId);
            intent.putExtra("userID", mUserId);
            intent.putExtra("licenseID", mLicense);
            intent.putExtra("beaconUUID", mBeaconUUID);

            intent.putExtra("poiID", args.getString(0));
            intent.putExtra("floorNum", args.getString(1));

            mContext.startActivity(intent);
        } else {
            return false;
        }
        return true;
    }
}
