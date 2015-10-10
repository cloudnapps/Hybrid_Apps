//
//  CACampaignBase.h
//  CAProximityKit
//
//  Created by cloudnapps on 14-6-10.
//  Copyright (c) 2014年 Cloudnapps. All rights reserved.
//

#import <Foundation/Foundation.h>

enum CACampaignTypes {
    CACampaignTypeGeneral = 1,
    CACampaignTypePicture,
    CACampaignTypeVideo,
    CACampaignTypeProduct,
    CACampaignTypeWebSite,
    CACampaignTypeFile,
    CACampaignTypeCustom = 10,
    CACampaignTypeCommand
};

@interface CACampaignBase : NSObject <NSCoding>
@property NSString *mid;
@property NSString *cid;
@property NSString *name;
@property NSString *slogan;
@property NSDate *validFrom;
@property NSDate *validTo;
@property NSDictionary* data;
@property BOOL isFavorite;
@property NSURL *thumbnail;
@property NSDate *mcreatedAt;
@property NSDictionary* customFields;
- (id)initWithCampaignData:(NSDictionary *)data;

+ (CACampaignBase *) create: (NSDictionary *)data;

@end



