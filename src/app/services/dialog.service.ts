import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog'; // Import MatDialog and MatDialogRef
import { Observable } from 'rxjs'; // Import Observable
import { ConfirmationDialogComponent } from '../components/dialogs/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {} // Inject MatDialog

  openConfirmationDialog(message: string): Observable<boolean | undefined> {
    // Return Observable<boolean | undefined>
    const dialogRef: MatDialogRef<ConfirmationDialogComponent> =
      this.dialog.open(ConfirmationDialogComponent, {
        data: { message: message }, // Pass data using the data property
      });

    return dialogRef.afterClosed(); // Return the afterClosed observable
  }
}
