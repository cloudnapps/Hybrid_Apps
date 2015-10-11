# cordova-qdc-alipay
支付宝APP支付cordova,ionic插件(Android版，IOS版)

# 1. 插件安装
开发工程下执行以下命令导入本插件：

	$ ionic plugin add https://github.com/mrwutong/cordova-qdc-alipay.git

已安装插件查看：

	$ionic plugin list


执行以下命令删本插件：

	# 【com.qdc.plugins.alipay】是插件ID，不是插件文件夹名
	$ionic plugin rm com.qdc.plugins.alipay

## 1.1 Android开发环境

## 1.2 iOS开发环境
工程默认的URL scheme：qdcalipay （需要修改成app特有的）

需要在info.plist中添加如下的的内容：
```xml
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <true/>
    </dict>

    <key>LSApplicationQueriesSchemes</key>
    <array>
        <string>wechat</string>
        <string>weixin</string>
        <string>alipay</string>
    </array>
```
## 1.3 JS调用说明

* 事先前调用后台服务端API生成订单数据及签名数据
* 调用plugin的JS方法【alipay.payment】进行支付

```javascript
    **alipay.payment(json, cb_success, cb_failure);**
	# 参数说明：格式为JSON格式
	# cb_success:调用成功回调方法
	# cb_failure:调用失败回调方法
	# json: {
	    pay_info: 支付信息
	  }
```
```javascript
    var payObj = {};

    payObj["pay_info"] = 
        "partner=\"2088101568353491\"&\
        seller_id=\"2088101568353491\"&\
        out_trade_no=\"YR2VGG3G1I31XDZ\"&\
        subject=\"1\"&\
        body=\"我是测试数据\"&\
        total_fee=\"0.02\"&\
        notify_url=\"http://www.xxx.com\"&\
        service=\"mobile.securitypay.pay\"&\
        payment_type=\"1\"&\
        _input_charset=\"utf-8\"&\
        it_b_pay=\"30m\"&\
        show_url=\"m.alipay.com\"&\
        sign=\"GsSZgPloF1vn52XAItRAldwQAbzIgkDyByCxMfTZG%2FMapRoyrNIJo4U1LUGjHp6gdBZ7U8jA1kljLPqkeGv8MZigd3kH25V0UK3Jc3C94Ngxm5S%2Fz5QsNr6wnqNY9sx%2Bw6DqNdEQnnks7PKvvU0zgsynip50lAhJmflmfHvp%2Bgk%3D\"&sign_type=\"RSA\"";

    var paymentString = JSON.stringify(payObj);

    alipay.payment(paymentString, function(cb_success)
    {
        alert(cb_success);
    },
    function(cb_failure)
    {
        alert(cb_failure);
    });
```
