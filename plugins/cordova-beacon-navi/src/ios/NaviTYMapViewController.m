//
//  NaviTYMapViewController.m
//  MallSolution
//
//  Created by Leon Fu on 11/27/15.
//  Copyright (c) 2015 Cloudnapps. All rights reserved.
//

#import "CDVMapNavigator.h"
#import "NaviTYMapViewController.h"
#import <TYMapSDK/TYMapSDK.h>
#import <TYLocationEngine/TYLocationEngine.h>
#import "SphereMenu.h"
#import "DropDownListView.h"
#import "ShopTYMapViewController.h"

@interface NaviTYMapViewController () <TYLocationManagerDelegate, TYOfflineRouteManagerDelegate, TYMapViewDelegate, DropDownChooseDelegate,DropDownChooseDataSource, SphereMenuDelegate>
{
    DropDownListView *_menu;
    
    TYLocationManager *locationManager;
    CLBeaconRegion *beaconRegion;
    
    TYPictureMarkerSymbol *locationSymbol;
    
    // 路径管理器
    TYOfflineRouteManager *routeManager;
    
    TYPoint *currentPoint;
    
    // 路径规划起点
    TYLocalPoint *startLocalPoint;
    // 路径规划终点
    TYLocalPoint *endLocalPoint;
    
    TYLocalPoint*myLocalPoint;
    
    // 路径规划结果
    TYRouteResult *routeResult;
    
    // 起点、终点、切换点标识符号
    TYPictureMarkerSymbol *startSymbol;
    TYPictureMarkerSymbol *endSymbol;
    TYPictureMarkerSymbol *switchSymbol;
    
    //TYPoi* poi;
    
    int startFloor;
    int endFloor;
    int myFloor;
    TYPoi* startPoi;
    TYPoi* endPoi;
    
    SphereMenu *sphereMenu;
    
    TYPoint* mapPoint;
    
    BOOL isRouting;
    BOOL isMyRouting;
    
}

@property (nonatomic, strong) TYCity *currentCity;
@property (nonatomic, strong) TYBuilding *currentBuilding;
//@property (nonatomic, strong) TYMapInfo *currentMapInfo;
@property (nonatomic, strong) NSArray *allMapInfos;
@property (strong, nonatomic) TYMapView *mapView;

@end

@implementation NaviTYMapViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    _mapView = [[TYMapView alloc] initWithFrame:self.view.bounds];
    [self.view addSubview:_mapView];
    
    startFloor = endFloor = 0;
    startPoi = endPoi = nil;
    
    // Do any additional setup after loading the view.
    
    _currentCity = [TYCityManager parseCity:_cityID];
    _currentBuilding = [TYBuildingManager parseBuilding:_buildingID InCity: _currentCity];
    
    _allMapInfos = [TYMapInfo parseAllMapInfo:_currentBuilding];
    
    UIPanGestureRecognizer *panGesture=[[UIPanGestureRecognizer alloc]initWithTarget:self action:@selector(handlePanGesture:)];
    [self.mapView addGestureRecognizer:panGesture];
    
    [self initLocationSettings];
    
    [self initRouteSettings];
    
    self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithTitle: NSLocalizedString(@"关闭", nil) style:UIBarButtonItemStylePlain target:self action:@selector(close)];
    
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithTitle: NSLocalizedString(@"我在哪", nil) style:UIBarButtonItemStylePlain target:self action:@selector(routeAction)];
    
    self.navigationItem.rightBarButtonItem.enabled = NO;
    
    _menu = [[DropDownListView alloc] initWithFrame:CGRectMake(0, 0, 100, 64) dataSource:self delegate:self withTextColor:THEME_FOREGROUND_COLOR withBackgroundColor:[UIColor clearColor]];
    [_menu setDropDownTextColor:THEME_FOREGROUND_COLOR withBackgroundColor:THEME_BACKGROUND_COLOR];
    _menu.mSuperView = self.view;
    self.navigationItem.titleView = _menu;
    
    
    if(_poiID && [_poiID isKindOfClass:[NSString class]] && _poiID.length)
    {
        endPoi = [self.mapView getPoiOnCurrentFloorWithPoiID:_poiID layer:POI_ROOM];
        [self.mapView highlightPoi:endPoi];
        TYLocalPoint* pt = [self getPoiCenter:endPoi withFloor:self.mapView.currentMapInfo.floorNumber];
        endLocalPoint = [TYLocalPoint pointWithX:pt.x Y:pt.y Floor:self.mapView.currentMapInfo.floorNumber];
        endFloor = self.mapView.currentMapInfo.floorNumber;
        [self.mapView showRouteEndSymbolOnCurrentFloor:endLocalPoint];
        [self.mapView setRouteStartSymbol:startSymbol];
        
        isMyRouting = YES;
        isRouting = YES;
    }
    else
    {
        isRouting = NO;
        isMyRouting = NO;
    }
    
    self.mapView.mapDelegate = self;
    //self.mapView.backgroundColor = APP_GOLD_BLACK_COLOR;
    
    //self.title = self.mapView.currentMapInfo.floorName;
    
    UIImage* image1 = [UIImage imageNamed:@"start_left"];
    UIImage* image2 = [UIImage imageNamed:@"end_right"];
    sphereMenu = [[SphereMenu alloc] initWithStartPoint:CGPointMake(CGRectGetWidth(self.view.frame) / 2, 320) startImage:nil submenuImages:@[image1, image2]];
    sphereMenu.sphereDamping = 0.3;
    sphereMenu.sphereLength = 20;
    sphereMenu.delegate = self;
    [self.view addSubview:sphereMenu];
}

- (void) close
{
    if(isMyRouting || isRouting)
    {
        startLocalPoint = nil;
        endLocalPoint = nil;
        startPoi = endPoi = nil;
        [self.mapView resetRouteLayer];
        [self.mapView clearSelection];
        isMyRouting = NO;
        isRouting = NO;
        self.navigationItem.leftBarButtonItem.title = NSLocalizedString(@"关闭", nil);
        self.navigationItem.rightBarButtonItem.title = NSLocalizedString(@"我在哪", nil);
    }
    else
        [self dismissViewControllerAnimated:YES completion:nil];
}

- (TYLocalPoint*) getPoiCenter:(TYPoi*) _poi withFloor:(int)floor
{
    TYLocalPoint* pt = [TYLocalPoint pointWithX:_poi.geometry.envelope.center.x Y:_poi.geometry.envelope.center.y Floor:floor];
    return pt;
}

- (void) handlePanGesture:(UIGestureRecognizer*) sender
{
    [self.mapView clearSelection];
    [sphereMenu hideMenu];
    [self highlightStartAndEndPoi];
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

#pragma mark -- dropDownListDelegate
-(void) chooseAtSection:(NSInteger)section index:(NSInteger)index
{
    [self changeMapInfo:_allMapInfos[index]];
}

- (void) changeMapInfo:(TYMapInfo*)mapInfo
{
    [sphereMenu hideMenu];
    double res = self.mapView.resolution;
    [self.mapView setFloorWithInfo:mapInfo];
    [self.mapView zoomToResolution:res/0.9f animated:YES];
    [self performSelector:@selector(zoomOut:) withObject:@(res) afterDelay:0.5];
    [routeManager requestRouteWithStart:startLocalPoint End:endLocalPoint];
    [self highlightStartAndEndPoi];
    
    if(isMyRouting)
    {
        if(mapInfo.floorNumber != myFloor)
        {
            isRouting = NO;
        }
        else
        {
            isRouting = YES;
        }
    }
}

- (void) zoomOut:(NSNumber*)res
{
    [self.mapView zoomToResolution:res.doubleValue animated:YES];
}

- (void) routeAction
{
    if(self.mapView.currentMapInfo.floorNumber != myFloor)
    {
        TYMapInfo* mapInfo = [TYMapInfo searchMapInfoFromArray:_allMapInfos Floor: myFloor];
        [_menu setTitle:mapInfo.floorName inSection:0];
        [self changeMapInfo:mapInfo];
        return;
    }
    else //same floor
    {
        isMyRouting = YES;
        startLocalPoint = nil;
        startPoi = nil;
        [self.mapView resetRouteLayer];
        [self.mapView clearSelection];
        [self highlightStartAndEndPoi];
        [self route];
    }
}

- (void) route
{
    self.navigationItem.leftBarButtonItem.title = NSLocalizedString(@"取消", nil);
    if(startLocalPoint == nil)
    {
        startLocalPoint = myLocalPoint;
        startFloor = myFloor;
    }
    [routeManager requestRouteWithStart:startLocalPoint End:endLocalPoint];
    if(self.mapView.currentMapInfo.floorNumber != startFloor)
    {
        TYMapInfo* mapInfo = [TYMapInfo searchMapInfoFromArray:_allMapInfos Floor: startFloor];
        [_menu setTitle:mapInfo.floorName inSection:0];
        [self changeMapInfo:mapInfo];
    }
//    if(startPoi)
//        [self.mapView zoomToGeometry:startPoi.geometry withPadding:300.0f animated:YES];
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
    
    locationSymbol = [TYPictureMarkerSymbol pictureMarkerSymbolWithImageNamed:@"locationArrow"];
    
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

- (void) initRouteSettings
{
    // 初始化路径管理器，并设置代理
    //routeManager = [TYRouteManager routeManagerWithBuilding:self.currentBuilding credential:[TYMapEnvironment defaultCredential] MapInfos:self.allMapInfos];
    routeManager = [TYOfflineRouteManager routeManagerWithBuilding:self.currentBuilding MapInfos:self.allMapInfos];
    routeManager.delegate = self;
    
    startSymbol = [TYPictureMarkerSymbol pictureMarkerSymbolWithImageNamed:@"start.png"];
    startSymbol.offset = CGPointMake(0, 22);
    
    endSymbol = [TYPictureMarkerSymbol pictureMarkerSymbolWithImageNamed:@"end.png"];
    endSymbol.offset = CGPointMake(0, 22);
    
    switchSymbol = [TYPictureMarkerSymbol pictureMarkerSymbolWithImageNamed:@"nav_exit.png"];
    
    [self.mapView setRouteEndSymbol:endSymbol];
    [self.mapView setRouteSwitchSymbol:switchSymbol];
    
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    
    // 开启定位引擎
    [locationManager startUpdateLocation];
    //locationManager.requestTimeOut = 10000;
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    
    // 停止定位引擎
    [locationManager stopUpdateLocation];
}
//实时更新位置
- (void)TYLocationManager:(TYLocationManager *)manager didUpdateLocation:(TYLocalPoint *)newLocation
{
    if(endPoi)
        self.navigationItem.rightBarButtonItem.enabled = YES;
    else
        self.navigationItem.rightBarButtonItem.enabled = NO;
    
    myLocalPoint = newLocation;
    myFloor = newLocation.floor;
    
    self.navigationItem.rightBarButtonItem.title = NSLocalizedString(@"我在哪", nil);
    if(newLocation.floor == self.mapView.currentMapInfo.floorNumber)
    {
        [self.mapView showLocation:newLocation];
        if(endPoi)
            self.navigationItem.rightBarButtonItem.title = NSLocalizedString(@"带我去", nil);
    }
    
    if(isMyRouting && isRouting)
    {
        startLocalPoint = [TYLocalPoint pointWithX:newLocation.x Y:newLocation.y Floor:newLocation.floor];
        if([routeResult isDeviatingFromRoute:newLocation WithThrehold:4.0f])
        {
            startLocalPoint = [TYLocalPoint pointWithX:newLocation.x Y:newLocation.y Floor:self.mapView.currentMapInfo.floorNumber];
        }
        if(endLocalPoint != nil && [newLocation distanceWith:endLocalPoint] < 2.0f)
        {
            UIAlertView* alert = [[UIAlertView alloc]initWithTitle:nil message:@"恭喜你到达目的地！" delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil];
            [alert show];
            startLocalPoint = endLocalPoint = nil;
            startPoi = endPoi = nil;
            [self.mapView resetRouteLayer];
            [self.mapView clearSelection];
            isMyRouting = NO;
            isRouting = NO;
            return;
        }
        if(newLocation.floor != self.mapView.currentMapInfo.floorNumber)
        {
            [self.mapView setFloorWithInfo:[TYMapInfo searchMapInfoFromArray:self.allMapInfos Floor:newLocation.floor]];
        }
        [routeManager requestRouteWithStart:startLocalPoint End:endLocalPoint];
    }
}

- (void)TYLocationManagerdidFailUpdateLocation:(TYLocationManager *)manager
{
    [self.mapView removeLocation];
    if(endPoi == nil || startPoi == nil)
        self.navigationItem.rightBarButtonItem.enabled = NO;
}

- (void)TYLocationManager:(TYLocationManager *)manager didUpdateDeviceHeading:(double)newHeading
{
    [self.mapView processDeviceRotation:newHeading];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
 #pragma mark - Navigation
 
 // In a storyboard-based application, you will often want to do a little preparation before navigation
 - (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
 // Get the new view controller using [segue destinationViewController].
 // Pass the selected object to the new view controller.
 }
 */

- (void)TYMapView:(TYMapView *)mapView didClickAtPoint:(CGPoint)screen mapPoint:(TYPoint *)mappoint
{
    TYLocalPoint* pt = [TYLocalPoint pointWithX:mappoint.x Y:mappoint.y Floor:self.mapView.currentMapInfo.floorNumber];
    TYPoi* p = nil;
    mapPoint = mappoint;
    if(pt && [pt isKindOfClass:[NSNull class]] == NO)
    {
        @try {
            p = [self.mapView extractRoomPoiOnCurrentFloorWithX: pt.x Y:pt.y];
        }
        @catch (NSException *exception) {
            p = nil;
        }
        @finally {
        }
    }
    
    [self highlightStartAndEndPoi];
    if(p)
    {
        [self.mapView highlightPoi:p];
        [sphereMenu showMenu:screen];
    }
    else
    {
        [sphereMenu hideMenu];
    }
}

- (void) highlightStartAndEndPoi
{
    if(startPoi)
        [self.mapView highlightPoi:startPoi];
    if(endPoi)
        [self.mapView highlightPoi:endPoi];
}

- (void)sphereDidSelected:(int)index
{
    [self.mapView resetRouteLayer];
    [self.mapView clearSelection];
    
    if(index == 0)
    {
        startLocalPoint = [TYLocalPoint pointWithX:mapPoint.x Y:mapPoint.y Floor:self.mapView.currentMapInfo.floorNumber];
        startFloor = self.mapView.currentMapInfo.floorNumber;
        TYPoi* p = [self.mapView extractRoomPoiOnCurrentFloorWithX: startLocalPoint.x Y:startLocalPoint.y];
        startPoi = p;
        //startLocalPoint = [self getPoiCenter:startPoi withFloor:startFloor];
        [self.mapView setRouteStartSymbol:startSymbol];
        [self.mapView showRouteStartSymbolOnCurrentFloor:startLocalPoint];
    }
    else
    {
        endLocalPoint = [TYLocalPoint pointWithX:mapPoint.x Y:mapPoint.y Floor:self.mapView.currentMapInfo.floorNumber];
        endFloor = self.mapView.currentMapInfo.floorNumber;
        TYPoi* p = [self.mapView extractRoomPoiOnCurrentFloorWithX: endLocalPoint.x Y:endLocalPoint.y];
        endPoi = p;
        //endLocalPoint = [self getPoiCenter:endPoi withFloor:endFloor];
        [self.mapView setRouteEndSymbol:endSymbol];
        [self.mapView showRouteEndSymbolOnCurrentFloor:endLocalPoint];
        if(isMyRouting)
        {
            startLocalPoint = nil;
            [self.mapView resetRouteLayer];
            isMyRouting = NO;
            return;
        }
        
    }
    [self highlightStartAndEndPoi];
    if(startPoi && endPoi)
    {
        isMyRouting = NO;
        isRouting = YES;
        [self route];
    }
}

- (void)offlineRouteManager:(TYOfflineRouteManager *)routeManager didSolveRouteWithResult:(TYRouteResult *)rs
{
    routeResult = rs;
    
    // 将结果传递给地图视图
    [self.mapView setRouteResult:rs];
    
    [self.mapView setRouteStart:startLocalPoint];
    [self.mapView setRouteEnd:endLocalPoint];
    
    // 显示路径规划在当前楼层的部分，切换楼层后再次调用此方法
    [self.mapView showRouteResultOnCurrentFloor];
}

- (void)offlineRouteManager:(TYOfflineRouteManager *)routeManager didFailSolveRouteWithError:(NSError *)error
{
    NSLog(@"================%@", error.description);
}

#pragma mark - View rotation

- (BOOL)shouldAutorotate {
    return YES;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
    return UIInterfaceOrientationMaskPortrait;
}

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation {
    return UIInterfaceOrientationPortrait;
}

@end
