//
//  CAPictureCampaign.h
//  CAProximityKit
//
//  Created by cloudnapps on 14-7-15.
//  Copyright (c) 2014年 Cloudnapps. All rights reserved.
//

#import "CACampaignBase.h"

@interface CAPictureCampaign : CACampaignBase <NSCoding>
@property NSArray *imageURLs;
@property NSURL *website;

@end
