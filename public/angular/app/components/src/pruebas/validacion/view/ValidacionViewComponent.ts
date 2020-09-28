import { Component, OnInit } from '@angular/core';

import { CanActivate, ComponentInstruction, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { IsLoggedIn } from '../../../../../constants/IsLoggedIn';

import { IDeteccion } from "../../../../../interfaces/IDeteccion";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { AuthService } from '../../../../../services/AuthService';
import { ValidacionService } from "../../../../../services/ValidacionService";
import { FuenteService } from "../../../../../services/FuenteService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { DataTable, Column } from 'primeng/primeng';

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;

@Component({
    selector: 'validacion-view',
    templateUrl: './app/components/src/pruebas/validacion/view/validacion-view.html',
    bindings: [AuthService, ValidacionService, FuenteService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        ROUTER_DIRECTIVES,
        DataTable, Column,
        SimpleNotificationsComponent
    ]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return IsLoggedIn(next, previous);
})
 
export class ValidacionViewComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 1; // Consultar
    
    opcion: IOpcion;
    
    detecciones: Array<IDeteccion>;
    deteccionFilter: IDeteccion;

    fuentes: Array<Object> = [];
    
    notificationsOptions = {
        timeOut: 7000,
        lastOnBottom: false,
        clickToClose: true,
        maxLength: 0,
        maxStack: 7,
        showProgressBar: false,
        pauseOnHover: true,
        preventDuplicates: true,
        preventLastDuplicates: false
    };

    constructor(private router: Router,
                private authService: AuthService,
                private validacionService: ValidacionService,
                private fuenteService: FuenteService,
                private auditoriaService: AuditoriaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
            
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.resetFilter();
        this.getDetecciones();
        
        this.cargarCombos();

        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    }

    private cargarCombos()
    {
        this.fuenteService.get().then(fuentes => { this.fuentes = fuentes });
    }

    private getDetecciones()
    {
        this.isLoading = true;

        this.validacionService.consultar(
            this.deteccionFilter.fuente != null ? this.deteccionFilter.fuente : 0
        ).then(
            detecciones => {
                this.detecciones = detecciones;
                this.isLoading = false;
            }
        ).catch(
            error => {
                this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de detecciones por validar.");
                this.isLoading = false;
            }
        );
    }

    private resetFilter()
    {
        this.deteccionFilter = JSON.parse('{' + 
            ' "fuente" : null' + 
        '}');
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}