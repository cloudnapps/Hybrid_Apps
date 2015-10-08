# Install ionic by  

    $ npm install -g cordova ionic 

# Install all plugins
    
    //It will iterate all cordova plugin in package.json and install each
    $ node install-plugins.js

# Launch app in browser

    $ ionic serve

# Launch app in iOS emulator   

    $ ionic platform add ios
    $ ionic build ios
    $ ionic emulate ios
