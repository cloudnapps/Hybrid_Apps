package com.cloudnapps.plugins.map;

import java.io.File;
import java.util.List;

import android.app.ActionBar;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Environment;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;

import android.support.v4.app.ActivityCompat;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import com.esri.android.map.GraphicsLayer;
import com.esri.core.geometry.Envelope;
import com.esri.core.geometry.Point;
import com.ty.locationengine.ble.TYBeacon;
import com.ty.locationengine.ble.TYLocationManager;
import com.ty.locationengine.ble.TYPublicBeacon;
import com.ty.locationengine.ibeacon.BeaconRegion;
import com.ty.mapdata.TYBuilding;
import com.ty.mapdata.TYCity;
import com.ty.mapdata.TYLocalPoint;
import com.ty.mapsdk.TYBuildingManager;
import com.ty.mapsdk.TYCityManager;
import com.ty.mapsdk.TYDirectionalHint;
import com.ty.mapsdk.TYMapEnvironment;
import com.ty.mapsdk.TYMapInfo;
import com.ty.mapsdk.TYMapView;
import com.ty.mapsdk.TYPictureMarkerSymbol;
import com.ty.mapsdk.TYPoi;
import com.ty.mapsdk.TYOfflineRouteManager;
import com.ty.mapsdk.TYRoutePart;
import com.ty.mapsdk.TYRouteResult;

public class MapActivity 
    extends Activity
    implements TYLocationManager.TYLocationManagerListener,
    TYMapView.TYMapViewListenser,
    TYOfflineRouteManager.TYOfflineRouteManagerListener, 
    ActionBar.OnNavigationListener {

    private static final String TAG = "MapActivity";

    static {
        System.loadLibrary("TYMapSDK");
        System.loadLibrary("TYLocationEngine");
    }

    protected TYMapView mapView;

    protected TYCity currentCity;
    protected TYBuilding currentBuilding;
    protected TYMapInfo currentMapInfo;
    protected List<TYMapInfo> allMapInfos;

    protected String cityId;
    protected String buildingId;
    protected String userId;
    protected String license;
    protected String poi_id;

    protected String beaconUUID;
    protected String floorNum;

    private TYLocationManager locationManager;
    private TYOfflineRouteManager routeManager;
    private GraphicsLayer hintLayer;

    private TYLocalPoint mRouteBeginPoint;
    private TYLocalPoint mRouteTargetPoint;
    private TYRouteResult mRouteResult;
    private boolean mIsRouting = false;
    private TYRoutePart mCurrentRoutePart;
    private List<TYDirectionalHint> mRouteGuides;
    private ActionBar mActionBar;
    private FloorAdapter mActionBarFloorAdapter;

    private boolean mUserSelectFloor = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(getResources().getIdentifier("activity_map", "layout", getPackageName()));

        initParams();

        mapView = (TYMapView) findViewById(getResources().getIdentifier("map", "id", getPackageName()));

        initMapView();
        initSymbols();
        initLocationManager();
        initRouteManager();

        mActionBar = getActionBar();
        mActionBar.setDisplayShowTitleEnabled(false);
        mActionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_LIST);
        mActionBarFloorAdapter = new FloorAdapter(this);
        mActionBar.setListNavigationCallbacks(mActionBarFloorAdapter, this);
    }

    private void initParams() {
        Intent intent = getIntent();
        cityId = getIntent().getStringExtra("cityID");
        buildingId = intent.getStringExtra("buildingID");
        userId = intent.getStringExtra("userID");
        license = intent.getStringExtra("licenseID");
        beaconUUID = intent.getStringExtra("beaconUUID");
        poi_id = intent.getStringExtra("poiID");
        floorNum = intent.getStringExtra("floorNum");
    }

    private void initRouteManager() {
        routeManager = new TYOfflineRouteManager(currentBuilding, allMapInfos);
        routeManager.addRouteManagerListener(this);
    }

    private void initSymbols() {
        TYPictureMarkerSymbol startSymbol = new TYPictureMarkerSymbol(
          ActivityCompat.getDrawable(this, getResources().getIdentifier("start", "drawable", getPackageName())));
        startSymbol.setWidth(34);
        startSymbol.setHeight(43);
        startSymbol.setOffsetX(0);
        startSymbol.setOffsetY(22);
        mapView.setStartSymbol(startSymbol);

        TYPictureMarkerSymbol endSymbol = new TYPictureMarkerSymbol(
          ActivityCompat.getDrawable(this, getResources().getIdentifier("end", "drawable", getPackageName())));
        endSymbol.setWidth(34);
        endSymbol.setHeight(43);
        endSymbol.setOffsetX(0);
        endSymbol.setOffsetY(22);
        mapView.setEndSymbol(endSymbol);

        TYPictureMarkerSymbol switchSymbol = new TYPictureMarkerSymbol(
          ActivityCompat.getDrawable(this, getResources().getIdentifier("nav_exit", "drawable", getPackageName())));
        switchSymbol.setWidth(37);
        switchSymbol.setHeight(37);
        mapView.setSwitchSymbol(switchSymbol);
    }

    private void initLocationManager() {
        // 初始化定位引擎
        locationManager = new TYLocationManager(this, currentBuilding);
        // 设置Beacon定位参数，并传递给定位引擎
        locationManager.setBeaconRegion(new BeaconRegion("",
                beaconUUID, null, null));
        // 添加回调监听
        locationManager.addLocationEngineListener(this);
    }

    private void initMapView() {
        currentCity = TYCityManager.parseCityFromFilesById(this, cityId);
        currentBuilding = TYBuildingManager.parseBuildingFromFilesById(this,
                cityId, buildingId);
        allMapInfos = TYMapInfo.parseMapInfoFromFiles(this, cityId, buildingId);
        try {
            currentMapInfo = TYMapInfo.searchMapInfoFromArray(allMapInfos,
                    Integer.parseInt(floorNum));
        } catch (Exception ex) {
            currentMapInfo = allMapInfos.get(0);
        }

        mapView.init(currentBuilding, userId, license);
        mapView.setFloor(currentMapInfo);

        mapView.addMapListener(this);

        hintLayer = new GraphicsLayer();
        mapView.addLayer(hintLayer);
    }

    @Override
    public void onClickAtPoint(TYMapView tyMapView, Point point) {
//        TYPoi clickedPoi = tyMapView.extractRoomPoiOnCurrentFloor(point.getX(), point.getY());
//        if (clickedPoi != null) {
//            mTargetPoint = point;
//        } else {
//            mTargetPoint = null;
//        }
    }

    @Override
    public void onPoiSelected(TYMapView tyMapView, List<TYPoi> list) {
        if (list.size() > 0) {
            TYPoi poi = list.get(0);
            mRouteTargetPoint = getPoiCenter(poi);
            requestRoute();
        }
    }

    @Override
    public void onFinishLoadingFloor(TYMapView tyMapView, TYMapInfo tyMapInfo) {
        // geo id, pid, floor id, building id,
        if (!TextUtils.isEmpty(poi_id)) {
            TYPoi poi = mapView.getPoiOnCurrentFloorWithPoiID(poi_id, TYPoi.POI_LAYER.POI_ROOM);
            if (poi != null) {
                mapView.highlightPoi(poi);
                mRouteTargetPoint = getPoiCenter(poi);
            } else {
                mRouteTargetPoint = null;
            }            
        }
        mapView.setHighlightPoiOnSelection(true);

        if (mIsRouting) {
            mapView.showRouteResultOnCurrentFloor();
        }
    }

    private TYLocalPoint getPoiCenter(TYPoi poi) {
        Envelope env = new Envelope();
        poi.getGeometry().queryEnvelope(env);
        TYLocalPoint localPoint = null;
        if (env != null) {
            localPoint = new TYLocalPoint(env.getCenterX(), env.getCenterY(), currentMapInfo.getFloorNumber());
        }
        return localPoint;
    }

    @Override
    public void mapViewDidZoomed(TYMapView tyMapView) {
        if (mIsRouting) {
            mapView.showRouteResultOnCurrentFloor();
        }
    }

    @Override
    public void didRangedBeacons(TYLocationManager tyLocationManager, List<TYBeacon> list) {

    }

    @Override
    public void didRangedLocationBeacons(TYLocationManager tyLocationManager, List<TYPublicBeacon> list) {

    }

    @Override
    public void didUpdateLocation(TYLocationManager tyLocationManager, TYLocalPoint tyLocalPoint) {
        // 判断地图当前显示楼层是否与定位结果一致，若不一致则切换到定位结果所在楼层（楼层自动切换）
        if (!mUserSelectFloor) {
            if (mapView.getCurrentMapInfo().getFloorNumber() != tyLocalPoint.getFloor()) {
                TYMapInfo targetMapInfo = TYMapInfo.searchMapInfoFromArray(
                        allMapInfos, tyLocalPoint.getFloor());
                mapView.setFloor(targetMapInfo);
            }
        }

        // 在地图当前楼层上显示定位结果
        mRouteBeginPoint = tyLocalPoint;
        mapView.showLocation(tyLocalPoint);
    }

    @Override
    public void didFailUpdateLocation(TYLocationManager tyLocationManager) {
        // 定位结果获取失败，在地图上移除定位点
        mapView.removeLocation();
        mRouteBeginPoint = null;
    }

    @Override
    public void didUpdateDeviceHeading(TYLocationManager tyLocationManager, double v) {

    }

    @Override
    protected void onResume() {
        super.onResume();
        locationManager.startUpdateLocation();
    }

    @Override
    protected void onPause() {
        super.onPause();
        locationManager.stopUpdateLocation();
    }
    
    @Override
    public void didSolveRouteWithResult(TYOfflineRouteManager tyRouteManager, TYRouteResult rs) {

        hintLayer.removeAll();

        mRouteResult = rs;
        mapView.setRouteResult(rs);
        mapView.setRouteStart(mRouteBeginPoint);
        mapView.setRouteEnd(mRouteTargetPoint);

        mapView.showRouteResultOnCurrentFloor();

        List<TYRoutePart> routePartArray = mRouteResult
                .getRoutePartsOnFloor(currentMapInfo.getFloorNumber());
        if (routePartArray != null && routePartArray.size() > 0) {
            mCurrentRoutePart = routePartArray.get(0);
        }

        if (mCurrentRoutePart != null) {
            mRouteGuides = mRouteResult.getRouteDirectionalHint(mCurrentRoutePart);
        }
    }

    @Override
    public void didFailSolveRouteWithError(TYOfflineRouteManager tyRouteManager, Exception e) {
        Log.d(TAG, "didFailSolveRouteWithError");
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(getResources().getIdentifier("map_menu", "menu", getPackageName()), menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int navi = getResources().getIdentifier("navi", "id", getPackageName());
        int cancelroute = getResources().getIdentifier("cancelroute", "id", getPackageName());
        if (item.getItemId() == navi) {
          showCurrentPosition();
          return true;
        }
        else if (item.getItemId() == cancelroute) {
          cancelRoute();
          return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void cancelRoute(){
        mapView.resetRouteLayer();

        mRouteResult = null;
        mIsRouting = false;

    }

    private void showCurrentPosition(){
        // 判断地图当前显示楼层是否与定位结果一致，若不一致则切换到定位结果所在楼层（楼层自动切换）
        if ((mRouteBeginPoint != null) && (mapView.getCurrentMapInfo().getFloorNumber() != mRouteBeginPoint.getFloor())) {
            //TYMapInfo targetMapInfo = TYMapInfo.searchMapInfoFromArray(
            //        allMapInfos, mRouteBeginPoint.getFloor());
            //mapView.setFloor(targetMapInfo);
            mActionBar.setSelectedNavigationItem(mRouteBeginPoint.getFloor()-1);
        }

        mUserSelectFloor = false;
    }

    private void requestRoute() {
        if (mRouteTargetPoint == null || mRouteBeginPoint == null) {
            // TODO: adding tip to warn user choose two points
            return;
        }

        mapView.resetRouteLayer();

        mRouteResult = null;
        mIsRouting = true;

//        mapView.showRouteEndSymbolOnCurrentFloor(mRouteTargetPoint);
//        mapView.showRouteStartSymbolOnCurrentFloor(mRouteBeginPoint);

        routeManager.requestRoute(mRouteBeginPoint, mRouteTargetPoint);
    }

    @Override
    public boolean onNavigationItemSelected(int itemPosition, long itemId) {
        currentMapInfo = allMapInfos.get(itemPosition);
        mapView.setFloor(currentMapInfo);
        mUserSelectFloor = true;
        return true;
    }

    protected class FloorAdapter extends ArrayAdapter<TYMapInfo> {
        public FloorAdapter(Context context) {
            super(context, android.R.layout.simple_spinner_item, android.R.id.text1);
        }

        @Override
        public TYMapInfo getItem(int position) {
            return allMapInfos.get(position);
        }

        @Override
        public int getCount() {
            if (allMapInfos == null) {
                return 0;
            }
            return allMapInfos.size();
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View v =  super.getView(position, convertView, parent);
            TextView tv = (TextView) v.findViewById(android.R.id.text1);
            tv.setText(getItem(position).getFloorName());
            return v;
        }

        @Override
        public View getDropDownView(int position, View convertView, ViewGroup parent) {
            View v = convertView;
            if (v == null) {
                v = LayoutInflater.from(parent.getContext())
                        .inflate(android.R.layout.simple_spinner_dropdown_item, parent, false);
            }
            TextView tv = (TextView) v.findViewById(android.R.id.text1);
            tv.setText(getItem(position).getFloorName());
            return v;
        }
    }
}
