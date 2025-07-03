import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly BASE_URL = 'http://localhost:5000/api/users';
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  constructor(private http: HttpClient) {}

  //  Register User
  register(formData: FormData): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, formData);
  }

  //  Login User
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, credentials);
  }

  //  Store JWT Token
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  //  Store User Object
  setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): any | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  //  Logout
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  //  Check if Logged In
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Get Role
  getRole(): string | null {
    return this.getUser()?.role || null;
  }

  // Get Current User Profile
  getProfile(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });
    return this.http.get(`${this.BASE_URL}/me`, { headers });
  }

  //  Update Logged-in User Profile
  updateProfile(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });
    return this.http.put(`${this.BASE_URL}/me`, formData, { headers });
  }


  //  Get all users (Admin)
getAllUsers(): Observable<any[]> {
  return this.http.get<any[]>(this.BASE_URL, {
    headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken()}` })
  });
}

//  Admin Update any user
updateUserById(id: string, formData: FormData): Observable<any> {
  return this.http.put(`${this.BASE_URL}/${id}`, formData, {
    headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken()}` })
  });
}

//  Delete user
deleteUserById(id: string): Observable<any> {
  return this.http.delete(`${this.BASE_URL}/${id}`, {
    headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken()}` })
  });
}

}
