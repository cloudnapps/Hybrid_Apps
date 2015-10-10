//
//  NaviTYMapViewController.h
//  MallSolution
//
//  Created by Leon Fu on 7/27/15.
//  Copyright (c) 2015 Cloudnapps. All rights reserved.
//

#import <Cordova/CDVPlugin.h>

@interface CDVMapNavigator: CDVPlugin

- (void) showMapNavigator:(CDVInvokedUrlCommand*)command;
- (void) showShopMap:(CDVInvokedUrlCommand*)command;

@end
