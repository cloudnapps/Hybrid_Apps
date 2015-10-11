//
//  CAWebSiteCampaign.h
//  CAProximityKit
//
//  Created by cloudnapps on 14-7-10.
//  Copyright (c) 2014年 Cloudnapps. All rights reserved.
//

#import "CACampaignBase.h"
#define CampaignKeyWebSiteURL @"website"

/**
 *  A website campaign
 */
@interface CAWebSiteCampaign : CACampaignBase <NSCoding>

@property NSURL *website;
@end
