import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class DeteccionService
{
    url: string = URL_APP + "pruebas/detecciones/";
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
                        .then(res => res.json().detecciones);
    }

    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().deteccion);
    }
 
    public insert(deteccion)
    {
        return this.http.post(this.url + "api/", deteccion, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json())
                        .catch(error => error.json());
    }

    public update(deteccion, id)
    {
        return this.http.patch(this.url + "api/" + id, deteccion, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public getByFilters(fuente, estado)
    {
        return this.http.get(this.url + "getByFilters/" + fuente + "/" + estado)
                        .toPromise()
                        .then(res => res.json().detecciones);
    }
}