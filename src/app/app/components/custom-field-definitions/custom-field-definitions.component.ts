import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule for template-driven forms
import {
  CustomFieldDefinition,
  CustomizationService,
} from '../../../services/customization.service'; // Corrected import path
import { DialogService } from '../../../services/dialog.service'; // Import DialogService

@Component({
  selector: 'app-custom-field-definitions',
  standalone: true, // Mark as standalone
  imports: [CommonModule, FormsModule], // Add CommonModule, FormsModule, and the pipe
  templateUrl: './custom-field-definitions.component.html',
  styleUrl: './custom-field-definitions.component.css',
})
export class CustomFieldDefinitionsComponent implements OnInit {
  customFieldDefinitions: CustomFieldDefinition[] = [];
  newField: Partial<CustomFieldDefinition> = {
    type: 'text',
    entity_type: 'project',
  }; // Initialize new field form
  editingField: Partial<CustomFieldDefinition> | null = null; // To hold field being edited
  entityTypes = ['project', 'task', 'user']; // Available entity types
  fieldTypes = ['text', 'number']; // Available field types (limited as requested)

  constructor(
    private customizationService: CustomizationService,
    private dialogService: DialogService // Inject DialogService
  ) {}

  ngOnInit(): void {
    this.loadFieldDefinitions();
  }

  onEntityTypeChange(): void {
    this.loadFieldDefinitions();
  }

  loadFieldDefinitions(): void {
    // TODO: Determine how to get the organizationId in the frontend.
    // For now, fetching without entityType filter, assuming backend handles organization scoping.
    this.customizationService.getFieldDefinitions().subscribe({
      next: (data: CustomFieldDefinition[]) => {
        // Explicitly type data
        // Assign all fetched fields to the array
        this.customFieldDefinitions = data;
        console.log(
          'Fetched custom field definitions:',
          this.customFieldDefinitions
        ); // Add this log
      },
      error: (error: any) => {
        // Explicitly type error
        console.error('Error loading custom field definitions:', error);
        // TODO: Display user-friendly error message
      },
    });
  }

  createField(): void {
    if (this.newField.name && this.newField.type && this.newField.entity_type) {
      this.customizationService
        .createFieldDefinition(this.newField as CustomFieldDefinition)
        .subscribe({
          next: (field: CustomFieldDefinition) => {
            // Explicitly type field
            this.customFieldDefinitions.push(field);
            this.newField = { type: 'text', entity_type: 'project' }; // Reset form
            this.loadFieldDefinitions(); // Reload the list after creating a field
          },
          error: (error: any) => {
            // Explicitly type error
            console.error('Error creating custom field:', error);
            // TODO: Display user-friendly error message
          },
        });
    } else {
      // TODO: Show validation error to user
      console.warn(
        'Please fill in all required fields for the new custom field.'
      );
    }
  }

  editField(field: CustomFieldDefinition): void {
    this.editingField = { ...field }; // Create a copy for editing
  }

  saveEditedField(): void {
    if (this.editingField && this.editingField.id) {
      this.customizationService
        .updateFieldDefinition(this.editingField.id, this.editingField)
        .subscribe({
          next: (updatedField: CustomFieldDefinition) => {
            // Explicitly type updatedField
            const index = this.customFieldDefinitions.findIndex(
              (f) => f.id === updatedField.id
            );
            if (index !== -1) {
              this.customFieldDefinitions[index] = updatedField;
            }
            this.cancelEditing();
          },
          error: (error: any) => {
            // Explicitly type error
            console.error('Error updating custom field:', error);
            // TODO: Display user-friendly error message
          },
        });
    }
  }

  cancelEditing(): void {
    this.editingField = null;
  }

  deleteField(id: string): void {
    // Changed to return void
    this.dialogService
      .openConfirmationDialog(
        'Are you sure you want to delete this custom field?'
      )
      .subscribe((confirmed) => {
        // Subscribe to the observable
        if (confirmed) {
          this.customizationService.deleteFieldDefinition(id).subscribe({
            next: () => {
              this.customFieldDefinitions = this.customFieldDefinitions.filter(
                (f) => f.id !== id
              );
            },
            error: (error: any) => {
              console.error('Error deleting custom field:', error);
              // TODO: Display user-friendly error message
            },
          });
        }
      });
  }
}
