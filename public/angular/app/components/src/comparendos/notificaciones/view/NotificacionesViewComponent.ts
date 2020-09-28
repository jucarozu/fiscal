import { Component, Input, OnInit } from '@angular/core';

import { CanActivate, ComponentInstruction, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { IsLoggedIn } from '../../../../../constants/IsLoggedIn';

import { INotificacionFilter } from "../../../../../interfaces/INotificacionFilter";
import { IAgente } from "../../../../../interfaces/IAgente";
import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { AuthService } from '../../../../../services/AuthService';
import { NotificacionService } from "../../../../../services/NotificacionService";
import { ComparendoService } from "../../../../../services/ComparendoService";
import { AgenteService } from "../../../../../services/AgenteService";
import { DivipoService } from "../../../../../services/DivipoService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificacionesConfirmComponent } from "../confirm/NotificacionesConfirmComponent";
import { NotificacionesImpresoComponent } from "../impreso/NotificacionesImpresoComponent";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'notificaciones-view',
    templateUrl: './app/components/src/comparendos/notificaciones/view/notificaciones-view.html',
    bindings: [AuthService, NotificacionService, ComparendoService, AgenteService, DivipoService, AuditoriaService, NotificationsService],
    directives: [
        NotificacionesConfirmComponent,
        NotificacionesImpresoComponent,
        SimpleNotificationsComponent
    ]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return IsLoggedIn(next, previous);
})

export class NotificacionesViewComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 2; // Adicionar

    userLogin: IUsuario;
    opcion: IOpcion;

    agentes: Array<IAgente> = [];
    agentesSinFirma: Array<IAgente> = [];
    
    departamentos: Array<Object> = [];
    municipios: Array<Object> = [];

    notificacionFilter: INotificacionFilter;

    errores: Array<Object> = [];

    detalleEncabezados = [ 
        "Id notificación", "Fecha envío", "Medio", "Tipo documento", "Nro documento", 
        "Tipo identificación", "Nro identificación", "Nombre", "Departamento", "Ciudad", "Dirección", "Teléfono", "Celular", "Email" 
    ];
    
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
                private notificacionService: NotificacionService,
                private comparendoService: ComparendoService,
                private agenteService: AgenteService,
                private divipoService: DivipoService,
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
        jQuery('#confirm-notificaciones').on('hide.bs.modal', function() {
            if (jQuery('#is-confirm-notificaciones').val() == '1') {
                jQuery('#btn-insertar').click();
            }
        });

        jQuery('#impreso-notificaciones').on('hide.bs.modal', function() {
            if (jQuery('#is-impreso-notificaciones').val() == '1') {
                jQuery('#btn-marcar-impreso').click();
            }
        });
    }

    private cargarCombos()
    {
        this.agenteService.get().then(agentes => { this.agentes = agentes });
        this.divipoService.getDepartamentos().then(departamentos => { this.departamentos = departamentos });
    }

    private cargarMunicipios(cod_departamento)
    {
        this.municipios = null;

        if (cod_departamento != null)
        {
            this.divipoService.getMunicipios(cod_departamento).then(municipios => { this.municipios = municipios; });
        }
    }

    public validar()
    {
        if (this.notificacionFilter.imp_orden == null)
        {
            this.notificationService.error("Error", "Debe seleccionar el orden de impresión.");
            return;
        }

        if (this.notificacionFilter.imp_modo == null)
        {
            this.notificationService.error("Error", "Debe seleccionar el modo de impresión.");
            return;
        }

        this.isLoading = true;

        this.comparendoService.getComparendosPorNotificar(
            this.notificacionFilter.infra_desde != "" ? this.notificacionFilter.infra_desde : "0",
            this.notificacionFilter.infra_hasta != "" ? this.notificacionFilter.infra_hasta : "0",
            this.notificacionFilter.verifica_desde != "" ? this.notificacionFilter.verifica_desde : "0",
            this.notificacionFilter.verifica_hasta != "" ? this.notificacionFilter.verifica_hasta : "0",
            this.notificacionFilter.detec_sitio != "" ? this.notificacionFilter.detec_sitio : "0",
            this.notificacionFilter.detec_agente != null ? this.notificacionFilter.detec_agente : 0,
            this.notificacionFilter.dir_municipio != null ? this.notificacionFilter.dir_municipio : 0
        ).then(
            comparendosPorNotificar => {
                if (comparendosPorNotificar.length == 0)
                {
                    this.notificationService.error("Error", "No se encontraron comparendos pendientes por notificar.");
                    this.isLoading = false;
                    return;
                }

                this.agentesSinFirma = comparendosPorNotificar.filter(comparendo => comparendo.agt_tiene_firma == "0");

                if (this.agentesSinFirma.length > 0)
                {
                    jQuery('#confirm-notificaciones').modal({backdrop: 'static', keyboard: false});
                    this.isLoading = false;
                }
                else
                {
                    this.insertar();
                }
            }
        ).catch(
            error => {
                this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de notificaciones.");
                this.isLoading = false;
            }
        );
    }

    private insertar() : void
    {
        let notificacionString = this.generarNotificacionString(this.notificacionFilter);

        this.notificacionService.insert(notificacionString).then(
            (res) => {
                this.imprimir(this.notificacionFilter.imp_orden, this.notificacionFilter.imp_modo);
            },
            (error) => {
                this.notificationService.error("Error", JSON.parse(error._body).mensaje);
                this.isLoading = false;
            }
        );
    }

    private imprimir(imp_orden, imp_modo) : void
    {
        this.notificacionService.imprimir(imp_orden, imp_modo).then(
            (res) => {
                this.descargarResultado(res.pdfNotificaciones, res.detalleNotif);
            },
            (error) => {
                this.notificationService.error("Error", JSON.parse(error._body).mensaje);
                this.isLoading = false;
            }
        );
    }

    private descargarResultado(pdfNotificaciones, detalleNotif)
    {
        let csvDetalle = this.exportDetalleToCSV(this.detalleEncabezados, detalleNotif);

        let zip = new JSZip();
        zip.file("notificaciones.pdf", decodeURIComponent(pdfNotificaciones), { base64: true });
        zip.file("detalle.csv", csvDetalle);
        
        zip.generateAsync({ type: "base64" }).then(function (base64) {
            var encodedUri = "data:application/zip;base64," + base64;
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "resultado.zip");
            document.body.appendChild(link);
            link.click();
        });

        this.notificationService.success("Operación exitosa", "Las notificaciones han sido generadas correctamente.");
        jQuery('#impreso-notificaciones').modal({backdrop: 'static', keyboard: false});

        this.isLoading = false;
    }

    private exportDetalleToCSV(jsonEncabezados, jsonFilas)
    {
        let data = [];
        let csvContent = "";
        
        data.push([ jsonEncabezados ]);

        for (let i in jsonFilas)
        {
            data.push([ jsonFilas[i] ]);
        }

        data.forEach(function(infoArray, index) {
            let dataString = infoArray.join(",");
            csvContent += index < data.length ? dataString + "\n" : dataString;
        });

        return csvContent;
    }

    private marcarImpreso() : void
    {
        this.notificacionService.marcarImpreso(this.userLogin.usuario).then(
            (res) => {
                this.notificationService.success("Operación exitosa", "Las notificaciones han sido marcadas como impresas.");
            },
            (error) => {
                this.notificationService.error("Error", JSON.parse(error._body).mensaje);
            }
        );
    }

    private generarNotificacionString(notificacionFilter) : string
    {
        let json_notificacion: Object = {};

        json_notificacion = {
            infra_desde : notificacionFilter.infra_desde != "" ? notificacionFilter.infra_desde : "0",
            infra_hasta : notificacionFilter.infra_hasta != "" ? notificacionFilter.infra_hasta : "0",
            verifica_desde : notificacionFilter.verifica_desde != "" ? notificacionFilter.verifica_desde : "0",
            verifica_hasta : notificacionFilter.verifica_hasta != "" ? notificacionFilter.verifica_hasta : "0",
            detec_sitio : notificacionFilter.detec_sitio != "" ? notificacionFilter.detec_sitio : "0",
            detec_agente : notificacionFilter.detec_agente != null ? notificacionFilter.detec_agente : 0,
            dir_divipo : notificacionFilter.dir_municipio != null ? notificacionFilter.dir_municipio : 0,
            usuario : this.userLogin.usuario
        };

        return '&notificacionFilter=' + JSON.stringify(json_notificacion).replace(/"/g, '\\"');
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private resetFilter() : void
    {
        this.notificacionFilter = { 
            infra_desde : "",
            infra_hasta : "",
            verifica_desde : "",
            verifica_hasta : "",
            detec_sitio : "",
            detec_agente : null,
            dir_departamento : null,
            dir_municipio : null,
            imp_orden : null,
            imp_modo : null
        };

        /*this.notificacionFilter = { 
            infra_desde : "2017-06-01",
            infra_hasta : "2017-06-01",
            verifica_desde : "2017-06-22",
            verifica_hasta : "2017-06-22",
            detec_sitio : "Turbaco",
            detec_agente : 58,
            dir_departamento : 13,
            dir_municipio : 13001,
            imp_orden : 1,
            imp_modo : 1
        };*/

        this.municipios = null;

        this.resetErrores();
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}