import { Injectable } from '@angular/core';
import { ReplaySubject, map, of } from 'rxjs';
import { environment } from 'src/environments/environements';
import { Address, User } from '../shared/models/user';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
/**
 * Service responsible for handling account-related operations.
 */
export class AccountService {
  baseUrl = environment.apiUrl; // The base URL for the API.
  private currentUserSource = new ReplaySubject<User | null>(1); // The current user source.
  currentUser$ = this.currentUserSource.asObservable(); // The current user observable.

  /**
   * Creates an instance of the AccountService.
   * @param http - The HttpClient service used for making HTTP requests.
   * @param router - The Router service used for navigating between routes.
   */
  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Loads the current user.
   * @returns An Observable that emits the current user.
   */
  loadCurrentUser(token: string | null){
    if (token === null) {
      this.currentUserSource.next(null);
      return of(null);
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<User>(this.baseUrl + 'account', {headers}).pipe(
      map((user) => {
        if(user){
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          return user;
        } else {
          return null;
        }
      })
    )
  }

  /**
   * Logs in a user.
   * @param values - The login credentials.
   * @returns An Observable that emits the logged-in user.
   */
  login(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', values).pipe(
      map((user) => {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      })
    );
  }

  /**
   * Registers a new user.
   * @param values - The user registration data.
   * @returns An Observable that emits the registered user.
   */
  register(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', values).pipe(
      map((user) => {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      })
    );
  }

  /**
   * Removes the token from local storage, clears the current user source, and navigates to the home page.
   */
  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  /**
   * Checks if an email exists.
   * @param email - The email to check.
   * @returns A boolean indicating whether the email exists or not.
   */
  checkEmailExists(email: string) {
    return this.http.get<boolean>(this.baseUrl + 'account/emailexists?email=' + email);
  }

  getUserAddress() {
    return this.http.get<Address>(this.baseUrl + 'account/address');
  }

  updateUserAddress(address: Address) {
    return this.http.put(this.baseUrl + 'account/address', address);
  }
}
