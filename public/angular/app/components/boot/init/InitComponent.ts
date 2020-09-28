import { Component } from '@angular/core';
import { CanActivate, ComponentInstruction } from '@angular/router-deprecated';
import { InitPageLoader } from '../../../constants/InitPageLoader';

@Component({
    selector: 'init',
    templateUrl: './app/components/boot/init/init.html'
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return InitPageLoader(next, previous);
})

export class InitComponent
{

}