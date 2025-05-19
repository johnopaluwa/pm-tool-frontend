import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'; // Import MatDialogModule and MatDialogRef

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule], // Add MatDialogModule here
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css',
})
export class ConfirmationDialogComponent {
  @Input() message: string = 'Are you sure?';
  @Output() confirmed = new EventEmitter<boolean>();

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>) {} // Inject MatDialogRef

  onConfirm(): void {
    this.dialogRef.close(true); // Close dialog and pass true
  }

  onCancel(): void {
    this.dialogRef.close(false); // Close dialog and pass false
  }
}
