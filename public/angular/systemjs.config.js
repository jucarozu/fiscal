(function(global) {

    // map tells the System loader where to look for things
    var map = {
        'app'                        : 'app',
        'rxjs'                       : 'node_modules/rxjs',
        '@angular'                   : 'node_modules/@angular',
        'angular2-in-memory-web-api' : 'node_modules/angular2-in-memory-web-api',
        'angular2-jwt'               : 'node_modules/angular2-jwt',
        'angular2-notifications'     : 'node_modules/angular2-notifications',
        'primeng'                    : 'node_modules/primeng',
        'ng2-file-upload'            : 'node_modules/ng2-file-upload',
        'angular2-google-maps'       : 'node_modules/angular2-google-maps'
    };

    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app'                        : { main: 'main.js', defaultExtension: 'js' },
        'rxjs'                       : { defaultExtension: 'js' },
        'angular2-in-memory-web-api' : { defaultExtension: 'js' },
        'angular2-jwt'               : { main: 'angular2-jwt.js', defaultExtension: 'js' },
        'angular2-notifications'     : { main: 'components.js', defaultExtension: 'js' },
        'primeng'                    : { main: 'primeng.js', defaultExtension: 'js' },
        'ng2-file-upload'            : { main: 'ng2-file-upload.js', defaultExtension: 'js' },
        'angular2-google-maps/core'  : { main: 'index.js', defaultExtension: 'js' }
    };

    var packageNames = [
        '@angular/common',
        '@angular/compiler',
        '@angular/core',
        '@angular/http',
        '@angular/platform-browser',
        '@angular/platform-browser-dynamic',
        '@angular/router',
        '@angular/router-deprecated',
        '@angular/testing',
        '@angular/upgrade'
    ];

    // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
    packageNames.forEach(function(pkgName) {
        packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
    });

    var config = {
        map: map,
        packages: packages
    }

    // filterSystemConfig - index.html's chance to modify config before we register it.
    if (global.filterSystemConfig) { global.filterSystemConfig(config); }

    System.config(config);

})(this);