//
//  CDVHoKo.h
//  Cloudnapps
//
//  Created by Adrian Yin on 11/4/15.
//
//

#import <Foundation/Foundation.h>

#import <Cordova/CDV.h>
#import <Cordova/CDVPlugin.h>

@interface CDVHoKo : CDVPlugin

@property(nonatomic,strong)NSString *currentCallbackId;

- (void)checkConnection:(CDVInvokedUrlCommand*)command;
@end