//
//  CAProximityManager.h
//  CAProximityKit
//
//  Created by cloudnapps on 14-6-10.
//  Copyright (c) 2014年 cloudnapps.com All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "CAProximityManagerDelegate.h"
#import "CAConfig.h"
#import "CACustomer.h"
#import "CAUserSettings.h"


@interface CAProximityManager : NSObject

/**
 *  Delegate of CAProximityManager
 */
@property NSObject<CAProximityManagerDelegate>* delegate;

/**
 *  Get the currently nearest beacon region name/identifier.
 */
@property (readonly) NSString *nearestBeaconRegion;

/**
 *  Get the customer. You can then set customer information and save to the cloud.
 */
@property (readonly) CACustomer *customer;

/**
 *  Get the user settings. You can then set user settings and save to the cloud.
 */
@property (readonly) CAUserSettings *userSettings;

/**
 *  Check if this feature available on this device
 *
 *  @return YES for available, NO otherwise
 */
+ (BOOL) available;

/**
 *  Setup the manager with given config
 *
 *  @return the CAProximityManager reference
 */

+ (CAProximityManager *) setup: (CAConfig *)config;

/**
 *  A convenient place to get your app’s proximity manager.
 *
 *  @return the CAProximityManager reference you saved before
 */
+ (CAProximityManager*) shared;

/**
 *  Pass device token returned by application:didRegisterForRemoteNotificationsWithDeviceToken: method in your AppDelegate to iBeacon server
 *
 *  @param deviceToken: device token
 */
- (void) setRemoteNotificationDeviceToken:(NSData *)deviceToken;

/**
 *  Start the manager to work
 */
- (void) startMonitoring;

/**
 * Shake
 */
- (void) shake:(void (^)(NSArray *campaigns))success failure:(void (^)(NSError *err))failure;

/**
 *  Reset monitor status
 */
- (void) reset;

/**
 *  Call this method at the beginning of application:didReceiveRemoteNotification: in your AppDelegate to handle remote notifications sent from our platform
 *
 *  @param userInfo: the original userInfo object representing the remote notification.
 *
 *  @return YES if it's handled by us; otherwise it belongs to your app's own remote notification so you should go on with your own handling.
 */
- (BOOL) handleRemoteNotification:(NSDictionary *)userInfo;

/**
 *  Call this method at the beginning of application:didReceiveLocalNotification: in your AppDelegate to handle local notifications sent from our platform
 *
 *  @param  notification: the original notification object representing the local notification.
 *
 *  @return YES if it's handled by us; otherwise it belongs to your app's own local notification so you should go on with your own handling.
 */
- (BOOL) handleLocalNotification:(UILocalNotification *)notification;


/**
 *  Open a campaign to get campaign details with CampaignBase instance.
 *  After the campaign is opened, didOpenCampaign:withObject delegate will be called
 *
 *  @param campaign: the CampaignBase instance for which to get the details.
 *  @param obj: The user defined object to pass additional data to didOpenCampaign:withObject: delegate when campaign is opened.
 */
- (void) openCampaign:(CACampaignBase *)campaign withObject:(id)obj;

/**
 *  synchronize assets from server
 */
- (void) synchronize:(void (^)())success failure:(void (^)(NSError *error))failure;

/**
 *  get campaigns received before and after
 */
- (void) getCampaignsReceivedBefore:(NSDate *)before after: (NSDate *)after success:(void (^)(NSArray *campaigns, int count)) success failure:(void (^)(NSError *))failure;

/**
 *  present campaign with default UI
 */
- (void) presentCampaign: (CACampaignBase *)campaign;

/**
 * upload log for supporting purpose
 */
- (void) uploadLog:(void (^)())success failure:(void (^)(NSError *error))failure;

- (void) getLocations: (void (^)(id locations))success failure:(void (^)(NSError *error))failure;

- (void) getAppInfo: (void (^)(id info))success failure:(void (^)(NSError *error))failure;

- (BOOL) webView: (UIWebView *)webView handleBridgeServiceCall: (NSURLRequest*)request success: (void (^)())success failure: (void (^)(NSError *error))failure;

@end
