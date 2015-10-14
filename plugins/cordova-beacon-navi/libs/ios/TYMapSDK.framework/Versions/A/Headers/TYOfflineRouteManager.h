//
//  TYOfflineRouteManager.h
//  MapProject
//
//  Created by innerpeacer on 15/10/11.
//  Copyright © 2015年 innerpeacer. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "TYRouteResult.h"
#import <TYMapData/TYMapData.h>
#import "TYPoint.h"
#import <ArcGIS/ArcGIS.h>

@class TYOfflineRouteManager;

@protocol TYOfflineRouteManagerDelegate <NSObject>

- (void)offlineRouteManager:(TYOfflineRouteManager *)routeManager didSolveRouteWithResult:(TYRouteResult *)routeResult OriginalLine:(AGSPolyline *)line;
- (void)offlineRouteManager:(TYOfflineRouteManager *)routeManager didFailSolveRouteWithError:(NSError *)error;

@end

@interface TYOfflineRouteManager : NSObject

@property (nonatomic, strong, readonly) TYPoint *startPoint;
@property (nonatomic, strong, readonly) TYPoint *endPoint;
@property (nonatomic, weak) id<TYOfflineRouteManagerDelegate> delegate;

+ (TYOfflineRouteManager *)routeManagerWithBuilding:(TYBuilding *)building MapInfos:(NSArray *)mapInfoArray;
- (void)requestRouteWithStart:(TYLocalPoint *)start End:(TYLocalPoint *)end;

@end
