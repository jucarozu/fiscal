import { Component, OnInit } from '@angular/core';
import { CanActivate, ComponentInstruction } from '@angular/router-deprecated';
import { IsLoggedIn } from '../../../constants/IsLoggedIn';

import { IUsuario } from "../../../interfaces/IUsuario";

declare var jQuery : any;

@Component({
    selector: 'perfil',
    templateUrl: './app/components/boot/perfil/perfil.html'
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return IsLoggedIn(next, previous);
})

export class PerfilComponent implements OnInit
{
    userLogin: IUsuario;

    constructor() {}

    ngOnInit()
    {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
    }
}