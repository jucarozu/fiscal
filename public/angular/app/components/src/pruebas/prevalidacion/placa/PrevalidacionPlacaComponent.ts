import { Component, Input, OnInit } from '@angular/core';

import { IDeteccion } from "../../../../../interfaces/IDeteccion";
import { IDeteccionSeguimiento } from "../../../../../interfaces/IDeteccionSeguimiento";
import { IEvidencia } from "../../../../../interfaces/IEvidencia";
import { ICrop } from "../../../../../interfaces/ICrop";
import { IUsuario } from "../../../../../interfaces/IUsuario";

import { DeteccionService } from "../../../../../services/DeteccionService";
import { DeteccionSeguimientoService } from "../../../../../services/DeteccionSeguimientoService";
import { EvidenciaService } from "../../../../../services/EvidenciaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'prevalidacion-placa',
    templateUrl: './app/components/src/pruebas/prevalidacion/placa/prevalidacion-placa.html',
    bindings: [DeteccionService, DeteccionSeguimientoService, NotificationsService],
    directives: [SimpleNotificationsComponent]
})

export class PrevalidacionPlacaComponent implements OnInit
{
    isLoading: boolean = false;

    userLogin: IUsuario;

    deteccionForm: IDeteccion;

    @Input('evidencia') evidenciaForm: IEvidencia;
    cropForm: ICrop;

    @Input('placa') placa: string;
    placa_confirm: string = "";

    deteccionSeguimientoForm: IDeteccionSeguimiento;

    errores: Array<Object> = [];

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

    constructor(private deteccionService: DeteccionService,
                private deteccionSeguimientoService: DeteccionSeguimientoService,
                private evidenciaService: EvidenciaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        this.resetFormulario();
        this.agregarEventos();
    }

    private agregarEventos()
    {
        jQuery('#placa-prevalidacion').on('show.bs.modal', function() {
            jQuery('#btn-load-evidencia-placa').click();
        });

        jQuery('#placa-confirm').on('hide.bs.modal', function() {
            jQuery('#btn-insertar').click();
        });
    }

    private cargarEvidencia()
    {
        switch (this.evidenciaForm.tipo_archivo)
        {
            case '1':
                
                // Asignar la fuente de datos de la imagen al visor de la evidencia para el recorte.
                jQuery('#img-evidencia-placa, #img-miniatura-placa').prop(
                    'src', 'data:image/' + this.evidenciaForm.extension + '; base64, ' + this.evidenciaForm.array_bytes
                );

                // Establecer parámetros del área del recorte.
                jQuery('#img-evidencia-placa').imgAreaSelect({
                    handles: true,
                    onSelectChange: function(img, selection) {
                        var scaleX = 300 / (selection.width || 1);
                        var scaleY = 200 / (selection.height || 1);

                        jQuery('#img-miniatura-placa').css({
                            width: Math.round(scaleX * 600) + 'px',
                            height: Math.round(scaleY * 400) + 'px',
                            marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
                            marginTop: '-' + Math.round(scaleY * selection.y1) + 'px'
                        });

                        jQuery('#x1').val(selection.x1);
                        jQuery('#y1').val(selection.y1);
                        jQuery('#width').val(selection.width);
                        jQuery('#height').val(selection.height);
                    }
                });

                break;

            case '2':
                
                // Asignar la fuente de datos del video al visor de la evidencia para el recorte.
                jQuery('#video-evidencia-placa, #video-miniatura-placa').prop(
                    'src', 'data:video/' + this.evidenciaForm.extension + '; base64, ' + this.evidenciaForm.array_bytes
                );

                // Establecer parámetros del área del recorte.
                jQuery('#video-evidencia-placa').imgAreaSelect({
                    handles: true,
                    onSelectChange: function(img, selection) {
                        var scaleX = 300 / (selection.width || 1);
                        var scaleY = 200 / (selection.height || 1);

                        jQuery('#video-miniatura-placa').css({
                            width: Math.round(scaleX * 600) + 'px',
                            height: Math.round(scaleY * 400) + 'px',
                            marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
                            marginTop: '-' + Math.round(scaleY * selection.y1) + 'px'
                        });

                        jQuery('#x1').val(selection.x1);
                        jQuery('#y1').val(selection.y1);
                        jQuery('#width').val(selection.width);
                        jQuery('#height').val(selection.height);
                    }
                });

                // Sincronizar video con la miniatura.
                jQuery('#video-evidencia-placa').on('pause', function() {
                    jQuery('#video-miniatura-placa')[0].currentTime = this.currentTime;
                    jQuery('#time').val(this.currentTime);
                });

                break;

            default:
                
                break;
        }
    }

    private convertPlacaToUpper()
    {
        this.placa_confirm = this.placa_confirm.toUpperCase();
    }

    private compararPlacas()
    {
        if (this.placa != this.placa_confirm)
        {
            jQuery('#placa-confirm').modal({backdrop: 'static', keyboard: false});
            return;
        }

        jQuery('#is-confirm-placa').val('true');
        this.insertar();
    }

    private confirmarValidacionPlaca()
    {
        jQuery('#is-confirm-placa').val('true');
        this.cerrarVentanaConfirm();
    }

    private cerrarVentanaConfirm()
    {
        jQuery('#placa-confirm').modal('hide');
    }

    private verificarConfirmacionPlaca()
    {
        let isConfirmPlaca = jQuery('#is-confirm-placa').val();

        // Se verifica que se haya validado la placa.
        if (isConfirmPlaca == 'false')
        {
            return false;
        }

        return true;
    }

    private verificarRecortePlaca()
    {
        // Se verifica que se haya recortado la placa.
        if (this.cropForm.x1 == 0 && this.cropForm.y1 == 0 && this.cropForm.width == 0 && this.cropForm.height == 0)
        {
            return false;
        }

        return true;
    }
    
    private insertar() : void
    {
        if (!this.verificarConfirmacionPlaca())
        {
            return;
        }

        this.cropForm.is_video = jQuery('#is_video').val();
        this.cropForm.time = jQuery('#time').val();
        this.cropForm.x1 = jQuery('#x1').val();
        this.cropForm.y1 = jQuery('#y1').val();
        this.cropForm.width = jQuery('#width').val();
        this.cropForm.height = jQuery('#height').val();

        if (!this.verificarRecortePlaca())
        {
            this.errores.push("Debe indicar la sección de la evidencia que se tomará para la validación de la placa.");
            return;
        }

        this.resetErrores();        
        this.isLoading = true;

        this.deteccionForm.deteccion = this.evidenciaForm.deteccion;
        this.deteccionForm.placa = this.placa_confirm;

        let deteccionString = this.generarDeteccionString(this.deteccionForm);

        this.deteccionService.update(deteccionString, this.deteccionForm.deteccion).then(
            (res) => {
                let recorteString = this.generarEvidenciaCropString(this.evidenciaForm, this.cropForm);

                this.evidenciaService.recortarEvidencia(recorteString).then(
                    (res) => {
                        this.deteccionSeguimientoForm.deteccion = this.deteccionForm.deteccion;
                        this.deteccionSeguimientoForm.usuario = this.userLogin.usuario;
                        this.deteccionSeguimientoForm.observaciones = "Placa original: " + this.placa + " - Placa validada: " + this.placa_confirm;

                        // Estado 4: Placa validada
                        this.deteccionSeguimientoForm.estado = 4;

                        let deteccionSeguimientoString = this.generarDeteccionSeguimientoString(this.deteccionSeguimientoForm);

                        this.deteccionSeguimientoService.insert(deteccionSeguimientoString).then(
                            (res) => {
                                this.notificationService.success("Operación exitosa", "La placa fue validada correctamente.");
                                jQuery('#is-valid-placa').val('true');

                                this.cerrarVentana();

                                this.isLoading = false;
                            },
                            (error) => {
                                this.errores.push("Ha ocurrido un error al registrar el seguimiento de la detección.");
                                this.isLoading = false;
                            }
                        );
                    },
                    (error) => {
                        this.errores.push("Ha ocurrido un error al registrar la evidencia de la validación de la placa.");
                        this.isLoading = false;
                    }
                );
            },
            (error) => {
                this.errores.push("Ha ocurrido un error al validar la placa asociada a la detección.");
                this.isLoading = false;
            }
        );
    }

    private generarDeteccionString(deteccion) : string
    {
        return '&placa=' + (deteccion.placa != null ? deteccion.placa : '');
    }

    private generarEvidenciaCropString(evidencia, crop) : string
    {
        return '&deteccion=' + (evidencia.deteccion != null ? evidencia.deteccion : '') +
               '&evidencia=' + (evidencia.evidencia != null ? evidencia.evidencia : '') +
               '&ruta=' + (evidencia.ruta != null ? evidencia.ruta : '') +
               '&nombre_archivo=' + (evidencia.nombre_archivo != null ? evidencia.nombre_archivo : '') +
               '&is_video=' + (crop.is_video != null ? crop.is_video : '') +
               '&time=' + (crop.time != null ? crop.time : '') +
               '&x1=' + (crop.x1 != null ? crop.x1 : '') +
               '&y1=' + (crop.y1 != null ? crop.y1 : '') +
               '&width=' + (crop.width != null ? crop.width : '') +
               '&height=' + (crop.height != null ? crop.height : '');
    }

    private generarDeteccionSeguimientoString(deteccionSeguimiento) : string
    {
        return '&deteccion=' + (deteccionSeguimiento.deteccion != null ? deteccionSeguimiento.deteccion : '') +
               '&usuario=' + (deteccionSeguimiento.usuario != null ? deteccionSeguimiento.usuario : '') +
               '&estado=' + (deteccionSeguimiento.estado != null ? deteccionSeguimiento.estado : '') +
               '&observaciones=' + (deteccionSeguimiento.observaciones != null ? deteccionSeguimiento.observaciones : '');
    }

    private resetFormulario() : void
    {
        this.deteccionForm = JSON.parse('{' + 
            ' "fecha" : "",' +
            ' "hora" : "",' +
            ' "fuente" : null,' + 
            ' "referencia_disp" : "",' + 
            ' "latitud" : null,' +
            ' "longitud" : null,' +
            ' "direccion" : "",' + 
            ' "complemento_direccion" : "",' + 
            ' "placa" : "",' + 
            ' "tipo_vehiculo" : null,' +
            ' "color" : "",' + 
            ' "servicio" : null,' +
            ' "nivel" : null,' +
            ' "carril" : "",' +
            ' "sentido" : null,' +
            ' "velocidad" : null,' +
            ' "unidad_velocidad" : null,' +
            ' "observaciones" : ""' +
        '}');

        this.cropForm = JSON.parse('{' + 
            ' "is_video" : null,' + 
            ' "time" : 0,' + 
            ' "x1" : 0,' +
            ' "y1" : 0,' + 
            ' "width" : 0,' + 
            ' "height" : 0' +
        '}');

        this.deteccionSeguimientoForm = JSON.parse('{' + 
            ' "deteccion" : null,' +
            ' "usuario" : null,' +
            ' "estado" : null,' +
            ' "observaciones" : ""' +
        '}');

        this.placa_confirm = "";
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private cerrarVentana() : void
    {
        this.resetFormulario();
        this.resetErrores();

        jQuery('#img-evidencia-placa').imgAreaSelect({ remove: true });
        jQuery('#video-evidencia-placa').imgAreaSelect({ remove: true });

        jQuery('#placa-prevalidacion').modal('hide');
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}