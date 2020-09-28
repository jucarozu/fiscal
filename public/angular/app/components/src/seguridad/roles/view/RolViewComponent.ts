import { Component, OnInit } from '@angular/core';

import { CanActivate, ComponentInstruction, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { IsLoggedIn } from '../../../../../constants/IsLoggedIn';

import { IRol } from "../../../../../interfaces/IRol";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { AuthService } from '../../../../../services/AuthService';
import { RolService } from "../../../../../services/RolService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { RolAddComponent } from "../add/RolAddComponent";
import { RolDetailComponent } from "../detail/RolDetailComponent";
import { RolEditComponent } from "../edit/RolEditComponent";

import { DataTable, Column } from 'primeng/primeng';

declare var jQuery : any;

@Component({
    selector: 'rol-view',
    templateUrl: './app/components/src/seguridad/roles/view/rol-view.html',
    bindings: [AuthService, RolService, AuditoriaService],
    directives: [
        ROUTER_DIRECTIVES, 
        RolAddComponent, 
        RolDetailComponent, 
        RolEditComponent, 
        DataTable, Column
    ]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return IsLoggedIn(next, previous);
})
 
export class RolViewComponent implements OnInit
{
    isLoading: boolean = false;
    
    accionAudit: number = 1; // Consultar

    opcion: IOpcion;

    roles: Array<IRol>;
    selectedRol: Object = {};

    constructor(private router: Router,
                private authService: AuthService,
                private rolService: RolService, 
                private auditoriaService: AuditoriaService) {}

    ngOnInit()
    {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
            
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.getRoles();

        this.agregarEventos();
        
        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    }

    private agregarEventos()
    {
        // Eventos para refrescar la tabla al insertar o actualizar un rol.
        jQuery('#add-rol, #edit-rol').on('hidden.bs.modal', function() {
            jQuery('#btn-buscar').click();
        });
    }

    private getRoles()
    {
        this.isLoading = true;

        this.rolService.get().then(
            roles => {
                this.roles = roles;
                this.isLoading = false;
            }
        );
    }

    private selectRol(rol)
    {
        this.selectedRol = rol;
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}