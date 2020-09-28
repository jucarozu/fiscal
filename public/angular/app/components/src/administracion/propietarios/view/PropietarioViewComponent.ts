import { Component, OnInit } from '@angular/core';

import { CanActivate, ComponentInstruction, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { IsLoggedIn } from '../../../../../constants/IsLoggedIn';

import { IPropietario } from "../../../../../interfaces/IPropietario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { AuthService } from '../../../../../services/AuthService';
import { PropietarioService } from "../../../../../services/PropietarioService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { PropietarioAddComponent } from "../add/PropietarioAddComponent";
import { PropietarioEditComponent } from "../edit/PropietarioEditComponent";

import { PersonaAddComponent } from "../../../administracion/personas/add/PersonaAddComponent";

import { DataTable, Column } from 'primeng/primeng';

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;

@Component({
    selector: 'propietario-view',
    templateUrl: './app/components/src/administracion/propietarios/view/propietario-view.html',
    bindings: [AuthService, PropietarioService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        ROUTER_DIRECTIVES, 
        PropietarioAddComponent, 
        PropietarioEditComponent,
        PersonaAddComponent, 
        DataTable, Column,
        SimpleNotificationsComponent
    ]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return IsLoggedIn(next, previous);
})
 
export class PropietarioViewComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 1; // Consultar
    
    gpTipoDocumento: number = 1;

    opcion: IOpcion;
    
    propietarios: Array<IPropietario>;
    selectedPropietario: Object = {};

    propietarioFilter: IPropietario;

    documentos: Array<Object> = [];

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
                private propietarioService: PropietarioService,
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
        
        this.agregarEventos();
        this.cargarCombos();

        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    }

    private agregarEventos()
    {
        jQuery('#edit-propietario').on('hide.bs.modal', function() {
            jQuery('#btn-buscar').click();
        });
    }

    private cargarCombos()
    {
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos });
    }

    private getPropietarios()
    {
        if (this.propietarioFilter.placa != "" || this.propietarioFilter.numero_doc != "")
        {
            this.isLoading = true;

            this.propietarioService.getByFilters(
                this.propietarioFilter.placa != "" ? this.propietarioFilter.placa : "0",
                this.propietarioFilter.tipo_doc != null ? this.propietarioFilter.tipo_doc : 0,
                this.propietarioFilter.numero_doc != "" ? this.propietarioFilter.numero_doc : "0"
            ).then(
                propietarios => {
                    this.propietarios = propietarios;
                    this.isLoading = false;
                }
            ).catch(
                error => {
                    this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de propietarios.");
                    this.isLoading = false;
                }
            );
        }
        else
        {
            this.propietarios = null;
            this.notificationService.error("Atención", "Para realizar la búsqueda debe filtrar como mínimo por placa o número de documento.");
        }
    }

    private resetFilter()
    {
        this.propietarioFilter = JSON.parse('{' + 
            ' "placa" : "",' +
            ' "tipo_doc" : null,' + 
            ' "numero_doc" : ""' +
        '}');
    }

    private selectPropietario(propietario)
    {
        this.selectedPropietario = propietario;
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}