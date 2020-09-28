import { Injector } from '@angular/core';
import { Router, ComponentInstruction } from '@angular/router-deprecated';
import { AppInjector } from '../constants/AppInjector';
import { AuthService } from '../services/AuthService';

export const InitPageLoader = (next: ComponentInstruction, previous: ComponentInstruction) => {

	let injector: Injector = AppInjector(); // Get the stored reference to the injector
	let auth: AuthService = injector.get(AuthService);
	let router: Router = injector.get(Router);

	// Return a boolean or a promise that resolves a boolean
	return new Promise((resolve) => {
		auth.check().subscribe((result) => {
			if (result) {
				router.navigate(['Perfil']);
				resolve(true);
			} else {
				router.navigate(['Login']);
				resolve(false);
			}
		});
	});
};