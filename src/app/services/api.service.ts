import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable()
export class ApiService {
    public url: string;
    public identity;
    public stats;

    constructor(public _http: HttpClient) {
        this.url = environment.API_URL
        /* this.url = "http://localhost:3000";   */
    }

    getFacturas(street): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this._http.get(this.url + "/consulta/firmaalb?filtrar= (SITUACION = 'A') AND dIRENT1 like '%"+street+"%' ORDER BY ORDENRUTA ASC", { headers: headers });
    }

    getCli(client): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this._http.get(this.url + '/consulta/clientes?filtrar= codcli = '+client, { headers: headers });
    }

    getPdf(id): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get(this.url + '/DescargaDocumento/LSTIMPRALBV/drive?parametros=identificador='+id, { headers: headers });
    }

    putAlbaran(body, id): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8"',
        });

        return this._http.put(this.url + '/albaran/v/' + id,  body,{ headers: headers });
    }
}