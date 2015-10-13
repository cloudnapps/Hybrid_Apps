package com.cloudnapps.plugins;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentTransaction;
import android.widget.Toast;
import com.cloudnapps.beacon.campaign.CampaignBase;
import com.cloudnapps.beacon.Notification;
import com.cloudnapps.beacon.NotificationCenter;
import com.cloudnapps.beacon.NotificationListener;

/**
 * Created by xiaoooyu on 5/4/15.
 */
public class CampaignActivity
        extends FragmentActivity
        implements NotificationListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(
                getResources().getIdentifier("activity_campaign", "layout", getPackageName()));


        Intent intent = getIntent();
        if(intent.hasExtra(NotificationCenter.NOTIFICTION_KEY)) {
            Notification notification = intent.getParcelableExtra(NotificationCenter.NOTIFICTION_KEY);

            CampaignBase campaign = new CampaignBase();
            campaign.mid = notification.mid;

            FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
            CampaignFragment campaignFrag = new CampaignFragment();
            Bundle args = new Bundle();
            args.putParcelable(CampaignFragment.ARG_CAMPAIGN, campaign);
            campaignFrag.setArguments(args);
            transaction.add(
                    getResources().getIdentifier("container", "id", getPackageName()),
                    campaignFrag);
            transaction.commit();

            setTitle(notification.alert);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        NotificationCenter.addListener(this);
    }

    @Override
    protected void onPause() {
        super.onPause();

        NotificationCenter.removeListener(this);
    }

    @Override
    public void onGetNotifications(Notification[] notifications, Throwable error) {
        if(notifications != null) {
            for (Notification notification : notifications) {
                Toast.makeText(getApplicationContext(), notification.alert, Toast.LENGTH_LONG).show();
            }
        } else if(error != null && error.getMessage() != null){
            Toast.makeText(getApplicationContext(), error.getMessage(), Toast.LENGTH_LONG).show();
        }
    }
}
