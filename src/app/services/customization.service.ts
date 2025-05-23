import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; // Import catchError and tap

import { SnackbarService } from './snackbar.service'; // Import SnackbarService

// Define interfaces for the data structures
export interface CustomFieldDefinition {
  id?: string; // Optional for creation
  name: string;
  type: 'text' | 'number' | 'date' | 'dropdown';
  entity_type: 'project' | 'task' | 'user';
  options?: any; // Adjust type based on actual options structure
  organization_id?: string; // Handled by backend, optional in frontend model
  created_at?: string;
  updated_at?: string;
}

export interface CustomFieldValue {
  id?: string; // Optional for creation
  field_id: string;
  entity_id: string;
  value?: string; // Value stored as string, parsing needed based on field type
  field?: CustomFieldDefinition; // Optional: can be included when fetching values
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomizationService {
  private apiUrl = 'http://localhost:3000/customization'; // Adjust if your API has a different base URL

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService
  ) {}

  // Custom Field Definitions
  createFieldDefinition(
    fieldDefinition: CustomFieldDefinition
  ): Observable<CustomFieldDefinition> {
    return this.http
      .post<CustomFieldDefinition>(`${this.apiUrl}/fields`, fieldDefinition)
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            'Failed to create custom field definition.'
          );
          console.error('Error creating custom field definition:', error);
          return throwError(
            () => new Error('Failed to create custom field definition.')
          );
        })
      );
  }

  getFieldDefinitions(
    entityType?: 'project' | 'task' | 'user'
  ): Observable<CustomFieldDefinition[]> {
    const params: any = {};
    if (entityType) {
      params.entityType = entityType;
    }
    return this.http
      .get<CustomFieldDefinition[]>(`${this.apiUrl}/fields`, {
        params,
      })
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            'Failed to fetch custom field definitions.'
          );
          console.error('Error fetching custom field definitions:', error);
          return throwError(
            () => new Error('Failed to fetch custom field definitions.')
          );
        })
      );
  }

  getFieldDefinition(id: string): Observable<CustomFieldDefinition> {
    return this.http
      .get<CustomFieldDefinition>(`${this.apiUrl}/fields/${id}`)
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            `Failed to fetch custom field definition with ID ${id}.`
          );
          console.error(
            `Error fetching custom field definition with ID ${id}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                `Failed to fetch custom field definition with ID ${id}.`
              )
          );
        })
      );
  }

  updateFieldDefinition(
    id: string,
    updateData: Partial<CustomFieldDefinition>
  ): Observable<CustomFieldDefinition> {
    return this.http
      .patch<CustomFieldDefinition>(`${this.apiUrl}/fields/${id}`, updateData)
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            `Failed to update custom field definition with ID ${id}.`
          );
          console.error(
            `Error updating custom field definition with ID ${id}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                `Failed to update custom field definition with ID ${id}.`
              )
          );
        })
      );
  }

  deleteFieldDefinition(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/fields/${id}`).pipe(
      tap(() => {}), // No specific success action needed for tap here
      catchError((error) => {
        this.snackbarService.showError(
          `Failed to delete custom field definition with ID ${id}.`
        );
        console.error(
          `Error deleting custom field definition with ID ${id}:`,
          error
        );
        return throwError(
          () =>
            new Error(`Failed to delete custom field definition with ID ${id}.`)
        );
      })
    );
  }

  // Custom Field Values
  getFieldValuesForEntity(
    entityType: 'project' | 'task' | 'user',
    entityId: string
  ): Observable<CustomFieldValue[]> {
    return this.http
      .get<CustomFieldValue[]>(
        `${this.apiUrl}/entities/${entityType}/${entityId}/fields`
      )
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            `Failed to fetch custom field values for ${entityType} with ID ${entityId}.`
          );
          console.error(
            `Error fetching custom field values for ${entityType} with ID ${entityId}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                `Failed to fetch custom field values for ${entityType} with ID ${entityId}.`
              )
          );
        })
      );
  }

  createFieldValue(fieldValue: CustomFieldValue): Observable<CustomFieldValue> {
    return this.http
      .post<CustomFieldValue>(`${this.apiUrl}/values`, fieldValue)
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            'Failed to create custom field value.'
          );
          console.error('Error creating custom field value:', error);
          return throwError(
            () => new Error('Failed to create custom field value.')
          );
        })
      );
  }

  updateFieldValue(
    id: string,
    updateData: Partial<CustomFieldValue>
  ): Observable<CustomFieldValue> {
    return this.http
      .patch<CustomFieldValue>(`${this.apiUrl}/values/${id}`, updateData)
      .pipe(
        tap(() => {}), // No specific success action needed for tap here
        catchError((error) => {
          this.snackbarService.showError(
            `Failed to update custom field value with ID ${id}.`
          );
          console.error(
            `Error updating custom field value with ID ${id}:`,
            error
          );
          return throwError(
            () =>
              new Error(`Failed to update custom field value with ID ${id}.`)
          );
        })
      );
  }

  deleteFieldValue(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/values/${id}`).pipe(
      tap(() => {}), // No specific success action needed for tap here
      catchError((error) => {
        this.snackbarService.showError(
          `Failed to delete custom field value with ID ${id}.`
        );
        console.error(
          `Error deleting custom field value with ID ${id}:`,
          error
        );
        return throwError(
          () => new Error(`Failed to delete custom field value with ID ${id}.`)
        );
      })
    );
  }
}
