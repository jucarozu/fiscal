import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class ComparendoSeguimientoService
{
    url: string = URL_APP + "comparendos/comparendosSeguimiento/";
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
                        .then(res => res.json().comparendosSeguimiento);
    }

    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().comparendoSeguimiento);
    }
 
    public insert(comparendoSeguimiento)
    {
        return this.http.post(this.url + "api/", comparendoSeguimiento, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json())
                        .catch(error => error.json());
    }

    public getByFilters(comparendo)
    {
        return this.http.get(this.url + "getByFilters/" + comparendo)
                        .toPromise()
                        .then(res => res.json().comparendosSeguimiento);
    }
}