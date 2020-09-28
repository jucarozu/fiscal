import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";

import { IUsuario } from "../interfaces/IUsuario";
 
@Injectable()
export class AuditoriaService
{
    url: string = URL_APP + "seguridad/auditoria/";
    headers: Headers = new Headers;

    userLogin: IUsuario;
 
    constructor(private http: Http)
    {
        if (this.userLogin == null) 
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }

    public get()
    {
        return this.http.get(this.url + "api/")
                        .toPromise()
                        .then(res => res.json().registrosAuditoria);
    }

    public insert(opcion, accion, peticion?)
    {
        let registroAuditoria = "usuario=" + this.userLogin.usuario
                              + "&opcion=" + opcion
                              + "&accion=" + accion
                              + "&peticion=" + (peticion != undefined ? peticion : "");
                     
        return this.http.post(this.url + "api/", registroAuditoria, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
}