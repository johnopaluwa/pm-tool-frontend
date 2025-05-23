import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core'; // Import Inject
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog'; // Import MAT_DIALOG_DATA

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css',
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string } // Inject data
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Close dialog and pass true
  }

  onCancel(): void {
    this.dialogRef.close(false); // Close dialog and pass false
  }
}
