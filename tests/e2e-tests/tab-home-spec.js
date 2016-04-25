describe('Home tab display as default', function() {

   beforeEach(function() {
      browser.get('/');

   });

    it('should display the home view', function() {

      expect(browser.getLocationAbsUrl()).toMatch('/tab/home');

      var slideimgs = element.all(by.repeater('item in slideimgs'));
      expect(slideimgs.count()).toEqual(5);

      var catInfo = element.all(by.repeater('category in homeInfo.cat_info'));
      expect(catInfo.count()).toEqual(5);

      var sellerInfo = element.all(by.repeater('item in sellerInfo.items'));
      expect(sellerInfo.count()).toEqual(8);

      var floors = element.all(by.repeater('floor in homeInfo.floor'));
      expect(floors.count()).toEqual(5);
    });

    it('should display [produck] and [seller]', function() {
      var kindOptions = element.all(by.css('option'));
      expect(kindOptions.count()).toEqual(2);
      expect(kindOptions.first().getText()).toEqual('商品');
      expect(kindOptions.last().getText()).toEqual('商户');
    });

});
