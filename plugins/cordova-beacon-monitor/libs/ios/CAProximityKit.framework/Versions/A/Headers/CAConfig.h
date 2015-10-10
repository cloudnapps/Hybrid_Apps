//
//  CAConfig.h
//  CAProximityKit
//
//  Created by GongXian Cao on 14-10-22.
//  Copyright (c) 2014年 Cloudnapps. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CAPLogLevel.h"

@interface CAConfig : NSObject

/**
 *  Get or set the app key
 */
@property NSString *appKey;

/**
 *  Get or set app secret
 */
@property NSString *appSecret;

/**
 *  Get or set the server URL. Default value is @"https://api.cloudnapps.com"
 */
@property NSString *serverURL;

/**
 *  Get or set the beacon UUID
 */
@property NSString *beaconUUID;

/**
 *  Get or set a flag indicating whether this app should run in production mode.
 */
@property BOOL productionMode;

/**
 *  Get or set the key used to persist data by this kit to NSUserDefaults standardUserDefaults
 */
@property NSString *localStrageKey;

/**
 *  Get or set the log level:
 *  CAPLogLevelOff - off
 *  CAPLogLevelError - error
 *  CAPLogLevelWarn - error + warn
 *  CAPLogLevelInfo - error + warn + info
 *  CAPLogLevelDebug - error + warn + info + debug
 *  CAPLogLevelVerbose - error + warn + info + verbose
 *  CAPLogLevelAll - all
 */
@property enum CAPLogLevel logLevel;

@property BOOL enablePrefetchPushContent;
@property BOOL autoFetchPushContent;

@end
