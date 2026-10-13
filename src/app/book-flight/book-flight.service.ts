import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from '../shared/Flight';

@Injectable({
    providedIn: 'root'
})
export class BookFlightService {
    flightDetail!: any;
    error!: any;
    errorMessage!: any;

    flightUrl = "http://localhost:3000/flights";
    bookingUrl =  "http://localhost:3000/bookings";

    constructor(private httpClient: HttpClient) { }

    bookFlight(data: any): Observable<any> {
        return this.httpClient.post(this.bookingUrl, data);
    }

    getAllFlights(): Observable<Flight[]>{
        return this.httpClient.get<Flight[]>(this.flightUrl);
    }

    updateFlight(flightId: any, data: any): Observable<any>{
        return this.httpClient.patch(this.flightUrl + "/" + flightId, data);

    }
}
