#import <Foundation/Foundation.h>

/**
 *  城市类
 */
@interface TYCity : NSObject

/**
 *  城市ID
 */
@property (nonatomic, strong) NSString *cityID;

/**
 *  城市名称
 */
@property (nonatomic, strong) NSString *name;

/**
 *  城市简称
 */
@property (nonatomic, strong) NSString *sname;

/**
 *  城市经度
 */
@property (readonly) double longitude;

/**
 *  城市纬度
 */
@property (readonly) double latitude;

/**
 *  当前状态
 *
 */
@property (assign) int status;


/**
 *  城市类的实例化方法
 *
 *  @param cityId 城市ID
 *  @param name   城市名称
 *  @param sname  城市简称
 *  @param lon    城市经度
 *  @param lat    城市纬度
 *
 *  @return 城市类实例
 */
- (id)initWithCityID:(NSString *)cityId Name:(NSString *)name SName:(NSString *)sname Lon:(double)lon Lat:(double)lat;


@end
