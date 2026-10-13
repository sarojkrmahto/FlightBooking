import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'Flight-Booking';
    showGuidelines: boolean = true;

    constructor(public router: Router) { }

    onShowGuidelines(val: any) {
        if (val == 1) {
            this.showGuidelines = false;
            this.router.navigate(['/book']);
        }
        else if (val == 2) {
            this.showGuidelines = false;
            this.router.navigate(['/view'])
        }
    }
}
