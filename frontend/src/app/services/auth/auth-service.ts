import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { TokenService } from './token-service';
import { environment } from '../../../envs/env'
import {Observable, tap} from 'rxjs';

interface TokenRes {
  access: string;
  refresh: string;
}

interface RegisterData {
  username : string;
  email : string;
  password : string;
  password2 : string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenRes = inject(TokenService);

  private apiUrl = environment.apiUrl;

  login (username : string, password : string) : Observable<TokenRes> {
    return this.http.post<TokenRes>(`${this.apiUrl}/token/`, {
      username,
      password,
    }).pipe(
      tap((tokens) => {
        this.tokenRes.saveTokenKeys(tokens.access, tokens.refresh)
      })
    )
  }

  register (data : RegisterData) : Observable<RegisterData> {
    return this.http.post<RegisterData>(`${this.apiUrl}/register/`, data);
  }

  logout () : void {
    this.tokenRes.clearTokens();
  }

  isLoggedIn() : boolean {
    return !!this.tokenRes.getAccessTokenKey();
  }

  refreshToken () : Observable<TokenRes> {
    const refresh = this.tokenRes.getRefreshTokenKey();

    return this.http.post<TokenRes>(`${this.apiUrl}/refresh`, {
      refresh
    }).pipe(
      tap(tokens => {
        this.tokenRes.saveAccessTokenKey(tokens.access)
      })
    )
  }
}
