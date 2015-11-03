//
//  NaviTYMapViewController.h
//  MallSolution
//
//  Created by Leon Fu on 7/27/15.
//  Copyright (c) 2015 Cloudnapps. All rights reserved.
//

#import <Cordova/CDVPlugin.h>

#define THEME_BACKGROUND_COLOR [UIColor colorWithRed:189.0f/255.0f green:37.0f/255.0f blue:44.0f/255.0f alpha:1.0f]
#define THEME_FOREGROUND_COLOR [UIColor whiteColor]

@interface CDVMapNavigator: CDVPlugin

- (void) showMapNavigator:(CDVInvokedUrlCommand*)command;
- (void) showShopMap:(CDVInvokedUrlCommand*)command;

@end
