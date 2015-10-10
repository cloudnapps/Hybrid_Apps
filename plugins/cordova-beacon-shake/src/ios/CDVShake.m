//
//  CDVShake.h
//
//  
//  Created by Leon Fu on 10/07/15.
//  Copyright (c) 2015 Cloudnapps. All rights reserved.
//

#import "CDVShake.h"
#import <AudioToolbox/AudioToolbox.h>
#import <CAProximityKit/CAProximityKit.h>
#import <CoreMotion/CoreMotion.h>
#import <math.h>
#import "AppDelegate.h"
#import "SvGifView.h"
#import "WebViewController.h"

#define MAX_RETRY 4
#define GRAVITY 9.81
#define TIME_INTERNVAL 0.5

@interface CDVShake()
{
    ShakeViewController* shakeViewController;
}
@end

@implementation CDVShake

- (void) pluginInitialize
{
    if([CAProximityManager shared] == nil)
    {
         CAConfig *config = [CAConfig new];
        AppDelegate* delegate = self.appDelegate;
        config.serverURL = [delegate.viewController.settings objectForKey:@"serverurl"];
        config.appKey = [delegate.viewController.settings objectForKey:@"appkey"];
        config.appSecret = [delegate.viewController.settings objectForKey:@"appsecret"];
        config.beaconUUID = [delegate.viewController.settings objectForKey:@"beaconuuid"];
        config.productionMode = YES;   

    #ifdef DEBUG
        config.productionMode = NO;
    #endif
        [CAProximityManager setup:config];
        [CAProximityManager shared].userSettings.sensitivity = 1;
        [CAProximityManager shared].userSettings.workingMode = CAProximityManagerWorkingModeHybridOfflineFirst;
        [[CAProximityManager shared].userSettings apply:nil failure:nil];
    }
}

-(void)shakeByBeacon:(CDVInvokedUrlCommand*)command
{
    __weak CDVShake* weakSelf = self;
    [self.commandDelegate runInBackground:^{
        if(shakeViewController == nil)
            shakeViewController = [[ShakeViewController alloc] init];
        UINavigationController* nav = [[UINavigationController alloc]
                    initWithRootViewController:shakeViewController];
        dispatch_async(dispatch_get_main_queue(), ^{
            [weakSelf.viewController presentViewController:nav animated:YES completion:nil];
        });
    }];
}

@end

@interface ShakeViewController()<CAProximityManagerDelegate>
{
    SvGifView *_gifView;
    UILabel* _labelView;
    SystemSoundID _sound;
    BOOL _isShaking;
    NSString* _prevCampaginId;
    NSInteger _tryCount;
    CMMotionManager* _motionManager;
}
@end

@implementation ShakeViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    _prevCampaginId = nil;
    _isShaking = NO;
    
    [[NSNotificationCenter defaultCenter]addObserver:self
                                            selector:@selector(applicationDidBecomeActive)
                                                name:UIApplicationDidBecomeActiveNotification
                                              object:nil];

    [CAProximityManager shared].delegate = self;
    [[CAProximityManager shared] startMonitoring];

    self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemCancel target:self action:@selector(close)];

    [self loadGifView];
    
    self.view.backgroundColor = [UIColor colorWithWhite:74/255.0f alpha:1];
    _labelView = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, 500, 50)];
    _labelView.textAlignment = NSTextAlignmentCenter;
    _labelView.textColor = [UIColor whiteColor];
    [self.view addSubview:_labelView];
    
    
    CFBundleRef mainBundle = CFBundleGetMainBundle();
    CFURLRef soundFileURLRef = CFBundleCopyResourceURL(mainBundle, CFSTR("shaking"),
                                                       CFSTR("wav"), NULL);
    AudioServicesCreateSystemSoundID(soundFileURLRef, &_sound);

    _motionManager = [[CMMotionManager alloc] init];
    if(_motionManager.accelerometerAvailable)
    {
        _motionManager.accelerometerUpdateInterval = TIME_INTERNVAL;
    }
}

- (void) close
{
    [_motionManager stopAccelerometerUpdates];
    [self dismissViewControllerAnimated:YES completion:nil];
}

- (void)loadGifView{
    NSURL *fileUrl = [[NSBundle mainBundle] URLForResource:@"shaking" withExtension:@"gif"];
    _gifView = [[SvGifView alloc]initWithFrame:CGRectMake(0, 0, 250, 250) fileURL:fileUrl];
    _gifView.backgroundColor = [UIColor clearColor];
    _gifView.autoresizingMask = UIViewAutoresizingFlexibleBottomMargin | UIViewAutoresizingFlexibleLeftMargin | UIViewAutoresizingFlexibleRightMargin;
    [self.view addSubview:_gifView];
}

- (void) viewWillAppear:(BOOL)animated
{
    _isShaking = NO;
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    _gifView.center = self.view.center;
    [_gifView startGif];
    _labelView.center = CGPointMake(self.view.center.x, self.view.center.y*2-55);
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(void)proximityManager:(CAProximityManager *)manager didOpenCampaign:(CACampaignBase *)campaign withObject:(id)obj
{
    if ([campaign isKindOfClass:[CACustomCampaign class]])
    {
        CACustomCampaign* customCampaign = (CACustomCampaign *)campaign;
        NSMutableString* str = [[NSMutableString alloc]init];
        for(NSString* key in customCampaign.customFields)
        {
            [str appendFormat:@"%@ : %@\n", key, customCampaign.customFields[key]];
        }
    }
    else if([campaign isKindOfClass:[CAWebSiteCampaign class]])
    {
        CAWebSiteCampaign *webSiteCampaign = (CAWebSiteCampaign *)campaign;
        [self showWebSiteCampaign:webSiteCampaign];
    }
}

//web site
- (void)showWebSiteCampaign:(CAWebSiteCampaign *)webSiteCampaign
{
    BOOL bHeavyMotion = NO;
    CGFloat acceleration1 = _motionManager.accelerometerData.acceleration.x;
    CGFloat acceleration2 = _motionManager.accelerometerData.acceleration.y;
    CGFloat acceleration3 = _motionManager.accelerometerData.acceleration.z;
    if(fabs(acceleration1) > 1.0f || fabs(acceleration2) > 1.0f || fabs(acceleration3) > 1.1f )
    {
        bHeavyMotion = YES;
    }
    if((bHeavyMotion || _tryCount == 0) && [_prevCampaginId isEqualToString: webSiteCampaign.cid] && _tryCount < MAX_RETRY)
    {
        _tryCount += 1;
        [self performSelector:@selector(shake) withObject:nil  afterDelay:TIME_INTERNVAL*2];
    }
    else
    {
        [_motionManager stopAccelerometerUpdates];
        _labelView.text = @"";
        _prevCampaginId = webSiteCampaign.cid;
        WebViewController* web = [[WebViewController alloc] init];
        web.url = webSiteCampaign.website;
        web.campaign = webSiteCampaign;
        [self.navigationController pushViewController:web animated:YES];
    }
}

- (void) shake
{
    [[CAProximityManager shared] shake:^(NSArray *campaigns) {
        NSLog(@"Success:%@", campaigns);
        if(campaigns.count > 0) {
            [[CAProximityManager shared] openCampaign:campaigns[0] withObject:nil];
        }
        else
        {
            if(_tryCount < MAX_RETRY)
            {
                _tryCount += 1;
                [self performSelector:@selector(shake) withObject:nil  afterDelay:1];
            }
            else
            {
               [_motionManager stopAccelerometerUpdates];
                _labelView.text = @"";
                NSLog(@"没有发现推送信息");
                UIAlertView* alert = [[UIAlertView alloc] initWithTitle:@"检测结果" message:[NSString stringWithFormat:@"没有发现推送信息:%ld",(long)_tryCount] delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil];
                [alert show];
                _isShaking = NO;
            }
        }
    } failure:^(NSError *err) {
       [_motionManager stopAccelerometerUpdates];
        _labelView.text = @"";
        NSLog(@"Error:%@", err);
        UIAlertView* alert = [[UIAlertView alloc] initWithTitle:@"检测结果" message:@"系统发生异常" delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil];
        [alert show];
        _isShaking = NO;
    }];
}


#pragma mark - Event Delegate

- (void)motionBegan:(UIEventSubtype)motion withEvent:(UIEvent *)event {
    if(motion == UIEventSubtypeMotionShake && _isShaking == NO) {
        _labelView.text = @"Loading...";
        [_motionManager startAccelerometerUpdates];
        _isShaking = YES;
        AudioServicesPlaySystemSound(_sound);
        _tryCount = 0;
        [self shake];
    }
}

#pragma mark - View rotation

- (BOOL)shouldAutorotate {
    return NO;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
    return UIInterfaceOrientationMaskPortrait;
}

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation {
    return UIInterfaceOrientationPortrait;
}

#pragma mark - UIApplicationDelegate

- (void)applicationDidBecomeActive
{
    [self loadGifView];
    _gifView.center = self.view.center;
    [_gifView startGif];
}
@end