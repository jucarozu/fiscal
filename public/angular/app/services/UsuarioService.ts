import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { URL_APP } from "../constants/URL_APP";
 
@Injectable()
export class UsuarioService
{
    url: string = URL_APP + "seguridad/usuarios/";
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
                        .then(res => res.json().usuarios);
    }
 
    public getById(id)
    {
        return this.http.get(this.url + "api/" + id)
                        .toPromise()
                        .then(res => res.json().usuario);
    }
 
    public insert(usuario)
    {
        return this.http.post(this.url + "api/", usuario, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
 
    public update(usuario, id)
    {
        return this.http.patch(this.url + "api/" + id, usuario, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
 
    public delete(id)
    {
        return this.http.delete(this.url + "api/" + id, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public getByPersona(persona)
    {
        return this.http.get(this.url + "getByPersona/" + persona)
                        .toPromise()
                        .then(res => res.json().usuario);
    }    

    public resetPassword(id)
    {
        return this.http.patch(this.url + "resetPassword/" + id, null, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public forcePassword(id)
    {
        return this.http.patch(this.url + "forcePassword/" + id, null, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }

    public changePassword(password, id)
    {
        return this.http.patch(this.url + "changePassword/" + id, password, { headers: this.headers })
                        .toPromise()
                        .then(res => res.json());
    }
}