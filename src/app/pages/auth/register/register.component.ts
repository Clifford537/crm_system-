import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { HaederComponent } from '../../../components/haeder/haeder.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    HaederComponent
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: FormGroup;

  files: Record<'passport' | 'front' | 'back', File | null> = {
    passport: null,
    front: null,
    back: null
  };

  preview: Record<'passport' | 'front' | 'back', string> = {
    passport: '',
    front: '',
    back: ''
  };

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router // Inject Router
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user']
    });
  }

  onFileChange(event: Event, field: 'passport' | 'front' | 'back') {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.files[field] = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.preview[field] = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    for (const field of ['passport', 'front', 'back'] as const) {
      if (this.files[field]) {
        formData.append(field, this.files[field]!);
      }
    }

    this.auth.register(formData).subscribe({
      next: () => {
        alert('Registered successfully');
        this.router.navigate(['/login']); 
      },
      error: (err) => alert(err.error?.message || 'Registration failed')
    });
  }
}
