//
//  CACommandCampaign.h
//  CAProximityKit
//
//  Created by GongXian Cao on 15/3/23.
//  Copyright (c) 2015年 Cloudnapps. All rights reserved.
//

#import "CACampaignBase.h"

@interface CACommandCampaign : CACampaignBase <NSCoding>
@property (strong, nonatomic) NSString *triggerDeviceUUID;
@property (strong, nonatomic) NSString *triggerCustomerID;
@end
