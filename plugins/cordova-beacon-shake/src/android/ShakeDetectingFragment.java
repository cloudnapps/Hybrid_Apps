package com.cloudnapps.plugins;


import android.content.Context;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.media.AudioManager;
import android.media.SoundPool;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.cloudnapps.beacon.campaign.CampaignBase;
import com.cloudnapps.beacon.ProximityManager;
import com.cloudnapps.beacon.ShakingDetector;
import com.cloudnapps.beacon.ShakingListener;

import org.altbeacon.beacon.service.Stats;


/**
 *
 */
public class ShakeDetectingFragment extends Fragment
    implements ProximityManager.CampaignConsumer{

    private final int FAILURE_MAX_TIME = 3;

    ShakingDetector mShakeDetector;
    ShakingListener mShakingListener;
    private int mShakeResId;
    private SoundPool mSoundPool;

    private CampaignBase mPreviousCampaign;
    private int mFailedTime = 0;
    private Error mFailedReason = null;
    private TextView mTimeTextView;
    private Long mShakeStartTime;
    private double mPreviousShakeTime = 0.0;
    private SensorManager mSensorMgr;
    private Sensor mStepDetector;

    private int mSteps = 0;
    private TextView mStepTextView;
    private boolean mIsMoved = false;
    private TextView mRetryTextView;

    private void setMoved(boolean moved){
        mIsMoved = !mIsStepSensorSupport || moved;
    }

    private boolean mIsStepSensorSupport = false;

    private SensorEventListener mSensorListener = new SensorEventListener() {
        @Override
        public void onSensorChanged(SensorEvent event) {
            if (event.sensor.getType() == Sensor.TYPE_STEP_DETECTOR) {
                // A step detector event is received for each step.
                // This means we need to count steps ourselves

                mSteps += event.values.length;
                mStepTextView.setText(String.format("%d", mSteps));

                setMoved(true);
            }
        }

        @Override
        public void onAccuracyChanged(Sensor sensor, int accuracy) {

        }
    };


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mShakeDetector = new ShakingDetector(getActivity());
        mShakingListener = new ShakingListener(this){
            @Override
            public void onShake() {
                getActivity().setProgressBarIndeterminateVisibility(true);
                if (mFailedTime == 0) {
                    // to prevent multiple event
                    mShakeDetector.pause();

                    mSoundPool.stop(mShakeResId);
                    mSoundPool.play(mShakeResId, 1, 1, 0, 1, .8f);

                    mShakeStartTime = System.currentTimeMillis();

                    unregisterSensorListeners();
                }

                super.onShake();
            }
        };
        mShakeDetector.setOnShakeListener(mShakingListener);


        mIsStepSensorSupport = isKitkatWithStepSensor();
        if (mIsStepSensorSupport) {
            mSensorMgr = (SensorManager) getActivity().getSystemService(Context.SENSOR_SERVICE);
            mStepDetector = mSensorMgr.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR);
        } else {
            mIsMoved = true;
        }
    }

    /**
     * Returns true if this device is supported. It needs to be running Android KitKat (4.4) or
     * higher and has a step counter and step detector sensor.
     * This check is useful when an app provides an alternative implementation or different
     * functionality if the step sensors are not available or this code runs on a platform version
     * below Android KitKat. If this functionality is required, then the minSDK parameter should
     * be specified appropriately in the AndroidManifest.
     *
     * @return True iff the device can run this sample
     */
    private boolean isKitkatWithStepSensor() {
        // BEGIN_INCLUDE(iskitkatsensor)
        // Require at least Android KitKat
        int currentApiVersion = android.os.Build.VERSION.SDK_INT;
        // Check that the device supports the step counter and detector sensors
        PackageManager packageManager = getActivity().getPackageManager();
        return currentApiVersion >= android.os.Build.VERSION_CODES.KITKAT
                && packageManager.hasSystemFeature(PackageManager.FEATURE_SENSOR_STEP_COUNTER)
                && packageManager.hasSystemFeature(PackageManager.FEATURE_SENSOR_STEP_DETECTOR);
        // END_INCLUDE(iskitkatsensor)
    }

    @Override
    public void onResume() {
        super.onResume();
        mShakeDetector.resume();
        registerSensorListeners();
    }

    @Override
    public void onStop() {
        super.onStop();
        mShakeDetector.pause();
    }

    @Override
    public void onPause() {
        super.onPause();
        unregisterSensorListeners();
    }

    private void registerSensorListeners() {
        if(mIsStepSensorSupport)
            mSensorMgr.registerListener(mSensorListener, mStepDetector, 0);
    }

    private void unregisterSensorListeners() {
        if(mIsStepSensorSupport)
            mSensorMgr.unregisterListener(mSensorListener);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
      String packageName = container.getContext().getPackageName();      
      View rootView = inflater.inflate(
        getResources().getIdentifier("fragment_shake", "layout", packageName), 
        container, 
        false);
      
      mTimeTextView = (TextView) rootView.findViewById(
        getResources().getIdentifier("time", "id", packageName));
              
      mStepTextView = (TextView) rootView.findViewById(
        getResources().getIdentifier("step", "id", packageName));
            
      mRetryTextView = (TextView) rootView.findViewById(
        getResources().getIdentifier("retry", "id", packageName));

        if (true) {
            mTimeTextView.setVisibility(View.GONE);
            mStepTextView.setVisibility(View.GONE);
            mRetryTextView.setVisibility(View.GONE);
        }

        return rootView;
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        getActivity().setTitle(
          getResources().getIdentifier("shaking", "string", getActivity().getPackageName())
        );

        mSoundPool = new SoundPool(1, AudioManager.STREAM_NOTIFICATION, 0);
        mShakeResId = mSoundPool.load(getActivity(),
          getResources().getIdentifier("shaking", "raw", getActivity().getPackageName()), 1);

        mTimeTextView.setText(String.format("%.3f seconds", mPreviousShakeTime));
    }

    @Override
    public void onGetCampaign(CampaignBase[] campaigns, Throwable error) {
        if(campaigns != null && campaigns.length > 0) {
            CampaignBase campaign = campaigns[0];

            if (mPreviousCampaign == null ||
                    !mIsMoved ||
                    mFailedTime >= FAILURE_MAX_TIME - 1 ||
                    (mPreviousCampaign != null && !mPreviousCampaign.id.equals(campaign.id))) {
                mPreviousCampaign = campaign;
                openCampaign(campaign);
                resetShakeDetector();
            } else {
                mPreviousCampaign = campaign;
                setFailed();
            }
            return;
        } else if(error != null){
//            String errorMsg = "error occurs!";
//            if(error.getMessage().equals("no sign resources")) {
//                errorMsg = getString(R.string.no_beacon);
//            } else {
//                Throwable throwable = error.getCause();
//                if(throwable != null && !TextUtils.isEmpty(throwable.getMessage())){
//                    errorMsg = throwable.getMessage();
//                }
//            }
//
//            if(getActivity() != null) {
//                Toast.makeText(getActivity(), errorMsg, Toast.LENGTH_LONG).show();
//            }
        } else {
//            // no messages;
//            if (getActivity() != null){
//                Toast.makeText(getActivity(), getString(R.string.no_message), Toast.LENGTH_LONG).show();
//            }
        }

        setFailed();
    }

    private void openCampaign(CampaignBase campaign) {
        FragmentManager fragmentManager = getFragmentManager();
        if (fragmentManager != null) {
            FragmentTransaction transaction = fragmentManager.beginTransaction();
            Fragment campaignFrag = new CampaignFragment();
            Bundle args = new Bundle();
            args.putParcelable(CampaignFragment.ARG_CAMPAIGN, campaign);
            campaignFrag.setArguments(args);
            transaction.addToBackStack(null);
            transaction.replace(
                getResources().getIdentifier("container", "id", getActivity().getPackageName()),
                campaignFrag);
            transaction.commit();
        }


//        Toast.makeText(getActivity(), campaign.name, Toast.LENGTH_LONG).show();

//        showMessage(campaign.name, "");
    }

    private void showMessage(String title, String msg) {
        Toast.makeText(getActivity(), title, Toast.LENGTH_LONG).show();
    }

    private void resetShakeDetector() {
        // resume to detect shaking
        try {
            mShakeDetector.resume();
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        mRetryTextView.setText(String.format("%d", mFailedTime));

        mFailedTime = 0;
//        mPreviousCampaign = null;
        getActivity().setProgressBarIndeterminateVisibility(false);

        mPreviousShakeTime = (System.currentTimeMillis() - mShakeStartTime ) * 1.0 / 1000.0;
        mTimeTextView.setText(String.format("%.3f seconds", mPreviousShakeTime));

        registerSensorListeners();

        setMoved(false);
    }

    private void setFailed() {
        increaseRetry();
        if (mFailedTime >= FAILURE_MAX_TIME) {
//            Toast.makeText(getActivity(), getString(R.string.no_message), Toast.LENGTH_LONG).show();
            showMessage("没有发现信息推送", "");
            mPreviousCampaign = null;
            resetShakeDetector();
        } else {
            mShakingListener.onShake();
        }
    }

    private void increaseRetry() {
        mFailedTime ++;
        mRetryTextView.setText(String.format("%d", mFailedTime));
    }
}