import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  // Custom Field Definitions
  createFieldDefinition(
    fieldDefinition: CustomFieldDefinition
  ): Observable<CustomFieldDefinition> {
    return this.http.post<CustomFieldDefinition>(
      `${this.apiUrl}/fields`,
      fieldDefinition
    );
  }

  getFieldDefinitions(
    entityType?: 'project' | 'task' | 'user'
  ): Observable<CustomFieldDefinition[]> {
    const params: any = {};
    if (entityType) {
      params.entityType = entityType;
    }
    return this.http.get<CustomFieldDefinition[]>(`${this.apiUrl}/fields`, {
      params,
    });
  }

  getFieldDefinition(id: string): Observable<CustomFieldDefinition> {
    return this.http.get<CustomFieldDefinition>(`${this.apiUrl}/fields/${id}`);
  }

  updateFieldDefinition(
    id: string,
    updateData: Partial<CustomFieldDefinition>
  ): Observable<CustomFieldDefinition> {
    return this.http.patch<CustomFieldDefinition>(
      `${this.apiUrl}/fields/${id}`,
      updateData
    );
  }

  deleteFieldDefinition(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/fields/${id}`);
  }

  // Custom Field Values
  getFieldValuesForEntity(
    entityType: 'project' | 'task' | 'user',
    entityId: string
  ): Observable<CustomFieldValue[]> {
    return this.http.get<CustomFieldValue[]>(
      `${this.apiUrl}/entities/${entityType}/${entityId}/fields`
    );
  }

  createFieldValue(fieldValue: CustomFieldValue): Observable<CustomFieldValue> {
    return this.http.post<CustomFieldValue>(
      `${this.apiUrl}/values`,
      fieldValue
    );
  }

  updateFieldValue(
    id: string,
    updateData: Partial<CustomFieldValue>
  ): Observable<CustomFieldValue> {
    return this.http.patch<CustomFieldValue>(
      `${this.apiUrl}/values/${id}`,
      updateData
    );
  }

  deleteFieldValue(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/values/${id}`);
  }
}
