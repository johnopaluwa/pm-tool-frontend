import {
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  Injector,
  createComponent,
} from '@angular/core';
import { ConfirmationDialogComponent } from '../components/dialogs/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialogRef: ComponentRef<ConfirmationDialogComponent> | null = null;

  constructor(
    private injector: Injector,
    private environmentInjector: EnvironmentInjector
  ) {}

  openConfirmationDialog(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.dialogRef) {
        this.closeDialog();
      }

      this.dialogRef = createComponent(ConfirmationDialogComponent, {
        environmentInjector: this.environmentInjector,
        elementInjector: this.injector,
      });

      this.dialogRef.instance.message = message;

      this.dialogRef.instance.confirmed.subscribe((result) => {
        this.closeDialog();
        resolve(result);
      });

      document.body.appendChild(this.dialogRef.location.nativeElement);
    });
  }

  private closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.destroy();
      this.dialogRef = null;
    }
  }
}
