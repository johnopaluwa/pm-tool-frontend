import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000, // Duration in milliseconds
      horizontalPosition: 'left', // Position on the left
      verticalPosition: 'bottom', // Position at the bottom
      panelClass: ['snackbar-error'], // Optional: Add a custom CSS class for styling
    });
  }

  // You can add other types of snackbars (success, info) here if needed
  // showSuccess(message: string): void {
  //   this.snackBar.open(message, 'Close', {
  //     duration: 3000,
  //     horizontalPosition: 'left',
  //     verticalPosition: 'bottom',
  //     panelClass: ['snackbar-success'],
  //   });
  // }
}
