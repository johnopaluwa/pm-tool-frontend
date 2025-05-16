import { Pipe, PipeTransform } from '@angular/core';
import { CustomFieldDefinition } from '../services/customization.service';

@Pipe({
  name: 'filterByEntityType',
  standalone: true,
})
export class FilterByEntityTypePipe implements PipeTransform {
  transform(
    fields: CustomFieldDefinition[] | null | undefined,
    entityType: string
  ): CustomFieldDefinition[] {
    if (!fields || !entityType) {
      return [];
    }
    return fields.filter((field) => field.entity_type === entityType);
  }
}
