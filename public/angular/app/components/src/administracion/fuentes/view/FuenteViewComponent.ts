import { Component, OnInit } from '@angular/core';

import { CanActivate, ComponentInstruction, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { IsLoggedIn } from '../../../../../constants/IsLoggedIn';

import { IFuente } from "../../../../../interfaces/IFuente";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { AuthService } from '../../../../../services/AuthService';
import { FuenteService } from "../../../../../services/FuenteService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { FuenteAddComponent } from "../add/FuenteAddComponent";
import { FuenteEditComponent } from "../edit/FuenteEditComponent";
import { FuenteDetailComponent } from "../detail/FuenteDetailComponent";

import { PersonaAddComponent } from "../../../administracion/personas/add/PersonaAddComponent";

import { DataTable, Column } from 'primeng/primeng';

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

import { GOOGLE_MAPS_DIRECTIVES, MouseEvent } from 'angular2-google-maps/core';

declare var jQuery : any;

@Component({
    selector: 'fuente-view',
    templateUrl: './app/components/src/administracion/fuentes/view/fuente-view.html',
    bindings: [AuthService, FuenteService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        ROUTER_DIRECTIVES,
        FuenteAddComponent,
        FuenteEditComponent,
        FuenteDetailComponent,
        PersonaAddComponent,
        DataTable, Column,
        SimpleNotificationsComponent,
        GOOGLE_MAPS_DIRECTIVES
    ]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return IsLoggedIn(next, previous);
})
 
export class FuenteViewComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 1; // Consultar
    
    gpTipoFuente: number = 12;
    
    opcion: IOpcion;
    
    fuentes: Array<IFuente>;
    selectedFuente: Object = {};

    fuenteFilter: IFuente;

    tiposFuentes: Array<Object> = [];
    
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

    zoom: number = 15;
    lat: number = 10.335733927654234;
    lng: number = -75.41285991668701;

    constructor(private router: Router,
                private authService: AuthService,
                private fuenteService: FuenteService,
                private parametroService: ParametroService,
                private auditoriaService: AuditoriaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.resetFilter();
        this.getFuentes();
        
        this.agregarEventos();
        this.cargarCombos();

        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    }

    private agregarEventos()
    {
        jQuery('#add-fuente, #edit-fuente').on('hide.bs.modal', function() {
            jQuery('#btn-buscar').click();
        });
    }

    private cargarCombos()
    {
        this.parametroService.getByGrupo(this.gpTipoFuente).then(tiposFuentes => { this.tiposFuentes = tiposFuentes });
    }

    private getFuentes()
    {
        this.isLoading = true;
        this.resetFilter();

        this.fuenteService.getByFilters(
            this.fuenteFilter.tipo != null ? this.fuenteFilter.tipo : 0, 
            this.fuenteFilter.nombre != "" ? this.fuenteFilter.nombre : "0", 
            this.fuenteFilter.prov_nombre != "" ? this.fuenteFilter.prov_nombre : "0", 
            this.fuenteFilter.referencia_ubicacion != "" ? this.fuenteFilter.referencia_ubicacion : "0"
        ).then(
            fuentes => {
                this.fuentes = fuentes;

                for (let i in fuentes)
                {
                    this.fuentes[i].latitud = fuentes[i].latitud != null ? parseFloat(fuentes[i].latitud) : null;
                    this.fuentes[i].longitud = fuentes[i].longitud != null ? parseFloat(fuentes[i].longitud) : null;
                }

                this.isLoading = false;
            }
        ).catch(
            error => {
                this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de fuentes de evidencias.");
                this.isLoading = false;
            }
        );
    }

    private resetFilter()
    {
        this.fuenteFilter = JSON.parse('{' + 
            ' "tipo" : null,' +
            ' "nombre" : "",' +
            ' "prov_nombre" : "",' + 
            ' "referencia_ubicacion" : ""' + 
        '}');

        this.zoom = 15;
        this.lat = 10.335733927654234;
        this.lng = -75.41285991668701;
    }

    private selectFuente(fuente)
    {
        this.selectedFuente = fuente;
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}