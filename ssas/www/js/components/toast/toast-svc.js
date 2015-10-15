angular
  .module('components')
  .service('toastService', function($timeout) {
    var toast = [];
    var timer = null;
    this.setToast = function(msg, timeout) {
      $timeout.cancel(timer);
      toast.length = 0;
      toast.push(msg);
      timer = $timeout(function() {
        toast.length = 0;
      }, timeout || 3000);
    };
    this.clearToast = function() {
      toast.length = 0;
      $timeout.cancel(timer);
    };
    this.getToast = function() {
      return toast;
    };
  });
