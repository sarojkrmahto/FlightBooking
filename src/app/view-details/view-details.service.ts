import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FlightBooking } from '../shared/FlightBooking';

@Injectable({
    providedIn: 'root'
})
export class ViewDetailsService {

    url = "http://localhost:3000/bookings"

    constructor(private httpClient: HttpClient) { }

    view(): Observable<FlightBooking[]>{
        return this.httpClient.get<FlightBooking[]>(this.url);

    }

    delete(id: any): Observable<any>{
        return this.httpClient.delete(this.url + "/" + id);

    }
}
