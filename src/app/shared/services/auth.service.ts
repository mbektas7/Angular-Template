import { Injectable } from "@angular/core";
import { UserLogin } from "../models/UserLogin";
import { HttpHeaders, HttpClient, HttpInterceptor } from "@angular/common/http";
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Router } from "@angular/router";
import { AlertifyService } from "./alertify.service";
import { UserRegister } from "../models/UserRegister";
import { MirapiProgressBarService } from "@mirapi/components/progress-bar/progress-bar.service";
import { environment } from "environments/environment";
import { tap, share, map, catchError, distinctUntilChanged, switchMap, take } from "rxjs/operators";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { SocialUser } from 'angularx-social-login';

import { User } from 'app/shared/models/user';
import { LoginDTO } from '../models/LoginDTO';
import { HttpRequestsService } from './httpRequests.service';
import { LocalStorageService } from './local-storage.service';


let jwtToken: string;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = new BehaviorSubject(null);

  constructor(private http: HttpClient,
    private router : Router,
              private localStorageService: LocalStorageService) { }

  login(user : any): Observable<LoginDTO> {
    return this.http.post<LoginDTO>(`${environment.apiUrl}Token`, user)
      .pipe(
        tap(response => {
          
          this.user$.next(response.user);
          this.setToken('token', response.JwtToken);
          this.setToken('refreshToken', response.RefreshToken);
          this.router.navigateByUrl('/questions');
        })
      );
     
  }
  loginWithModal(user : any): Observable<LoginDTO> {
    return this.http.post<LoginDTO>(`${environment.apiUrl}Token`, user)
      .pipe(
        tap(response => {
          
          this.user$.next(response.user);
          this.setToken('token', response.JwtToken);
          this.setToken('refreshToken', response.RefreshToken);
        })
      );
     
  }
  loginV3(user:SocialUser, captchaResponse) {

    return this.http.post<LoginDTO>(`${environment.apiUrl}Users/socialLoginControl`, user)
    .pipe(
      tap(response => {
        
        this.user$.next(response.user);
        this.setToken('token', response.JwtToken);
        this.setToken('refreshToken', response.RefreshToken);
        this.router.navigateByUrl('/questions');
      })
    );
  }

  logout(): void {
    this.localStorageService.removeItem('token');
    this.localStorageService.removeItem('refreshToken');
    this.user$.next(null);
  }

  register(registerUser: UserRegister) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers = headers.append('Accept', 'application/json');
    return this.http.post(environment.rootPath + 'Users', registerUser, { headers: headers });
  }

  getCurrentUser(): Observable<User> {
    return this.user$.pipe(
      switchMap(user => {
      
        // check if we already have user data
        if (user) {
          return of(user);
        }

        const token = this.localStorageService.getItem('token');
        // if there is token then fetch the current user
        if (token) {
          return this.fetchCurrentUser();
        }

        return of(null);
      })
    );
  }


  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}Token/current-user`)
      .pipe(
        tap(user => {
          this.user$.next(user);
        })
      );
  }

  refreshToken(): Observable<{JwtToken: string; RefreshToken: string}> {
    const refreshToken = this.localStorageService.getItem('refreshToken');

    return this.http.post<{JwtToken: string; RefreshToken: string}>(
      `${environment.apiUrl}Token/refresh-token`,
      {
        refreshToken
      }).pipe(
        tap(response => {

          console.log(response.RefreshToken);
          this.setToken('token', response.JwtToken);
          this.setToken('refreshToken', response.RefreshToken);
        })
    );
  }

   setToken(key: string, token: string): void {
    this.localStorageService.setItem(key, token);
  }
}