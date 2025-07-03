import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { HaederComponent } from '../../components/haeder/haeder.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    HaederComponent
  ]
})
export class DashboardComponent implements OnInit {
  user: any;
  editMode = false;
  form!: FormGroup;

  preview: any = {
    passport: '',
    front: '',
    back: ''
  };

  files: { [key: string]: File } = {};

  constructor(private auth: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.auth.getProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.form = this.fb.group({
          firstName: [data.firstName],
          lastName: [data.lastName],
          phoneNumber: [data.phoneNumber]
        });
        // Set previews for existing images
        this.preview.passport = this.imageUrl(data.passport);
        this.preview.front = this.imageUrl(data.idImageFront);
        this.preview.back = this.imageUrl(data.idImageBack);
      },
      error: (err) => {
        console.error('Failed to load profile', err);
      }
    });
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
  }

  onFileChange(event: any, field: 'passport' | 'front' | 'back'): void {
    const file = event.target.files[0];
    if (file) {
      this.files[field] = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.preview[field] = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    const formData = new FormData();

    Object.entries(this.form.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    Object.entries(this.files).forEach(([key, file]) => {
      formData.append(key, file);
    });

    this.auth.updateProfile(formData).subscribe({
      next: (res) => {
        this.user = res;
        this.toggleEdit();
      },
      error: (err) => console.error('Update failed', err)
    });
  }

  imageUrl(fileName: string): string {
    return `http://localhost:5000/uploads/id-images/${fileName}`;
  }
}
