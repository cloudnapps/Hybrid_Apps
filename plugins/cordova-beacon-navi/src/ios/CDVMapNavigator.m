//
//  NaviTYMapViewController.m
//  MallSolution
//
//  Created by Leon Fu on 7/27/15.
//  Copyright (c) 2015 Cloudnapps. All rights reserved.
//

#import "CDVMapNavigator.h"
#import "AppDelegate.h"
#import <TYMapSDK/TYMapSDK.h>
#import <TYLocationEngine/TYLocationEngine.h>
#import "SphereMenu.h"
#import "DropDownListView.h"
#import "NaviTYMapViewController.h"
#import "ShopTYMapViewController.h"

@interface CDVMapNavigator()
{
    NaviTYMapViewController* mapNavigatorViewController;
    ShopTYMapViewController* shopTYMapViewController;
}
@end

@implementation CDVMapNavigator

- (void) pluginInitialize
{
    NSString *resourceBundle = [[NSBundle mainBundle] pathForResource:@"MapResource" ofType:@"bundle"];
    [TYMapEnvironment setRootDirectoryForMapFiles:resourceBundle];
    
    [TYMapEnvironment initMapEnvironment];
}

- (void)showMapNavigator:(CDVInvokedUrlCommand*)command
{
    NSString* strPoiID = [command.arguments objectAtIndex:0];
    NSNumber* floorNum = [command.arguments objectAtIndex:1];
    AppDelegate* delegate = self.appDelegate;
    NSString* cityID = [delegate.viewController.settings objectForKey:@"cityid"];
    NSString* buildingID = [delegate.viewController.settings objectForKey:@"buildingid"];
    NSString* userID = [delegate.viewController.settings objectForKey:@"userid"];
    NSString* licenseID = [delegate.viewController.settings objectForKey:@"licenseid"];
    NSString* beaconUUID = [delegate.viewController.settings objectForKey:@"beaconuuid"];
    NSNumber* beaconMajor = [delegate.viewController.settings objectForKey:@"beaconmajor"];
    
    __weak CDVMapNavigator* weakSelf = self;
    [self.commandDelegate runInBackground:^{
        mapNavigatorViewController = [[NaviTYMapViewController alloc] init];
        mapNavigatorViewController.floor = floorNum.intValue;
        mapNavigatorViewController.poiID = strPoiID;
        mapNavigatorViewController.cityID = cityID;
        mapNavigatorViewController.buildingID = buildingID;
        mapNavigatorViewController.userID = userID;
        mapNavigatorViewController.licenseID = licenseID;
        mapNavigatorViewController.beaconUUID = beaconUUID;
        mapNavigatorViewController.beaconMajor = beaconMajor.intValue;
        UINavigationController* nav = [[UINavigationController alloc]
                                       initWithRootViewController:mapNavigatorViewController];
        dispatch_async(dispatch_get_main_queue(), ^{
            [weakSelf.viewController presentViewController:nav animated:YES completion:nil];
        });
    }];
}

- (void)showShopMap:(CDVInvokedUrlCommand*)command
{
    NSString* strPoiID = [command.arguments objectAtIndex:0];
    NSNumber* floorNum = [command.arguments objectAtIndex:1];
    AppDelegate* delegate = self.appDelegate;
    NSString* cityID = [delegate.viewController.settings objectForKey:@"cityid"];
    NSString* buildingID = [delegate.viewController.settings objectForKey:@"buildingid"];
    NSString* userID = [delegate.viewController.settings objectForKey:@"userid"];
    NSString* licenseID = [delegate.viewController.settings objectForKey:@"licenseid"];
    NSString* beaconUUID = [delegate.viewController.settings objectForKey:@"beaconuuid"];
    NSNumber* beaconMajor = [delegate.viewController.settings objectForKey:@"beaconmajor"];
    
    __weak CDVMapNavigator* weakSelf = self;
    [self.commandDelegate runInBackground:^{
        shopTYMapViewController = [[ShopTYMapViewController alloc] init];
        shopTYMapViewController.floor = floorNum.intValue;
        shopTYMapViewController.poiID = strPoiID;
        shopTYMapViewController.cityID = cityID;
        shopTYMapViewController.buildingID = buildingID;
        shopTYMapViewController.userID = userID;
        shopTYMapViewController.licenseID = licenseID;
        shopTYMapViewController.beaconUUID = beaconUUID;
        shopTYMapViewController.beaconMajor = beaconMajor.intValue;
        UINavigationController* nav = [[UINavigationController alloc]
                                       initWithRootViewController:shopTYMapViewController];
        dispatch_async(dispatch_get_main_queue(), ^{
            [weakSelf.viewController presentViewController:nav animated:YES completion:nil];
        });
    }];
}

@end
