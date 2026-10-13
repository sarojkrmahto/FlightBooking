import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Flight } from '../shared/Flight';
import { BookFlightService } from './book-flight.service';

@Component({
    selector: 'app-book-flight',
    templateUrl: './book-flight.component.html',
    styleUrl: './book-flight.component.css'
})
export class BookFlightComponent implements OnInit {
    [x: string]: any;

    bookingForm!: FormGroup;
    errorMessage!: String;
    successMessage!: String;
    flights!: Flight[];

    constructor(private formBuilder: FormBuilder, private bookFlightService: BookFlightService) { }


    ngOnInit(): void {

        this.bookFlightService.getAllFlights().subscribe({
            next: (flightList) => {
                this.flights = flightList;
                console.log("flights are: ", this.flights);
            },
            error: (err) => {
                this.errorMessage = "Backend is not available";
            }
        })

        // create the bookingForm Formgroup and get all the flight details
        this.bookingForm = this.formBuilder.group({
            passengerName: ['', Validators.required],
            noOfTickets: ['', [Validators.required, Validators.min(1)]],
            flightId: ['', [Validators.required, Validators.pattern("^[A-Z]{3}-[0-9]{3}")]]
        })
    }

    book() {
        // code the method here

        let selectedFlightId = this.bookingForm.get('flightId')?.value;
        let requiredNoOfTickets = this.bookingForm.get('noOfTickets')?.value;

        let matchedFlight = this.flights.find((flight) => {
            return flight.id === selectedFlightId
        });

        if (matchedFlight) {
            console.log(matchedFlight);
            if (matchedFlight.status === 'Cancelled') {
                this.errorMessage = "Flight Cancelled!!";
                return;
            }
            else if (matchedFlight.availableSeats < requiredNoOfTickets) {
                this.errorMessage = "Requested number of seats unavailable";
                return;
            }

            let ticketFare = requiredNoOfTickets * matchedFlight.fare;
            let booking = {
                "passengerName": this['bookingForm'].get('passengerName')?.value,
                "noOfTickets": requiredNoOfTickets,
                "totalAmount": ticketFare,
                "flightId": this['bookingForm'].get('flightId')?.value
            }

            this.bookFlightService.bookFlight(booking).subscribe({
                next: (success) => {
                    this.successMessage =
                        "Flight booking successful with booking id: " + success.id;

                    this.errorMessage = '';

                    let data = {
                        availableSeats: matchedFlight.availableSeats - requiredNoOfTickets
                    };

                    this.bookFlightService.updateFlight(selectedFlightId, data)
                        .subscribe({
                            next: () => {
                                console.log("Available seats updated");
                            },
                            error: (error) => {
                                console.log("Unable to update available seats", error);
                            }
                        })
                },

                error: (error) => {
                    this.errorMessage = "Unable to book flight. Please try again.";
                    this.successMessage = '';
                }
            });
        }
        else {
            this.errorMessage = "Flight Unavailable!!";
        }

    }

    resetForm() {
        this.bookingForm.reset();
        this.successMessage = '';
        this.errorMessage = '';
    }

}

function validateFlight(formControl: FormControl) {
    /**
     * Code the validator her
     * Use flightError as the property
     */
}