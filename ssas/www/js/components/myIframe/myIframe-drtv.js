angular.module('components')
  .directive('myIframe', function($rootScope) {
    return {
      restrict: 'EA',
      template: '<iframe style="width:100%;height:100%"></iframe>',
      scope: {
        html: '=html'
      },
      link: function(scope, element, attributes) {
        var ifrm = element[0] && element[0].getElementsByTagName('iframe') && element[0].getElementsByTagName('iframe')[0];
        console.log(ifrm);
        if (ifrm) {
          ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
          ifrm.document.open();
          ifrm.document.write(scope.html);
          ifrm.document.close();
        }

      }
    };
  });
