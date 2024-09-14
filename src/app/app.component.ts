import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  seats: string[][] = []; // 2d array for seats
  lastRow: string[] = []; // last row
  numSeats: number = 1; // no. of seats

  constructor() {
    this.getSeats(); // seating arrangement intitilization
  }

  getSeats() {
    const allSeats = Array(80).fill('available');

    // pre-booking
    allSeats[0] = 'booked';
    allSeats[1] = 'booked';
    allSeats[50] = 'booked';

    // divide into 7 except last
    this.seats = [];
    for (let i = 0; i < 77; i += 7) {
      this.seats.push(allSeats.slice(i, i + 7));
    }
    this.lastRow = allSeats.slice(77); // last
  }

  // book seats
  bookSeats() {
    const requiredSeats = this.numSeats; // number of seats

    // check if seats = 1-7
    if (requiredSeats < 1 || requiredSeats > 7) {
      alert('You can only book between 1 and 7 seats.');
      return;
    }

    let seatsToBook = []; // hold booked seats

    // finding seats in same row
    outerLoop: for (let i = 0; i < this.seats.length; i++) {
      let row = this.seats[i];
      let availableInRow = [];

      for (let j = 0; j < row.length; j++) {
        if (row[j] === 'available') {
          availableInRow.push({ row: i, seat: j });
          if (availableInRow.length === requiredSeats) {
            seatsToBook = availableInRow; // if enough seats
            break outerLoop;
          }
        } else {
          availableInRow = []; // reset
        }
      }
    }

    // if not enough seats, look for the nearby
    if (seatsToBook.length < requiredSeats) {
      seatsToBook = [];
      for (let i = 0; i < this.seats.length; i++) {
        for (let j = 0; j < this.seats[i].length; j++) {
          if (this.seats[i][j] === 'available') {
            seatsToBook.push({ row: i, seat: j });
            if (seatsToBook.length === requiredSeats) break;
          }
        }
        if (seatsToBook.length === requiredSeats) break;
      }
    }

    // if still not enough, we check last row
    if (seatsToBook.length < requiredSeats) {
      for (let j = 0; j < this.lastRow.length; j++) {
        if (this.lastRow[j] === 'available') {
          seatsToBook.push({ row: -1, seat: j }); // -1 row=last
          if (seatsToBook.length === requiredSeats) break;
        }
      }
    }

    // if found enough seats->book
    if (seatsToBook.length === requiredSeats) {
      seatsToBook.forEach(({ row, seat }) => {
        if (row === -1) {
          this.lastRow[seat] = 'booked'; // seat in last row booked
        } else {
          this.seats[row][seat] = 'booked'; // seat in regular row booked
        }
      });
      alert(
        `Seats booked: ${seatsToBook
          .map(({ row, seat }) => (row === -1 ? 78 + seat : row * 7 + seat + 1))
          .join(', ')}`
      );
    } else {
      alert('Not enough seats available');
    }
  }
}
