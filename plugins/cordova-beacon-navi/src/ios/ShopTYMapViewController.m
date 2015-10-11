//
//  ShopTYMapViewController.m
//  MallSolution
//
//  Created by Leon Fu on 7/27/15.
//  Copyright (c) 2015 Cloudnapps. All rights reserved.
//

#import "ShopTYMapViewController.h"
#import "SphereMenu.h"
#import "NaviTYMapViewController.h"
#import <TYMapSDK/TYMapSDK.h>
#import <TYLocationEngine/TYLocationEngine.h>

@interface ShopTYMapViewController () <TYLocationManagerDelegate, TYMapViewDelegate>
{
    TYLocationManager *locationManager;
    CLBeaconRegion *beaconRegion;
    
    TYPictureMarkerSymbol *locationSymbol;
    
    TYPoint *currentPoint;
    
    // 路径规划起点
    TYLocalPoint *startLocalPoint;
    // 路径规划终点
    TYLocalPoint *endLocalPoint;
    
    // 起点、终点、切换点标识符号
    TYPictureMarkerSymbol *startSymbol;
    TYPictureMarkerSymbol *endSymbol;
    TYPictureMarkerSymbol *switchSymbol;
    
    TYPoi* poi;
    
    int startFloor;
    int endFloor;
    int myFloor;
   
    TYPoi* startPoi;
    TYPoi* endPoi;
    
    TYPoint* mapPoint;
}

@property (nonatomic, strong) TYCity *currentCity;
@property (nonatomic, strong) TYBuilding *currentBuilding;
//@property (nonatomic, strong) TYMapInfo *currentMapInfo;
@property (nonatomic, strong) NSArray *allMapInfos;
@property (strong, nonatomic) TYMapView *mapView;

@end

@implementation ShopTYMapViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    _mapView = [[TYMapView alloc] initWithFrame:self.view.bounds];
    [self.view addSubview:_mapView];
    
    self.navigationController.navigationBar.tintColor = [UIColor blackColor];

    startFloor = endFloor = 0;
    startPoi = endPoi = nil;
    // Do any additional setup after loading the view.
        
    _currentCity = [TYCityManager parseCity:_cityID];
    _currentBuilding = [TYBuildingManager parseBuilding:_buildingID InCity: _currentCity];
        
    _allMapInfos = [TYMapInfo parseAllMapInfo:_currentBuilding];
    
    [self initLocationSettings];

    self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemCancel target:self action:@selector(close)];
    
    if(_poiID)
    {
        poi = [self.mapView getPoiOnCurrentFloorWithPoiID:_poiID layer:POI_ROOM];
        [self.mapView highlightPoi:poi];
        TYLocalPoint* pt = [self getPoiCenter:poi withFloor:self.mapView.currentMapInfo.floorNumber];
        endLocalPoint = [TYLocalPoint pointWithX:pt.x Y:pt.y Floor:self.mapView.currentMapInfo.floorNumber];
        endFloor = self.mapView.currentMapInfo.floorNumber;
        endSymbol = [TYPictureMarkerSymbol pictureMarkerSymbolWithImageNamed:@"end.png"];
        endSymbol.offset = CGPointMake(0, 22);
        [self.mapView setRouteEndSymbol:endSymbol];
        [self.mapView showRouteEndSymbolOnCurrentFloor:endLocalPoint];
        endPoi = poi;
        
        [self.mapView setRouteStartSymbol:startSymbol];
        
        self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithTitle: NSLocalizedString(@"带我去", nil) style:UIBarButtonItemStylePlain target:self action:@selector(route)];
        self.navigationItem.rightBarButtonItem.enabled = NO;
    }

    self.mapView.mapDelegate = self;
    self.title = self.mapView.currentMapInfo.floorName;
}

- (void) close
{
    [self dismissViewControllerAnimated:YES completion:nil];
}

- (void) route
{
    NaviTYMapViewController* mapNavigatorViewController = [[NaviTYMapViewController alloc] init];
    mapNavigatorViewController.floor = _floor;
    mapNavigatorViewController.poiID = _poiID;
    mapNavigatorViewController.cityID = _cityID;
    mapNavigatorViewController.buildingID = _buildingID;
    mapNavigatorViewController.userID = _userID;
    mapNavigatorViewController.licenseID = _licenseID;
    mapNavigatorViewController.beaconUUID = _beaconUUID;
    mapNavigatorViewController.beaconMajor = _beaconMajor;
    [self.navigationController pushViewController:mapNavigatorViewController animated:YES];
}

- (TYLocalPoint*) getPoiCenter:(TYPoi*) _poi withFloor:(int)floor
{
    TYLocalPoint* pt = [TYLocalPoint pointWithX:_poi.geometry.envelope.center.x Y:_poi.geometry.envelope.center.y Floor:floor];
    return pt;
}

#pragma mark -- dropdownList DataSource
- (NSInteger)numberOfSections
{
    return 1;
}
- (NSInteger)numberOfRowsInSection:(NSInteger)section
{
    return _allMapInfos.count;
}
- (NSString *)titleInSection:(NSInteger)section index:(NSInteger) index
{
    TYMapInfo* info = _allMapInfos[index];
    return info.floorName;
}
- (NSInteger)defaultShowSection:(NSInteger)section
{
    for(int i = 0; i < _allMapInfos.count; i++)
    {
        TYMapInfo* info = _allMapInfos[i];
        if(info.floorNumber == 1)
            return i;
    }
    return 0;
}

- (int) getFloorIndex:(NSString*)floorID
{
    int floor = 1;
    NSArray* array = [floorID componentsSeparatedByString:@"B"];
    if(array.count == 0)
    {
        array = [floorID componentsSeparatedByString:@"F"];
        if(array.count == 0)
            return floor;
    }
    else
        floor = -1;
    NSString* str = array[array.count-1];
    floor *= str.intValue;
    return  floor;
}

- (void)initLocationSettings
{
    [self.mapView initMapViewWithBuilding:_currentBuilding UserID:_userID License:_licenseID];
    
    if(_floor == 0)
        _floor = 1;
    
    TYMapInfo* mapInfo = [TYMapInfo searchMapInfoFromArray:_allMapInfos Floor: _floor];
    
    [self.mapView setFloorWithInfo:mapInfo];
    
    locationSymbol = [TYPictureMarkerSymbol pictureMarkerSymbolWithImageNamed:@"locationArrow.png"];
    
    [self.mapView setLocationSymbol:(TYMarkerSymbol *)locationSymbol];
    self.mapView.mapDelegate = self;

     // 定位的beacon参数
    beaconRegion = [[CLBeaconRegion alloc] initWithProximityUUID:[[NSUUID alloc] initWithUUIDString:_beaconUUID] major:_beaconMajor identifier:@""];
    
    //初始化定位引擎，会自动加载beacon数据库
    locationManager = [[TYLocationManager alloc] initWithBuilding:_currentBuilding];
    
    // 设置定位引擎代理
    locationManager.delegate = self;
    
    // 将beacon参数传递给定位引擎
    [locationManager setBeaconRegion:beaconRegion];
    
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    
    // 开启定位引擎
    [locationManager startUpdateLocation];
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    
    // 停止定位引擎
    [locationManager stopUpdateLocation];
}

- (void)TYLocationManager:(TYLocationManager *)manager didUpdateLocation:(TYLocalPoint *)newLocation
{
    self.navigationItem.rightBarButtonItem.enabled = YES;

    [self.mapView showLocation:newLocation];
}

- (void)TYLocationManagerdidFailUpdateLocation:(TYLocationManager *)manager
{
    [self.mapView removeLocation];
}

- (void)TYLocationManager:(TYLocationManager *)manager didUpdateDeviceHeading:(double)newHeading
{
    [self.mapView processDeviceRotation:newHeading];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
