//
//  CACustomer.h
//  CAProximityKit
//
//  Created by GongXian Cao on 14-10-23.
//  Copyright (c) 2014年 Cloudnapps. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface CACustomer : NSObject

@property (strong, nonatomic) NSString *customerID;
@property (strong, nonatomic) NSString *name;
@property (strong, nonatomic) NSString *email;
@property (strong, nonatomic) NSString *role;
@property (strong, nonatomic, readonly) NSMutableArray *tags;

-(void) set:(NSString *)attribute to: (id)value;
-(id) get:(NSString *)attribute;

-(void) save:(void (^)(void))success failure: (void (^) (NSError *)) failure;

@end
