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
      '质量原因',
      '物实不符',
      '现在不想购买'
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
