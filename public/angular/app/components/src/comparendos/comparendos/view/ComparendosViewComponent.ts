import { Component, Input, OnInit } from '@angular/core';

import { CanActivate, ComponentInstruction, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { IsLoggedIn } from '../../../../../constants/IsLoggedIn';

import { IComparendo } from "../../../../../interfaces/IComparendo";
import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { AuthService } from '../../../../../services/AuthService';
import { ParametroService } from "../../../../../services/ParametroService";
import { ComparendoService } from "../../../../../services/ComparendoService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

//import { ComparendoDetalleComponent } from "../detalle/ComparendoDetalleComponent";
import { SustitucionConductorComponent } from "../../sustitucion-conductor/view/SustitucionConductorComponent";
import { SustitucionSancionadoComponent } from "../../sustitucion-conductor/sancionado/SustitucionSancionadoComponent";

import { PersonaAddComponent } from "../../../administracion/personas/add/PersonaAddComponent";

import { DataTable, Column } from 'primeng/primeng';

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'comparendos-view',
    templateUrl: './app/components/src/comparendos/comparendos/view/comparendos-view.html',
    bindings: [AuthService, ComparendoService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        //ComparendoDetalleComponent,
        SustitucionConductorComponent,
        SustitucionSancionadoComponent,
        PersonaAddComponent, 
        DataTable, Column,
        SimpleNotificationsComponent
    ]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return IsLoggedIn(next, previous);
})

export class ComparendosViewComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 1; // Consultar

    gpTipoDocumento: number = 1;
    gpEstado: number = 37;

    userLogin: IUsuario;
    opcion: IOpcion;

    comparendoFilter: IComparendo;

    comparendos: Array<IComparendo>;
    selectedComparendo: Object = {};

    documentos: Array<Object> = [];
    estados: Array<Object> = [];
    
    notificationsOptions = {
        timeOut: 5000,
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
                private comparendoService: ComparendoService,
                private parametroService: ParametroService,
                private auditoriaService: AuditoriaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);

        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.resetFilter();

        this.agregarEventos();
        this.cargarCombos();

        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    }

    private agregarEventos()
    {
        /*jQuery('#sustitucion-conductor').on('hide.bs.modal', function() {
            jQuery('#btn-buscar').click();
        });*/
    }

    private cargarCombos()
    {
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos });
        this.parametroService.getByGrupo(this.gpEstado).then(estados => { this.estados = estados });
    }

    public getComparendos()
    {
        this.isLoading = true;

        this.comparendoService.getByFilters(
            this.comparendoFilter.numero != "" ? this.comparendoFilter.numero : "0",
            this.comparendoFilter.infr_tipo_doc != null ? this.comparendoFilter.infr_tipo_doc : 0,
            this.comparendoFilter.infr_numero_doc != "" ? this.comparendoFilter.infr_numero_doc : "0",
            this.comparendoFilter.estado != null ? this.comparendoFilter.estado : 0
        ).then(
            comparendos => {
                this.comparendos = comparendos;
                this.isLoading = false;
            }
        ).catch(
            error => {
                this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de comparendos.");
                this.isLoading = false;
            }
        );
    }

    private resetFilter() : void
    {
        this.comparendoFilter = JSON.parse('{' + 
            ' "numero" : "",' +
            ' "infr_tipo_doc" : null,' + 
            ' "infr_numero_doc" : "",' + 
            ' "estado" : null' + 
        '}');
    }

    private selectComparendo(comparendo)
    {
        this.selectedComparendo = comparendo;
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}