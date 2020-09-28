import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class CargaPropietariosService
{
    url: string = URL_APP + "administracion/cargaPropietarios/";
    headers: Headers = new Headers;
 
    constructor(private http: Http)
    {
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }
 
    public insert(cargaPropietarios)
    {
        return this.http.post(this.url + "api/", cargaPropietarios, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
}