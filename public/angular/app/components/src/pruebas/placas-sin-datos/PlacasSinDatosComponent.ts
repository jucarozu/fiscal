import { Component, Input, OnInit } from '@angular/core';

import { CanActivate, ComponentInstruction, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { IsLoggedIn } from '../../../../constants/IsLoggedIn';

import { IOpcion } from "../../../../interfaces/IOpcion";

import { AuthService } from '../../../../services/AuthService';
import { PlacasSinDatosService } from "../../../../services/PlacasSinDatosService";
import { AuditoriaService } from "../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'placas-sin-datos-view',
    templateUrl: './app/components/src/pruebas/placas-sin-datos/placas-sin-datos-view.html',
    bindings: [AuthService, PlacasSinDatosService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return IsLoggedIn(next, previous);
})

export class PlacasSinDatosComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 1; // Consultar

    opcion: IOpcion;

    cantPlacas: number = 0;
    csvPlacas: string = "";
    
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
                private placasSinDatosService: PlacasSinDatosService,
                private auditoriaService: AuditoriaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
            
        this.contarRegistros();

        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    }

    private contarRegistros() : void
    {
        this.isLoading = true;

        this.placasSinDatosService.count().then(cantPlacas => 
            {
            	this.cantPlacas = cantPlacas;
                this.isLoading = false;
            }
        );
    }

    private descargar() : void
    {
        this.isLoading = true;

        this.placasSinDatosService.get().then(placas => 
            {
                this.csvPlacas = this.exportToCSV(placas);

                var encodedUri = encodeURI(this.csvPlacas);
				var link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "placas_sin_datos.csv");
				document.body.appendChild(link);
				link.click();

                this.isLoading = false;
            }
        );
    }

    private exportToCSV(objJson)
    {
        let data = [];
        let csvContent = "data:text/csv;charset=utf-8,";

        data.push(['PLACA']);

        for (let i in objJson)
        {
            data.push([objJson[i]['placa']]);
        }

        data.forEach(function(infoArray, index)
        {
            let dataString = infoArray.join(",");
            csvContent += index < data.length ? dataString + "\n" : dataString;
        });

        return csvContent;
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}