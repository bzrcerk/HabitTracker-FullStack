import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private accessTokenKey : string = 'access';
  private refreshTokenKey : string = 'refresh';

  saveTokenKeys (access : string, refresh : string) : void {
    localStorage.setItem(this.accessTokenKey, access);
    localStorage.setItem(this.refreshTokenKey, refresh);
  }

  saveAccessTokenKey (access : string) : void {
    localStorage.setItem(this.accessTokenKey, access);
  }

  getAccessTokenKey () : string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshTokenKey () : string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  clearTokens () : void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  hasToken() : boolean {
    return !!this.getAccessTokenKey();
  }
}
