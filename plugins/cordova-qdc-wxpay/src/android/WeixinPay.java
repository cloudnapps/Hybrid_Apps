package com.qdc.plugins.weixin;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.LOG;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.tencent.mm.sdk.modelpay.PayReq;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.WXAPIFactory;

/**
 * 微信支付插件
 * 
 * @author NCIT
 * 
 */
public class WeixinPay extends CordovaPlugin {

	/** JS回调接口对象 */
	public static CallbackContext cbContext = null;
	
	public static IWXAPI wxAPI;

	/** LOG TAG */
	private static final String LOG_TAG = WeixinPay.class.getSimpleName();

	/**
	 * 插件主入口
	 */
	@Override
	public boolean execute(String action, final JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		LOG.d(LOG_TAG, "WeixinPay#execute");

		boolean ret = false;

		if ("payment".equalsIgnoreCase(action)) {
			LOG.d(LOG_TAG, "WeixinPay#payment.start");

			cbContext = callbackContext;

			PluginResult pluginResult = new PluginResult(PluginResult.Status.NO_RESULT);
			pluginResult.setKeepCallback(true);
			callbackContext.sendPluginResult(pluginResult);

			// 参数检查
			if (args.length() != 1) {
				LOG.e(LOG_TAG, "args is empty", new NullPointerException());
				ret = false;
	            PluginResult result = new PluginResult(PluginResult.Status.ERROR, "args is empty");
	            result.setKeepCallback(true);
	            cbContext.sendPluginResult(result);
				return ret;
			}

			JSONObject jsonObj = args.getJSONObject(0);

			final String appid = jsonObj.getString("appid");
			if (appid == null || "".equals(appid)) {
				LOG.e(LOG_TAG, "appid is empty", new NullPointerException());
				ret = false;
	            PluginResult result = new PluginResult(PluginResult.Status.ERROR, "appid is empty");
	            result.setKeepCallback(true);
	            cbContext.sendPluginResult(result);
				return ret;
			}
			final String noncestr = jsonObj.getString("noncestr");
			if (noncestr == null || "".equals(noncestr)) {
				LOG.e(LOG_TAG, "noncestr is empty", new NullPointerException());
				ret = false;
	            PluginResult result = new PluginResult(PluginResult.Status.ERROR, "noncestr is empty");
	            result.setKeepCallback(true);
	            cbContext.sendPluginResult(result);
				return ret;
			}
			final String packageValue = jsonObj.getString("package");
			if (packageValue == null || "".equals(packageValue)) {
				LOG.e(LOG_TAG, "packageValue is empty", new NullPointerException());
				ret = false;
	            PluginResult result = new PluginResult(PluginResult.Status.OK, "packageValue is empty");
	            result.setKeepCallback(true);
	            cbContext.sendPluginResult(result);
				return ret;
			}
			final String partnerid = jsonObj.getString("partnerid");
			if (partnerid == null || "".equals(partnerid)) {
				LOG.e(LOG_TAG, "partnerid is empty", new NullPointerException());
				ret = false;
	            PluginResult result = new PluginResult(PluginResult.Status.ERROR, "partnerid is empty");
	            result.setKeepCallback(true);
	            cbContext.sendPluginResult(result);
				return ret;
			}
			final String prepayid = jsonObj.getString("prepayid");
			if (prepayid == null || "".equals(prepayid)) {
				LOG.e(LOG_TAG, "prepayid is empty", new NullPointerException());
				ret = false;
	            PluginResult result = new PluginResult(PluginResult.Status.ERROR, "prepayid is empty");
	            result.setKeepCallback(true);
	            cbContext.sendPluginResult(result);
				return ret;
			}
			final String timestamp = jsonObj.getString("timestamp");
			if (timestamp == null || "".equals(timestamp)) {
				LOG.e(LOG_TAG, "timestamp is empty", new NullPointerException());
				ret = false;
	            PluginResult result = new PluginResult(PluginResult.Status.ERROR, "timestamp is empty");
	            result.setKeepCallback(true);
	            cbContext.sendPluginResult(result);
				return ret;
			}
			final String sign = jsonObj.getString("sign");
			if (sign == null || "".equals(timestamp)) {
				LOG.e(LOG_TAG, "sign is empty", new NullPointerException());
				ret = false;
	            PluginResult result = new PluginResult(PluginResult.Status.ERROR, "sign is empty");
	            result.setKeepCallback(true);
	            cbContext.sendPluginResult(result);
				return ret;
			}

			//////////////////////
			// 请求微信支付
			//////////////////////
			wxAPI = WXAPIFactory.createWXAPI(webView.getContext(), appid, true);
			wxAPI.registerApp(appid);
			
			if (!wxAPI.isWXAppInstalled()) {
				LOG.e(LOG_TAG, "Wechat is not installed", new IllegalAccessException());
				ret = false;
	            PluginResult result = new PluginResult(PluginResult.Status.ERROR, "Wechat is not installed");
	            result.setKeepCallback(true);
	            cbContext.sendPluginResult(result);
				return ret;
			}

			LOG.d(LOG_TAG, "WeixinPay#payment.end");

			cordova.getThreadPool().execute(new Runnable() {
				public void run() {
					PayReq payreq = new PayReq();

					payreq.appId = appid;
					payreq.partnerId = partnerid;
					payreq.prepayId = prepayid;
					payreq.packageValue = packageValue;
					payreq.nonceStr = noncestr;
					payreq.timeStamp = timestamp;
					payreq.sign = sign;

					boolean ret = wxAPI.sendReq(payreq);
					if (!ret) {
			            PluginResult result = new PluginResult(PluginResult.Status.ERROR, "unifiedorder requst failured.");
			            result.setKeepCallback(true);
			            cbContext.sendPluginResult(result);
					}
				}
			});
			ret = true;
		}

		return ret;
	}

}
