//
//  CDVShake.h
//  Cloudnapps
//
//  Created by Leon Fu on 10/07/15.
//  Copyright (c) 2015 Cloudnapps. All rights reserved.
//

#import <Cordova/CDVPlugin.h>

@interface CDVShake : CDVPlugin

@property(nonatomic,strong)NSString *currentCallbackId;

- (void)shakeByBeacon:(CDVInvokedUrlCommand*)command;
@end

@interface ShakeViewController: UIViewController

@end
