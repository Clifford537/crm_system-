import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HaederComponent } from '../../components/haeder/haeder.component';

@Component({
  selector: 'app-admindashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    HaederComponent
  ],
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.scss']
})
export class AdmindashboardComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';

  editForm!: FormGroup;
  selectedUser: any;
  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];

  @ViewChild('editModal') editModal!: TemplateRef<any>;
  @ViewChild('viewModal') viewModal!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.auth.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
      },
      error: () => console.error('Failed to fetch users')
    });
  }

  filterUsers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  }

  openEditModal(user: any): void {
    this.selectedUser = { ...user }; // clone to prevent mutation
    this.editForm = this.fb.group({
      firstName: [user.firstName],
      lastName: [user.lastName],
      role: [user.role],
      passport: [null],
      idImageFront: [null],
      idImageBack: [null]
    });

    this.dialog.open(this.editModal, {
      width: '450px',
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '200ms'
    });
  }

  openViewModal(user: any): void {
    this.selectedUser = user;
    this.dialog.open(this.viewModal, {
      width: '500px',
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '200ms'
    });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  onFileChange(event: Event, control: string): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.editForm.get(control)?.setValue(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedUser[control] = reader.result; // show preview in modal
      };
      reader.readAsDataURL(file);
    }
  }

  saveChanges(): void {
    const formData = new FormData();
    const form = this.editForm.value;

    formData.append('firstName', form.firstName);
    formData.append('lastName', form.lastName);
    formData.append('role', form.role);

    if (form.passport) formData.append('passport', form.passport);
    if (form.idImageFront) formData.append('front', form.idImageFront);
    if (form.idImageBack) formData.append('back', form.idImageBack);

    this.auth.updateUserById(this.selectedUser.id, formData).subscribe(() => {
      this.dialog.closeAll();
      this.fetchUsers();
    });
  }

  deleteUser(id: string): void {
    if (confirm('Delete this user?')) {
      this.auth.deleteUserById(id).subscribe(() => this.fetchUsers());
    }
  }

  imageUrl(filenameOrDataUrl: string): string {
    if (!filenameOrDataUrl) return '';
    return filenameOrDataUrl.startsWith('data:')
      ? filenameOrDataUrl
      : `http://localhost:5000/uploads/id-images/${filenameOrDataUrl}`;
  }
}
