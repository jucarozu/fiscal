import { Component, Input, OnInit } from '@angular/core';

import { IUsuario } from "../../../../../interfaces/IUsuario";

import { ParametroService } from "../../../../../services/ParametroService";

@Component({
    selector: 'usuario-detail',
    templateUrl: './app/components/src/seguridad/usuarios/detail/usuario-detail.html',
    bindings: [ParametroService]
})
 
export class UsuarioDetailComponent implements OnInit
{
	gpTipoDocumento: number = 1;
    gpCargo: number = 4;

    @Input('usuario') usuarioForm: IUsuario;

    documentos: Array<Object> = [];
    cargos: Array<Object> = [];

    constructor(private parametroService: ParametroService) {}

    ngOnInit()
    {
        this.cargarCombos();
    }

    private cargarCombos()
    {
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos});
        this.parametroService.getByGrupo(this.gpCargo).then(cargos => { this.cargos = cargos });
    }
}