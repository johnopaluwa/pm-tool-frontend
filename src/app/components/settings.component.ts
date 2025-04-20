import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <div class="page-placeholder">
      <h2>Settings</h2>
      <p>This is a placeholder for the Settings page.</p>
    </div>
  `,
  styles: [
    `
      .page-placeholder {
        max-width: 700px;
        margin: 60px auto;
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 2px 16px rgba(35, 43, 77, 0.1);
        padding: 36px 32px 28px 32px;
        text-align: center;
      }
      .page-placeholder h2 {
        font-size: 2rem;
        color: #232b4d;
        margin-bottom: 18px;
      }
      .page-placeholder p {
        color: #3949ab;
        font-size: 1.1rem;
      }
    `,
  ],
})
export class SettingsComponent {}
