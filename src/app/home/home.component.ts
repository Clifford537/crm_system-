import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ Import this
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { HaederComponent } from '../components/haeder/haeder.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    RouterModule, 
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    HaederComponent

  ]
})
export class HomeComponent {
  constructor(private router: Router) {}

  currentYear = new Date().getFullYear();
}
