import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class PrevalidacionService
{
    url: string = URL_APP + "pruebas/prevalidacion/";
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
 
    public validar(prevalidacion)
    {
        return this.http.patch(this.url + "api/", prevalidacion, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public descartar(prevalidacion)
    {
        return this.http.patch(this.url + "api/descarte", prevalidacion, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
}