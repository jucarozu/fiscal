import { Injector } from '@angular/core';

let appInjectorRef: Injector;

export const AppInjector = (injector? : Injector) : Injector => {

	if (injector)
	{
		appInjectorRef = injector;
	}

	return appInjectorRef;
};