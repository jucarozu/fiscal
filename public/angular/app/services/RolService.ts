import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class RolService
{
    url: string = URL_APP + "seguridad/roles/";
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
                        .then(res => res.json().roles);
    }

    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().rol);
    }
 
    public insert(rol)
    {
        return this.http.post(this.url + "api/", rol, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
 
    public update(rol, id)
    {
        return this.http.patch(this.url + "api/" + id, rol, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
}