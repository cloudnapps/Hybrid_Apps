package com.cloudnapps.plugins;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.Window;

public class ShakeActivity extends FragmentActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_INDETERMINATE_PROGRESS);

        setContentView(getResources().getIdentifier("activity_shake", "layout", getPackageName()));
        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction()
                    .add(getResources().getIdentifier("container", "id", getPackageName()), 
                         new ShakeDetectingFragment())
                    .commit();
        }
    }    
}
