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

# gulp prod

- `npm install`
- change `ssas/ionic.project` to next text

```js
{
  "name": "ssas",
  "app_id": "608e6e24",
  "proxies": [
    {
      "path": "/m",
      "proxyUrl": "http://zdf.jooau.com/index.php/m"
    },
    {
      "path": "/data",
      "proxyUrl": "http://bbc.jooau.com/zhongshihua/data"
    }
  ],
  "gulpStartupTasks": [
    "sass",
    "dev"
  ],
  "watchPatterns": [
    "www/index.html"
  ]
}
```

- `ionic serve` (start development)
- `gulp prod` (start production)