//
//  ShopTYMapViewController.h
//  MallSolution
//
//  Created by Leon Fu on 7/27/15.
//  Copyright (c) 2015 Cloudnapps. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ShopTYMapViewController : UIViewController

@property(nonatomic, assign) int floor;
@property(nonatomic, copy) NSString* poiID;
@property(nonatomic, copy) NSString* cityID;
@property(nonatomic, copy) NSString* buildingID;
@property(nonatomic, copy) NSString* userID;
@property(nonatomic, copy) NSString* licenseID;
@property(nonatomic, copy) NSString* beaconUUID;
@property(nonatomic, assign) int beaconMajor;

@end
