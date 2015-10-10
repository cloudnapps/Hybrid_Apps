//
//  CAProximityManagerDelegate.h
//  CAProximityKit
//
//  Created by cloudnapps on 14-6-10.
//  Copyright (c) 2014年 Cloudnapps. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CAWebSiteCampaign.h"
#import "CACampaignBase.h"

#import "CAFileCampaign.h"
#import "CAWebSiteCampaign.h"
#import "CAPictureCampaign.h"
#import "CAVideoCampaign.h"
#import "CACustomCampaign.h"
#import "CACommandCampaign.h"

@class CAProximityManager;

@protocol CAProximityManagerDelegate <NSObject>

@optional

/**
 *  Triggered when user entered a venue which is covered by iBeacon signal. This is the time to show a welcome on app UI. However, it doesn't mean the user walked inside.
 *
 */
-(void) proximityManagerDidEnterVenue:(CAProximityManager *) manager;

/**
 *  Triggered when user exited a venue which is covered by iBeacon signal.
 *
 */
-(void) proximityManagerDidExitVenue:(CAProximityManager *) manager;

/**
 *  Triggered when user entered a certain region in a venue
 *
 *  @param campagin: a campagin object associated with this region and venue on the backend server
 */
-(void) proximityManager:(CAProximityManager *) manager didEnterRegion: (CACampaignBase *) campaign;

/**
 *  Triggered when user open a campaign
 *
 *  @param campagin: a campagin object user choose to view
 */
-(void) proximityManager:(CAProximityManager *) manager didOpenCampaign: (CACampaignBase *) campaign withObject:(id)obj;

/**
 *  Triggered when the SDK failed to monitor iBeacon signals, e.g. when BlueTooth is disabled.
 */
-(void) proximityManager:(CAProximityManager *) manager didFailToMonitorWithError:(NSError *)error;

@end
