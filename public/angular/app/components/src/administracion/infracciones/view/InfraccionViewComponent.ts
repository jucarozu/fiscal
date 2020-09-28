import { Component, OnInit } from '@angular/core';

import { CanActivate, ComponentInstruction, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { IsLoggedIn } from '../../../../../constants/IsLoggedIn';

import { IInfraccion } from "../../../../../interfaces/IInfraccion";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { AuthService } from '../../../../../services/AuthService';
import { InfraccionService } from "../../../../../services/InfraccionService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { InfraccionAddComponent } from "../add/InfraccionAddComponent";
import { InfraccionEditComponent } from "../edit/InfraccionEditComponent";

import { DataTable, Column } from 'primeng/primeng';

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;

@Component({
    selector: 'infraccion-view',
    templateUrl: './app/components/src/administracion/infracciones/view/infraccion-view.html',
    bindings: [AuthService, InfraccionService, AuditoriaService, NotificationsService],
    directives: [
        ROUTER_DIRECTIVES,
        InfraccionAddComponent,
        InfraccionEditComponent,
        DataTable, Column,
        SimpleNotificationsComponent
    ]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return IsLoggedIn(next, previous);
})
 
export class InfraccionViewComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 1; // Consultar
    
    opcion: IOpcion;
    
    infracciones: Array<IInfraccion>;
    selectedInfraccion: Object = {};

    infraccionFilter: IInfraccion;
    
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
                private infraccionService: InfraccionService,
                private auditoriaService: AuditoriaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
            
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.resetFilter();
        this.getInfracciones();
        
        this.agregarEventos();

        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    }

    private agregarEventos()
    {
        jQuery('#add-infraccion, #edit-infraccion').on('hide.bs.modal', function() {
            jQuery('#btn-buscar').click();
        });
    }

    private getInfracciones()
    {
        this.isLoading = true;

        this.infraccionService.getByFilters(
            this.infraccionFilter.codigo != null ? this.infraccionFilter.codigo : 0, 
            this.infraccionFilter.nombre_corto != "" ? this.infraccionFilter.nombre_corto : "0", 
            this.infraccionFilter.descripcion != "" ? this.infraccionFilter.descripcion : "0"
        ).then(
            infracciones => {
                this.infracciones = infracciones;
                this.isLoading = false;
            }
        ).catch(
            error => {
                this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de infracciones.");
                this.isLoading = false;
            }
        );
    }

    private resetFilter()
    {
        this.infraccionFilter = JSON.parse('{' + 
            ' "codigo" : null,' +
            ' "nombre_corto" : "",' +
            ' "descripcion" : ""' +
        '}');
    }

    private selectInfraccion(infraccion)
    {
        this.selectedInfraccion = infraccion;
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}