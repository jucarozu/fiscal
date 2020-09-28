import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class CargaInformacionService
{
    url: string = URL_APP + "administracion/cargaInformacion/";
    headers: Headers = new Headers;
 
    constructor(private http: Http)
    {
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }
 
    public insert(cargaInformacion)
    {
        return this.http.post(this.url + "api/", cargaInformacion, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
}