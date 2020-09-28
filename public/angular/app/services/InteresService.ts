import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class InteresService
{
    url: string = URL_APP + "administracion/intereses/";
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
                        .then(res => res.json().intereses);
    }
 
    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().interes);
    }

    public insert(interes)
    {
        return this.http.post(this.url + "api/", interes, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public getByFilters(fecha_inicio, fecha_fin)
    {
        return this.http.get(this.url + "getByFilters/" + fecha_inicio + "/" + fecha_fin)
                        .toPromise()
                        .then(res => res.json().intereses);
    }
}