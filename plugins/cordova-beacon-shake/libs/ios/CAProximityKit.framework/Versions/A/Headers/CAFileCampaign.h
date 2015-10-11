//
//  CAFileCampaign.h
//  CAProximityKit
//
//  Created by GongXian Cao on 14-11-20.
//  Copyright (c) 2014年 Cloudnapps. All rights reserved.
//

#import "CACampaignBase.h"
@interface CACampaignFile : NSObject
@property NSString *id;
@property NSString *filename;
@property NSString *contentType;
@property NSURL *url;
@end

@interface CAFileCampaign : CACampaignBase
@property NSArray *files;
@end
