//
//  CAPLogLevel.h
//  CAProximityKit
//
//  Created by GongXian Cao on 15-1-20.
//  Copyright (c) 2015年 Cloudnapps. All rights reserved.
//

#ifndef CAProximityKit_CAPLogLevel_h
#define CAProximityKit_CAPLogLevel_h

enum CAPLogFlag {
    CAPLogFlagError   = (1 << 0),  // 0...00001
    CAPLogFlagWarn    = (1 << 1),  // 0...00010
    CAPLogFlagInfo    = (1 << 2),  // 0...00100
    CAPLogFlagDebug   = (1 << 3),  // 0...01000
    CAPLogFlagVerbose = (1 << 4)   // 0...10000
};


enum CAPLogLevel {
    CAPLogLevelOff = 0,
    CAPLogLevelError = CAPLogFlagError,
    CAPLogLevelWarn = CAPLogFlagError | CAPLogFlagWarn,
    CAPLogLevelInfo = CAPLogFlagError | CAPLogFlagWarn | CAPLogFlagInfo,
    CAPLogLevelDebug = CAPLogFlagError | CAPLogFlagWarn | CAPLogFlagDebug,
    CAPLogLevelVerbose = CAPLogFlagError | CAPLogFlagWarn | CAPLogFlagDebug | CAPLogFlagVerbose,
    CAPLogLevelAll = 0xffffffff
};

#endif