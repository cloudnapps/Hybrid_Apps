# cordova-qdc-wxpay
微信APP支付cordova,ionic插件(Android版，iOS版)

# 1. 插件安装
开发工程下执行以下命令导入本插件：

	$ ionic plugin add https://github.com/mrwutong/cordova-qdc-wxpay.git

已安装插件查看：

	$ionic plugin list


执行以下命令删本插件：

	# 【com.qdc.plugins.wxpay】是插件ID，不是插件文件夹名
	$ionic plugin rm com.qdc.plugins.wxpay

## 1.1 Android开发环境

## 1.2 iOS开发环境
在工程中要设置URL scheme为向微信注册的appid，用于app回调

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

* 事先前调用后台预支付API生成订单数据及签名数据
    >https://pay.weixin.qq.com/wiki/doc/api/app.php?chapter=9_1

* 调用plugin的JS方法【wxpay.payment】进行支付

```js
	**wxpay.payment(json, cb_success, cb_failure);**
	# 参数说明：格式为JSON格式
	# cb_success:调用成功回调方法
	# cb_failure:调用失败回调方法
	{
	appid: 公众账号ID
	noncestr: 随机字符串
	package: 扩展字段
	partnerid: 商户号
	prepayid: 预支付交易会话ID
	timestamp: 时间戳
	sign: 签名
	}
	注1：参数解释：https://pay.weixin.qq.com/wiki/doc/api/app.php?chapter=9_12
    注2：appid一般为：wxd930ea5d5a258f4f，是向微信注册时的appid，用于微信api注册
    注3：签名算法：https://pay.weixin.qq.com/wiki/doc/api/app.php?chapter=4_3
```

```js
    var payObj = {};
    payObj["appid"] = "wx2421b1c4370ec43b";
    payObj["noncestr"] = "a462b76e7436e98e0ed6e13c64b4fd1c";
    payObj["package"] = "Sign=WXPay";
    payObj["partnerid"] = "10000100";
    payObj["prepayid"] = "1101000000140415649af9fc314aa427";
    payObj["timestamp"] = "1397527777";
    payObj["sign"] = "582282D72DD2B03AD892830965F428CB16E7A256";
    var paymentString = JSON.stringify(payObj);

    wxpay.payment(paymentString, function(cb_success)
    {
        alert(cb_success);
    },
    function(cb_failure)
    {
        alert(cb_failure);
    });
```
