import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

type AccessTokenRequestResponse = {
  access_token: string;
  expires_in: number;
  ext_expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};

export type TeamsUserInfo = {
  displayName?: string;
  id?: string;
  mail?: string;
};

@Injectable({
  providedIn: "root"
})
export class TeamsService {
  private redirectUri = "http://localhost:4200/generate-qr-code";

  constructor(private httpClient: HttpClient) {}

  async getTeamsLoginPage(): Promise<{ codeVerifier: string; loginUrl: string }> {
    const codeVerifier = this.getRandomString(128);

    const loginUrl = `https://login.microsoftonline.com/2b83ac9e-2448-45df-9319-48d86236a5ea/oauth2/v2.0/authorize?${new URLSearchParams(
      {
        client_id: "7ae052f5-54fa-4323-840e-f39d141c87a6",
        response_type: "code",
        redirect_uri: this.redirectUri,
        response_mode: "query",
        scope: "User.Read",
        state: "12345",
        code_challenge: await this.getCodeChallenge(codeVerifier),
        code_challenge_method: "S256"
      }
    )}`;

    return { codeVerifier, loginUrl };
  }

  getAccessToken(code: string, codeVerifier: string) {
    const postData = new HttpParams()
      .set("client_id", "7ae052f5-54fa-4323-840e-f39d141c87a6")
      .set("scope", "User.Read")
      .set("code", code)
      .set("redirect_uri", this.redirectUri)
      .set("grant_type", "authorization_code")
      .set("code_verifier", codeVerifier);

    return this.httpClient.post<AccessTokenRequestResponse>(
      "https://login.microsoftonline.com/2b83ac9e-2448-45df-9319-48d86236a5ea/oauth2/v2.0/token",
      postData,
      { headers: { "content-type": "application/x-www-form-urlencoded" } }
    );
  }

  getLoggedInUserInfo(accessToken: string) {
    return this.httpClient.get<TeamsUserInfo>("https://graph.microsoft.com/v1.0/me", {
      headers: { authorization: `Bearer ${accessToken}` }
    });
  }

  private getRandomString(length: number): string {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  private async getCodeChallenge(codeVerifier: string): Promise<string> {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }
}
