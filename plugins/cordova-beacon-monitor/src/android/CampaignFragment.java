package com.cloudnapps.plugins;

import android.support.v4.app.Fragment;
import android.content.res.Resources;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;
import android.widget.Toast;

import com.cloudnapps.beacon.ProximityManager;
import com.cloudnapps.beacon.campaign.CampaignBase;
import com.cloudnapps.beacon.campaign.CustomCampaign;
import com.cloudnapps.beacon.campaign.WebSiteCampaign;

/**
 *
 */
public class CampaignFragment extends Fragment {
    public static final String ARG_CAMPAIGN = "campaign";
    public CampaignBase mCampaign;
    public WebView mWebView;
    private TextView mTextView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mCampaign = getArguments().getParcelable(ARG_CAMPAIGN);

            ProximityManager.sharedInstance().getCampaignMessage(mCampaign.mid, new ProximityManager.CampaignConsumer() {
                @Override
                public void onGetCampaign(CampaignBase[] campaign, Throwable error) {
                    if(campaign != null && campaign.length > 0) {
                        mCampaign = campaign[0];
                        showCampaign(mCampaign);
                    } else {
                        reportError(error.getMessage());
                    }
                }
            });
        }
    }

    private void showCampaign(CampaignBase campaign) {
        if(WebSiteCampaign.class.isInstance(campaign)) {
            displayWebSiteCampaign((WebSiteCampaign) campaign);
        } else if(CustomCampaign.class.isInstance(campaign)) {
            displayCustomCampaign((CustomCampaign)campaign);
        } else {
//            reportError(getString(R.string.not_website));
        }
    }

    private void displayWebSiteCampaign(WebSiteCampaign wCampaign) {
        mWebView.setVisibility(View.VISIBLE);
        mTextView.setVisibility(View.GONE);

        mWebView.loadUrl(wCampaign.website);
    }

    private void displayCustomCampaign(CustomCampaign cCampaign) {
        mWebView.setVisibility(View.GONE);
        mTextView.setVisibility(View.VISIBLE);

        StringBuffer stringBuffer = new StringBuffer();
        for(String key: cCampaign.customFields.keySet()) {
            stringBuffer.append(
                    String.format("%s: %s\r\n",key, cCampaign.customFields.get(key)));
        }
        mTextView.setText(stringBuffer.toString());
    }

    private void reportError(String errString) {
        Toast.makeText(getActivity(), errString, Toast.LENGTH_LONG).show();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        String packageName = container.getContext().getPackageName();
        Resources resources = getResources();

        View v = inflater.inflate(
                resources.getIdentifier("fragment_campaign",
                        "layout",
                        packageName),
                container,
                false);

        mWebView = (WebView)v.findViewById(
                resources.getIdentifier("webview", "id", packageName));
        mTextView = (TextView)v.findViewById(
                resources.getIdentifier("textview", "id", packageName));

        mWebView.setWebViewClient(new WebViewClient(){
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return false;
            }
        });

        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);

        return v;
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);

        getActivity().setTitle(mCampaign.name);
    }
}
