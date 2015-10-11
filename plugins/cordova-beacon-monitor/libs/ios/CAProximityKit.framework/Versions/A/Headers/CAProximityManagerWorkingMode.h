//
//  CAProximityWorkingMode.h
//  CAProximityKit
//
//  Created by GongXian Cao on 15-1-6.
//  Copyright (c) 2015年 Cloudnapps. All rights reserved.
//

/**
 *  Working mode of the SDK
 */
enum CAProximityManagerWorkingMode {
    /**
     *  Default working mode, the same as OnlineOnly
     */
    CAProximityManagerWorkingModeDefault = 0,

    /**
     *  OnlineOnly mode, meaning SDK will connect to backend server to retrieve the content and upload user activity data. This mode may still use cache to decrease the request network loads to the server.
     */
    CAProximityManagerWorkingModeOnlineOnly,

    /**
     *  OfflineOnly mode, meaning SDK won't connect to backend server at all, so all logic is to be implemented by app itself.
     */
    CAProximityManagerWorkingModeOfflineOnly,

    /**
     *  Hybrid mode, meaning SDK will give chance to app to handle the event on client side, and connect to backend server only if the app neglect the event. All user activity data will be uploaded to backend server.
     */
    CAProximityManagerWorkingModeHybridOnlineFirst,

    /**
     *  Hybrid mode, meaning SDK will give chance to app to handle the event on client side, and connect to backend server only if the app neglect the event. All user activity data will be uploaded to backend server.
     */
    CAProximityManagerWorkingModeHybridOfflineFirst

};