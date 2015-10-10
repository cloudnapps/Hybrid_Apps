//
//  CDVBeaconMonitor.h
//
//
//  Created by Leon Fu on 10/07/15.
//  Copyright (c) 2015 Cloudnapps. All rights reserved.
//

#import "CDVBeaconMonitor.h"
#import <CAProximityKit/CAProximityKit.h>
#import "AppDelegate.h"
#import "MonitorWebViewController.h"

@interface CDVBeaconMonitor()<CAProximityManagerDelegate>
{
}
@end

@implementation CDVBeaconMonitor

- (void) pluginInitialize
{
    [[NSNotificationCenter defaultCenter]addObserver:self
                                            selector:@selector(didReceiveLocalNotification:)
                                                name:CDVLocalNotification
                                              object:nil];
    [[UIApplication sharedApplication] registerUserNotificationSettings: [UIUserNotificationSettings
                                                                          settingsForTypes:UIUserNotificationTypeAlert|
                                                                          UIUserNotificationTypeBadge|UIUserNotificationTypeSound
                                                                          categories:nil]];
    if([CAProximityManager shared] == nil)
    {
        CAConfig *config = [CAConfig new];
        AppDelegate* delegate = self.appDelegate;
        config.serverURL = [delegate.viewController.settings objectForKey:@"serverurl"];
        config.appKey = [delegate.viewController.settings objectForKey:@"appkey"];
        config.appSecret = [delegate.viewController.settings objectForKey:@"appsecret"];
        config.beaconUUID = [delegate.viewController.settings objectForKey:@"beaconuuid"];
        config.productionMode = YES;
        
#ifdef DEBUG
        config.productionMode = NO;
#endif
        [CAProximityManager setup:config];
        [CAProximityManager shared].userSettings.sensitivity = 1;
        [CAProximityManager shared].userSettings.workingMode = CAProximityManagerWorkingModeHybridOfflineFirst;
        [[CAProximityManager shared].userSettings apply:nil failure:nil];
    }
    [CAProximityManager shared].delegate = self;
    [[UIApplication sharedApplication] setMinimumBackgroundFetchInterval:UIApplicationBackgroundFetchIntervalMinimum];
}

-(void)monitorByBeacon:(CDVInvokedUrlCommand*)command
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[CAProximityManager shared] startMonitoring];
    });
}

#pragma mark - UIAppliation Notification
- (void)didReceiveLocalNotification:(NSNotification*)notification
{
    UILocalNotification* localNotification = notification.object;
    if([[CAProximityManager shared] handleLocalNotification:localNotification])
    {
        [UIApplication sharedApplication].applicationIconBadgeNumber ++;
        return;
    }
    [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
}

#pragma mark - CAProximityManagerDelegate
-(void)proximityManager:(CAProximityManager *)manager didEnterRegion:
(CACampaignBase *)campaign
{
    [[CAProximityManager shared] openCampaign:campaign withObject:nil];
}

//
-(void)proximityManager:(CAProximityManager *)manager didOpenCampaign:(CACampaignBase *)campaign withObject:(id)obj
{
    if([campaign isKindOfClass:[CAWebSiteCampaign class]])
    {
        if([UIApplication sharedApplication].applicationIconBadgeNumber > 0)
            [UIApplication sharedApplication].applicationIconBadgeNumber --;
        CAWebSiteCampaign *webSiteCampaign = (CAWebSiteCampaign *)campaign;
        MonitorWebViewController *web = [[MonitorWebViewController alloc] init];
        web.url = webSiteCampaign.website;
        web.campaign = webSiteCampaign;
        UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:web];
        if ([UIApplication sharedApplication].applicationState != UIApplicationStateBackground)
        {
            __weak CDVBeaconMonitor* weakSelf = self;
            dispatch_async(dispatch_get_main_queue(), ^{
                [weakSelf.viewController presentViewController:nav animated:YES completion:NULL];
                
            });
        }
    }
}

@end