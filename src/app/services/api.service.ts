import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;
const TOKEN_KEY = 'my-token';
const USER = '';

@Injectable()
export class ApiService {
    public url: string;
    public identity;
    public stats;

    constructor(public _http: HttpClient) {
        this.url = environment.API_URL
        /* this.url = "http://localhost:3000";   */
    }

    async getFacturas(street): Promise<Observable<any>> {
        let token = await Storage.get({ key: TOKEN_KEY })
        let headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8"',
            'Authorization': 'Bearer ' + token.value,
        });
        return this._http.get(this.url + "/consulta/firmaalb?filtrar= (SITUACION = 'A') AND dIRENT1 like '%"+street+"%' ORDER BY ORDENRUTA ASC", { headers: headers });
    }

    async getFacturasserv(): Promise<Observable<any>> {
        let token = await Storage.get({ key: TOKEN_KEY })
        let headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8"',
            'Authorization': 'Bearer ' + token.value,
        });
        return this._http.get(this.url + "/consulta/firmaalb?filtrar= (SITUACION = 'S') ", { headers: headers });
    }

    async getContactos(): Promise<Observable<any>> {
        let token = await Storage.get({ key: TOKEN_KEY })
        let headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8"',
            'Authorization': 'Bearer ' + token.value,
        });
        return this._http.get(this.url + "/consulta/__CONTACTOS as c inner join __CONTACTOSRELACION as r on r.ID=c.id where r.identidad=1?campos=c.NOMBRE,c.NIF,r.EMAIL", { headers: headers });
    }

    async getCli(client): Promise<Observable<any>> {
        let token = await Storage.get({ key: TOKEN_KEY })
        let headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8"',
            'Authorization': 'Bearer ' + token.value,
        });
        return this._http.get(this.url + '/consulta/clientes?filtrar= codcli = '+client, { headers: headers });
    }

    async getPdf(id): Promise<Observable<any>> {
        let token = await Storage.get({ key: TOKEN_KEY })
        let headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8"',
            'Authorization': 'Bearer ' + token.value,
        });
        return this._http.get(this.url + '/DescargaDocumento/LSTIMPRALBV/drive?parametros=identificador='+id, { headers: headers });
    }

    async putAlbaran(body, id): Promise<Observable<any>> {
        let token = await Storage.get({ key: TOKEN_KEY })
        let headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8"',
            'Authorization': 'Bearer ' + token.value,
        });

        return this._http.put(this.url + '/albaran/v/' + id,  body,{ headers: headers });
    }

    async serve(doc): Promise<Observable<any>> {
        let token = await Storage.get({ key: TOKEN_KEY })
        let headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8"',
            'Authorization': 'Bearer ' + token.value,
        });

        return this._http.post(this.url + '/albaran/ServirAFactura/' + doc, {}, { headers: headers });
    }
}