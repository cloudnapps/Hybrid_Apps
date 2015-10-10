//
//  WebViewController.m
//  ShakingDemo
//
//  Created by liangyu on 15/4/29.
//  Copyright (c) 2015年 cloud. All rights reserved.
//

#import "WebViewController.h"

@interface WebViewController ()

@end

@implementation WebViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = self.campaign.name;
    self.webView = [[UIWebView alloc]initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height)];
    self.webView.delegate = self;
    self.webView.allowsInlineMediaPlayback = YES;
    NSURLRequest *request = [[NSURLRequest alloc]initWithURL:self.url];
    [self.webView loadRequest:request];
    [self.view addSubview:self.webView];
    [self loadBackButton];

    // Do any additional setup after loading the view.
}
- (void)loadBackButton {
    UIBarButtonItem *closeButton = [[UIBarButtonItem alloc]initWithTitle:@"关闭" style:UIBarButtonItemStylePlain target:self action:@selector(closeClick:)];
    self.navigationItem.leftBarButtonItem = closeButton;
}

- (void)closeClick:(UIBarButtonItem *)sender {
    [self dismissViewControllerAnimated:YES completion:nil];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
