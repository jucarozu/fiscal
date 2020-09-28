import { Component, Input, OnInit } from '@angular/core';

import { IPersona } from "../../../../../interfaces/IPersona";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { DivipoService } from "../../../../../services/DivipoService";
import { ParametroService } from "../../../../../services/ParametroService";

declare var jQuery : any;

@Component({
    selector: 'persona-detail',
    templateUrl: './app/components/src/administracion/personas/detail/persona-detail.html',
    bindings: [DivipoService, ParametroService]
})
 
export class PersonaDetailComponent implements OnInit
{
    isLoading: boolean = false;

	gpTipoDocumento: number = 1;
	gpGenero: number = 2;
	gpGrupoSanguineo: number = 3;

    opcion: IOpcion;

    @Input('persona') personaForm: IPersona;

    departamentos: Array<Object> = [];
    municipios: Array<Object> = [];

    documentos: Array<Object> = [];
    generos: Array<Object> = [];
    gruposSanguineos: Array<Object> = [];

    constructor(private divipoService: DivipoService, 
                private parametroService: ParametroService) {}

    ngOnInit()
    {
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.agregarEventos();
        this.cargarCombos();
    }

    private agregarEventos()
    {
        jQuery('#detail-persona').on('show.bs.modal', function() {
            jQuery('#btn-load-municipios').click();
        });
    }

    private cargarCombos()
    {
        this.divipoService.getDepartamentos().then(departamentos => { this.departamentos = departamentos; });

        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpGenero).then(generos => { this.generos = generos; });
        this.parametroService.getByGrupo(this.gpGrupoSanguineo).then(gruposSanguineos => { this.gruposSanguineos = gruposSanguineos; });
    }

    private cargarMunicipios(cod_departamento)
    {
        this.isLoading = true;

        if (cod_departamento != null)
        {
            this.divipoService.getMunicipios(cod_departamento).then(
                municipios => { 
                    this.municipios = municipios;
                    this.isLoading = false;
                }
            );
        }            
        else
        {
            this.municipios = null;
            this.isLoading = false;
        }
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}