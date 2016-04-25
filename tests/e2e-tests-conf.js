exports.config = {
    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
            args: ['--disable-web-security']
        }
    },
    seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: 'http://localhost:8100',
    specs: [
        'e2e-tests/**/tab*-spec.js'
    ],
    jasmineNodeOpts: {
        isVerbose: true,
    }
};
