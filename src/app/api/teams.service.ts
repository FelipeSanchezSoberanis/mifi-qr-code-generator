import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../environments/environment";
import { Client, calculatePKCECodeChallenge, generateRandomCodeVerifier } from "oauth4webapi";
import { Observable } from "rxjs";

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
  private httpClient = inject(HttpClient);

  private redirectUri = environment.teamsRedirectUri;
  private client: Client = {
    client_id: "7ae052f5-54fa-4323-840e-f39d141c87a6",
    token_endpoint_auth_method: "none"
  };
  private authorizationServerUrl =
    "https://login.microsoftonline.com/2b83ac9e-2448-45df-9319-48d86236a5ea/oauth2/v2.0";

  async getTeamsAuthorizationUrl(): Promise<{ codeVerifier: string; authorizationUrl: URL }> {
    const codeVerifier = generateRandomCodeVerifier();
    const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);
    const codeChallengeMethod = "S256";
    const authorizationUrl = new URL(`${this.authorizationServerUrl}/authorize`);
    authorizationUrl.searchParams.set("client_id", this.client.client_id);
    authorizationUrl.searchParams.set("code_challenge", codeChallenge);
    authorizationUrl.searchParams.set("code_challenge_method", codeChallengeMethod);
    authorizationUrl.searchParams.set("redirect_uri", this.redirectUri);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("scope", "User.Read");
    return { codeVerifier, authorizationUrl };
  }

  getAccessToken(code: string, codeVerifier: string): Observable<AccessTokenRequestResponse> {
    const postData = new HttpParams()
      .set("client_id", "7ae052f5-54fa-4323-840e-f39d141c87a6")
      .set("scope", "User.Read")
      .set("code", code)
      .set("redirect_uri", this.redirectUri)
      .set("grant_type", "authorization_code")
      .set("code_verifier", codeVerifier);

    return this.httpClient.post<AccessTokenRequestResponse>(
      `${this.authorizationServerUrl}/token`,
      postData,
      { headers: { "content-type": "application/x-www-form-urlencoded" } }
    );
  }

  getLoggedInUserInfo(accessToken: string) {
    return this.httpClient.get<TeamsUserInfo>("https://graph.microsoft.com/v1.0/me", {
      headers: { authorization: `Bearer ${accessToken}` }
    });
  }
}
