describe('Clicking on the login button ', function() {
   var username, password, remembered, loginButton, registButton;

   beforeEach(function() {
      browser.get('/');
      element.all(by.css('.tab-item')).last().click();

      username = element(by.model('userInfo.name'));
      password = element(by.model('userInfo.password'));
      remembered = element(by.model('userInfo.remembered'));
      loginButton = element.all(by.css('.button')).first();
      registButton = element.all(by.css('.button')).last();
      //retrieveLink = element(by.linkText('忘记密码'));
      //element(by.id('gobutton')) <button id="gobutton">
      //element(by.binding('latest')) {{latest}}
   });

    it('should validate the credentials for a successful login and display the home view', function() {
        username.sendKeys('13761554710');
        password.sendKeys('11111111');

        loginButton.click().then(function() {
            //expect(browser.getTitle()).toEqual('Super Calculator');
            //expect(latestResult.getText()).toEqual('3');
            expect(browser.getLocationAbsUrl()).toMatch('/tab/home');

            var slideimgs = element.all(by.repeater('item in slideimgs'));
            expect(slideimgs.count()).toEqual(4);

            var catInfo = element.all(by.repeater('category in homeInfo.cat_info'));
            expect(catInfo.count()).toEqual(5);

            var sellerInfo = element.all(by.repeater('item in sellerInfo.items'));
            expect(sellerInfo.count()).toEqual(8);

            var floors = element.all(by.repeater('floor in homeInfo.floor'));
            expect(floors.count()).toEqual(5);
        });
    });

});
