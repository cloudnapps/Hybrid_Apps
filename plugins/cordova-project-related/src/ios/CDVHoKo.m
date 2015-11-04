//
//  CDVHoKo.m
//
//
//  Created by Adrian Yin on 11/04/15.
//  Copyright (c) 2015 Cloudnapps. All rights reserved.
//

#import "CDVHoKo.h"

@interface CDVHoKo()<NSURLConnectionDataDelegate>
{
    
}

@end

@implementation CDVHoKo

- (void) pluginInitialize
{
    
}

- (void) checkConnection: (CDVInvokedUrlCommand*)command
{
    self.currentCallbackId = command.callbackId;
    NSString *urlString = [command.arguments objectAtIndex:0];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:urlString]];
    request.HTTPMethod = @"HEAD";
    NSURLConnection *connection = [NSURLConnection connectionWithRequest:request delegate:self];
    [connection start];
}

- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response
{
    [self didReceivedResponse:(NSHTTPURLResponse *)response];
}

- (NSURLRequest*) connection:(NSURLConnection *)connection willSendRequest:(NSURLRequest *)request redirectResponse:(NSURLResponse *)response
{
    if (!response)
    {
        return request;
    }
    
    [self didReceivedResponse:(NSHTTPURLResponse *)response];
    return nil;
}

- (void) didReceivedResponse:(NSHTTPURLResponse*) response
{
    if (!self.currentCallbackId)
    {
        return;
    }
    
    NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse*) response;
    
    NSMutableDictionary *dict = [NSMutableDictionary new];

    NSInteger statusCode = [httpResponse statusCode];
    [dict setObject:[NSNumber numberWithInteger:statusCode] forKey:@"code"];
    
    if (statusCode / 100 == 3) {
        [dict setObject:[httpResponse.allHeaderFields objectForKey:@"Location"] forKey:@"location"];
    }
    CDVCommandStatus commandStatus = CDVCommandStatus_OK;
    CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:commandStatus messageAsDictionary:dict];
    [self.commandDelegate sendPluginResult:commandResult callbackId:self.currentCallbackId];
    self.currentCallbackId = nil;
}
@end