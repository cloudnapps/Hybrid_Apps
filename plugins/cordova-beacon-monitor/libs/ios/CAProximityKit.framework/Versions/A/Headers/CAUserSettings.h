//
//  CAUserSettings.h
//  CAProximityKit
//
//  Created by GongXian Cao on 14-10-23.
//  Copyright (c) 2014年 Cloudnapps. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CAProximityManagerWorkingMode.h"

@interface CAUserSettings : NSObject

/**
 *  Get or set flag indicating that user want receive notification
 */
@property BOOL acceptNotification;

/**
 *  Get or set working mode
 */
@property enum CAProximityManagerWorkingMode workingMode;

/**
 *  Only push content that have these tags
 */
@property (strong, nonatomic, readonly) NSMutableArray *tags;
/**
 *  Apply user settings
 */

/**
 * Get or set sensitivity level, 1~3
 */
@property int sensitivity;

/**
 * Get or set the log level:
 *  CAPLogLevelOff - off
 *  CAPLogLevelError - error
 *  CAPLogLevelWarn - error + warn
 *  CAPLogLevelInfo - error + warn + info
 *  CAPLogLevelDebug - error + warn + info + debug
 *  CAPLogLevelVerbose - error + warn + info + verbose
 *  CAPLogLevelAll - all
 */
@property enum CAPLogLevel logLevel;

-(void) apply:(void (^)(void))success failure: (void (^) (NSError *)) failure;

@end
