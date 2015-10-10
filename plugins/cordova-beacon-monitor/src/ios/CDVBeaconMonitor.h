//
//  CDVShake.h
//  Cloudnapps
//
//  Created by Leon Fu on 10/07/15.
//  Copyright (c) 2015 Cloudnapps. All rights reserved.
//

#import <Cordova/CDVPlugin.h>

@interface CDVBeaconMonitor : CDVPlugin

@property(nonatomic,strong)NSString *currentCallbackId;

- (void)monitorByBeacon:(CDVInvokedUrlCommand*)command;
@end