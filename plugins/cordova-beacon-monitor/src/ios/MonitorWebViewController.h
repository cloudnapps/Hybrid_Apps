//
//  MonitorWebViewController.h
//  ShakingDemo
//
//  Created by liangyu on 15/4/29.
//  Copyright (c) 2015年 cloud. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "CAProximityKit/CAProximityKit.h"
@interface MonitorWebViewController : UIViewController<UIWebViewDelegate>
@property (nonatomic, strong)UIWebView *webView;
@property (nonatomic, strong)NSURL *url;
@property (nonatomic,strong) CACampaignBase *campaign;

@end
