angular.module('starter')
  .factory('barcode',
  function ($rootScope, shopApi, toastService, tabStateService) {

    // definition start
    // variables
    var isScanning = false;

    /**
     * scan barcode and show product detail
     */
    function scan() {
      if (isScanning) {
        return;
      }
      isScanning = true;

      cordova.plugins.barcodeScanner.scan(
        function (result) {
          if (!result.cancelled && result.text !== undefined && result.text !== null) {
            shopApi.getProductIdByBarcode(result.text).success(
              function (response) {
                 console.log('product-get_productId.html******' + angular.toJson(response));
                var result = response.data;
                var status = response.status;
                if (status === 0) {
                  var productId = result.product_id;
                  if (productId !== undefined) {
                    tabStateService.go(tabStateService.tabIndex.shop, 'product', {productId: productId});
                  }
                } else {
                  toastService.setToast(response.msg);
                }
              }); // end of getProductIdByBarcode success
          } else {
            // toastService.setToast('没有找到商品');

          }// end of if
          isScanning = false;
        }, // end of scan success
        function () {

          toastService.setToast('扫码失败');

          isScanning = false;
        }
      ); // end of cordova plugin
    } // end of scan function

    $rootScope.barcodeScan = scan;

    return {
      scan: scan
    };
  }
); // end of barcode factory
