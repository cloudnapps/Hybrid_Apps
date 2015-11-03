package com.cloudnapps.plugins.hoko;

import android.os.AsyncTask;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

public class Project extends CordovaPlugin {

    private CordovaInterface mCordova;
    private CallbackContext mCallbackContext;

    /**
     * Constructor.
     */
    public Project() {

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
        if("checkConnection".equals(action)) {
            checkConnection(args.getString(0), callbackContext);
        } else {
            return false;
        }
        return true;
    }

    private void checkConnection(String url, CallbackContext callbackContext) {
        AsyncTask<String, Void, Integer> httpTask = new CheckConnectionTask(callbackContext);
        httpTask.execute(url);
    }


    private class CheckConnectionTask extends AsyncTask<String, Void, Integer> {
        private final CallbackContext mCallbackContext;
        private String mRedirectLocation = null;
        public CheckConnectionTask(CallbackContext callbackContext) {
            mCallbackContext = callbackContext;
        }

        @Override
        protected Integer doInBackground(String... urls) {
            if (urls == null || urls.length == 0) {
                return -1;
            }

            HttpURLConnection.setFollowRedirects(false);

            String urlString = urls[0];
            URL url = null;
            try {
                url = new URL(urlString);
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("HEAD");
                int code = connection.getResponseCode();
                if (code == HttpURLConnection.HTTP_MOVED_PERM
                        || code == HttpURLConnection.HTTP_MOVED_TEMP) {
                    mRedirectLocation = connection.getHeaderField("Location");
                }
                return code;

            } catch (MalformedURLException e) {

            } catch (ProtocolException e) {

            } catch (IOException e) {

            }

            return -1;
        }

        @Override
        protected void onPostExecute(Integer result) {
            if (mCallbackContext != null) {
                if (result <= 0) {
                    mCallbackContext.error(result);
                } else {
                    try {
                        JSONObject jsonResult = new JSONObject();
                        jsonResult.put("location", mRedirectLocation);
                        jsonResult.put("code", result.intValue());
                        mCallbackContext.success(jsonResult);
                    } catch (JSONException e) {
                        mCallbackContext.error(e.getMessage());
                    }
                }
            }
        }
    }
}