import { Component, Input } from '@angular/core';

import { IRol } from "../../../../../interfaces/IRol";

@Component({
    selector: 'rol-detail',
    templateUrl: './app/components/src/seguridad/roles/detail/rol-detail.html'
})
 
export class RolDetailComponent
{
    @Input('rol') rolForm: IRol;

    constructor() {}
}