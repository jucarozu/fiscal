import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class DeteccionSeguimientoService
{
    url: string = URL_APP + "pruebas/deteccionesSeguimiento/";
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
                        .then(res => res.json().deteccionesSeguimiento);
    }

    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().deteccionSeguimiento);
    }
 
    public insert(deteccionSeguimiento)
    {
        return this.http.post(this.url + "api/", deteccionSeguimiento, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json())
                        .catch(error => error.json());
    }

    public getByFilters(deteccion, estado)
    {
        return this.http.get(this.url + "getByFilters/" + deteccion + "/" + estado)
                        .toPromise()
                        .then(res => res.json().deteccionSeguimiento);
    }
}