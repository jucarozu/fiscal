import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class ValidacionService
{
    url: string = URL_APP + "pruebas/validacion/";
    headers: Headers = new Headers;
 
    constructor(private http: Http)
    {
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }

    public consultar(fuente)
    {
        return this.http.get(this.url + "api/" + fuente)
                        .toPromise()
                        .then(res => res.json().detecciones);
    }
 
    public validar(validacion)
    {
        return this.http.patch(this.url + "api/", validacion, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public descartar(validacion)
    {
        return this.http.patch(this.url + "api/descarte", validacion, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
}