describe('Clicking on the login button ', function() {
   var username, password, remembered, loginButton, registButton;

   beforeEach(function() {
      browser.get('/#/login');

      username = element(by.model('userInfo.name'));
      password = element(by.model('userInfo.password'));
      remembered = element(by.model('userInfo.remembered'));
      loginButton = element.all(by.css('.button')).first();
      registButton = element.all(by.css('.button')).last();
   });

   it('should display a msg for an unsuccessful login', function() {

      username.sendKeys('');
      password.sendKeys('');

      loginButton.click().then(function() {
         expect(browser.getLocationAbsUrl()).toMatch('/login');

         // var msg = element(by.css('.msg'));
         // expect(msg.getText()).toEqual('请输入手机号');
      });
    });

   it('should display a msg for an unsuccessful login', function() {

      username.sendKeys('222222222222222');
      password.sendKeys('');

      loginButton.click().then(function() {
         expect(browser.getLocationAbsUrl()).toMatch('/login');

         // var msg = element(by.css('.msg'));
         // expect(msg.getText()).toEqual('请填写正确的手机号码');
      });
    });

    it('should display a msg for an unsuccessful login', function() {

      username.sendKeys('13761554710');
      password.sendKeys('');

      loginButton.click().then(function() {
         expect(browser.getLocationAbsUrl()).toMatch('/login');

         // var msg = element(by.css('.msg'));
         // expect(msg.getText()).toEqual('用户名或密码错误');
      });
    });

});
