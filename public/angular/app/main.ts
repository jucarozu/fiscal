import { bootstrap } from '@angular/platform-browser-dynamic';
import { bind, provide, ComponentRef } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { RouterComponent } from '../app/components/boot/router/RouterComponent';

import { HTTP_PROVIDERS, Http } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { AuthService } from '../app/services/AuthService';
import { AppInjector } from '../app/constants/AppInjector';
import 'rxjs/Rx';

import { GOOGLE_MAPS_PROVIDERS, LazyMapsAPILoaderConfig } from 'angular2-google-maps/core';

bootstrap(RouterComponent, [
	GOOGLE_MAPS_PROVIDERS,
	provide(LazyMapsAPILoaderConfig, { useFactory: () => {
		let config = new LazyMapsAPILoaderConfig();
		config.apiKey = 'AIzaSyBRT9hHAE9dqyDmDAWAB5kOkCHBukh96fI';
		return config;
	}}),
  	HTTP_PROVIDERS,
	ROUTER_PROVIDERS,
	bind(LocationStrategy).toClass(HashLocationStrategy),
	provide(AuthConfig, { useFactory: () => {
		return new AuthConfig();
	}}),
	AuthHttp,
	AuthService
]).then((appRef: ComponentRef<Object>) => {
	AppInjector(appRef.injector);
});