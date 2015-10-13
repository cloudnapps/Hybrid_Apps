package com.cloudnapps.plugins;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

import com.cloudnapps.beacon.BluetoothDisabledException;
import com.cloudnapps.beacon.BluetoothNotSupportException;
import com.cloudnapps.beacon.NotificationCenter;
import com.cloudnapps.beacon.ProximityConfig;
import com.cloudnapps.beacon.ProximityManager;


/**
 *
 */
public class BeaconMonitorService extends Service {

    public static class Config {
        public static long BEACON_BACKGROUND_SCAN_PERIOD = 2111l;
        public static long BEACON_BACKGROUND_BETWEEN_SCAN_PERIOD = 2000l;
        public static long BEACON_FOREGROUND_SCAN_PERIOD = 2111l;
        public static long BEACON_FOREGROUND_BETWEEN_SCAN_PERIOD = 2000l;

        public static String BEACON_UUID;
        public static String BEACON_APP_SECRET;
        public static String BEACON_SERVER;
        public static String BEACON_APP_KEY;

        public static String NOTIFICATION_ICON;
    }

    public BeaconMonitorService() {

    }

    @Override
    public IBinder onBind(Intent intent) {
        // I don't decide whether this service should be bind or not, so return null for now.
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        setupProximity();
        return START_STICKY;
    }

    private void setupProximity() {
        ProximityConfig config =
                new ProximityConfig(
                        Config.BEACON_SERVER,
                        Config.BEACON_APP_KEY,
                        Config.BEACON_APP_SECRET,
                        Config.BEACON_UUID,
                        false);

        config.setForegroundBetweenScanPeriod(Config.BEACON_FOREGROUND_BETWEEN_SCAN_PERIOD);
        config.setForegroundScanPeriod(Config.BEACON_FOREGROUND_SCAN_PERIOD);
        config.setBackgroundBetweenScanPeriod(Config.BEACON_BACKGROUND_BETWEEN_SCAN_PERIOD);
        config.setBackgroundScanPeriod(Config.BEACON_BACKGROUND_SCAN_PERIOD);

        config.setNotificationBuilderDelegate(new NotificationCenter.NotificationBuilderDelegate() {
            @Override
            public int getIcon() {
                return BeaconMonitorService.this.getResources().getIdentifier(
                        Config.NOTIFICATION_ICON,
                        "drawable",
                        getPackageName()
                );
            }

            @Override
            public Class getActivityClass() {
                return CampaignActivity.class;
            }
        });

        ProximityManager.sharedInstance().setup(this, config);

        try {
            ProximityManager.sharedInstance().start();
        } catch (BluetoothNotSupportException ex) {

        } catch (BluetoothDisabledException ex) {

        }

//        mMessageCenter = new BeaconMessageCenter(this);
//        NotificationCenter.addListener(mMessageCenter);
    }
}
