var app = angular.module('ionic-generaldata', ['ionic']);
app.service('GeneralPickerService', function () {
  this.sourceData = [{
    key: 'ReturnType',
    values: [
      '仅退款',
      '退货退款'
    ]
  }, {
    key: 'ReturnTitle',
    values: [
      '物实不符',
      '质量原因',
      '现在不想购买',
      '商品价格较贵',
      '重复下单',
      '订单商品选择有误',
      '支付方式选择有误',
      '收货信息填写有误',
      '支付方式选择有误',
      '发票信息填写有误',
      '其他原因'
    ]
  }
  ];

  this.getData = function (key, callback) {
    angular.forEach(this.sourceData, function (data) {
      if (data.key === key) {
        callback(data.values);
      }
    });
  }
});
