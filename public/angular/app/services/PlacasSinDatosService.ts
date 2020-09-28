import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class PlacasSinDatosService
{
    url: string = URL_APP + "pruebas/placasSinDatos/";
    headers: Headers = new Headers;
 
    constructor(private http: Http)
    {
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }
 
    public get()
    {
        return this.http.get(this.url + "api/")
                        .toPromise()
                        .then(res => res.json().placas);
    }

    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().placa);
    }
 
    public count()
    {
        return this.http.get(this.url + "count/")
                        .toPromise()
                        .then(res => res.json().cantPlacas);
    }
}