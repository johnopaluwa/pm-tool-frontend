import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'; // Import MatDialogModule
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-new-task-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
  ], // Add MatDialogModule
  templateUrl: './new-task-dialog.component.html',
  styleUrl: './new-task-dialog.component.css',
})
export class NewTaskDialogComponent {
  taskName: string = '';
  taskDescription: string = '';

  constructor(public dialogRef: MatDialogRef<NewTaskDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.taskName) {
      this.dialogRef.close({
        name: this.taskName,
        description: this.taskDescription,
      });
    }
  }
}
