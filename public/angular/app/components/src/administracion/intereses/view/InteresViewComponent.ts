import { Component, OnInit } from '@angular/core';

import { CanActivate, ComponentInstruction, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { IsLoggedIn } from '../../../../../constants/IsLoggedIn';

import { IInteres } from "../../../../../interfaces/IInteres";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { AuthService } from '../../../../../services/AuthService';
import { InteresService } from "../../../../../services/InteresService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { InteresAddComponent } from "../add/InteresAddComponent";

import { PersonaAddComponent } from "../../../administracion/personas/add/PersonaAddComponent";

import { DataTable, Column } from 'primeng/primeng';

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;

@Component({
    selector: 'interes-view',
    templateUrl: './app/components/src/administracion/intereses/view/interes-view.html',
    bindings: [AuthService, InteresService, AuditoriaService, NotificationsService],
    directives: [
        ROUTER_DIRECTIVES, 
        InteresAddComponent, 
        PersonaAddComponent, 
        DataTable, Column,
        SimpleNotificationsComponent
    ]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return IsLoggedIn(next, previous);
})
 
export class InteresViewComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 1; // Consultar

    opcion: IOpcion;
    
    intereses: Array<IInteres>;
    selectedInteres: Object = {};

    interesFilter: Object = {
        fecha_inicio: '',
        fecha_fin: ''
    };

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
                private interesService: InteresService,
                private auditoriaService: AuditoriaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
            
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.resetFilter();
        this.getIntereses();
        
        this.agregarEventos();

        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    }

    private agregarEventos()
    {
        jQuery('#add-interes').on('hide.bs.modal', function() {
            jQuery('#btn-buscar').click();
        });
    }

    private getIntereses()
    {
        this.isLoading = true;

        this.interesService.getByFilters(
            this.interesFilter.fecha_inicio != "" ? this.interesFilter.fecha_inicio : "0", 
            this.interesFilter.fecha_fin != "" ? this.interesFilter.fecha_fin : "0"
        ).then(
            intereses => {
                this.intereses = intereses;
                this.isLoading = false;
            }
        ).catch(
            error => {
                this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de intereses de mora.");
                this.isLoading = false;
            }
        );
    }

    private resetFilter()
    {
        this.interesFilter = JSON.parse('{' + 
            ' "fecha_inicio" : "",' +
            ' "fecha_fin" : ""' +
        '}');
    }

    private selectInteres(interes)
    {
        this.selectedInteres = interes;
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}