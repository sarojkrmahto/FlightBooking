import { Component, OnInit } from '@angular/core';
import { FlightBooking } from '../shared/FlightBooking';
import { ViewDetailsService } from './view-details.service';
import { BookFlightService } from '../book-flight/book-flight.service';
import { filter, find } from 'rxjs';
import { Flight } from '../shared/Flight';

@Component({
    selector: 'app-view-details',
    templateUrl: './view-details.component.html',
    styleUrl: './view-details.component.css'
})
export class ViewDetailsComponent implements OnInit {

    flightsDetails!: FlightBooking[];
    successMessage!: string;
    errorMessage!: string;
    toBedeleted: boolean = false;

    constructor(private viewDetailsService: ViewDetailsService, private bookFlightService: BookFlightService) { }

    ngOnInit(): void {
        this.viewDetailsService.view().subscribe({
            next: (flightDetails) => {
                this.flightsDetails = flightDetails;
            },
            error: (err) => {
                this.errorMessage = err;
            }
        })

    }

    // view(){

    // }

    delete(id: any) {

        // Find the booking details before deleting
        let flightDetails: FlightBooking | undefined = this.flightsDetails.find((booking: any) => booking.id == id);
        console.log(flightDetails?.flightId);

        this.viewDetailsService.delete(id).subscribe({
            next: () => {

                // Update the local UI list immediately
                this.flightsDetails = this.flightsDetails.filter((booking: any) => booking.id != id);

                // Fetch the flight to get its current seat count
                this.bookFlightService.getAllFlights().subscribe({
                    next: (flights: Flight[]) => {
                        const matchedFlight = flights.find(flight => flight.id === flightDetails?.flightId);

                        if (matchedFlight) {
                            const currentSeats = matchedFlight.availableSeats;
                            const releasedSeats = flightDetails?.noOfTickets;

                            const updatedData = {
                                availableSeats: currentSeats + releasedSeats,
                            }

                            console.log("Available seats now became: ", updatedData.availableSeats);

                            // Update the flight only after seats are retrieved
                            this.bookFlightService.updateFlight(flightDetails?.flightId, updatedData).subscribe({
                                next: () => {
                                    this.successMessage = "Successfully deleted the booking with booking id: " + id;
                                    console.log("Available seats updated successfully");
                                },
                                error: (error) => {
                                    this.errorMessage = "Booking was deleted, but failed to update available seats.";
                                    console.error("Unable to update available seats", error);
                                }
                            });
                        }
                    },
                    error: (error) => {
                        this.errorMessage = "Booking deleted, but failed to fetch flights to update seats.";
                        console.error("Can't fetch the data from database", error);
                    }
                });
            },
            error: (error) => {
                this.errorMessage = "Booking cannot be deleted.";
                console.error(error);
            }
        });
    }



}
