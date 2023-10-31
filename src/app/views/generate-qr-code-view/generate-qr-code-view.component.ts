import { HttpClient, HttpParams } from "@angular/common/http";
import { ConditionalExpr } from "@angular/compiler";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SafeUrl } from "@angular/platform-browser";
import { ActivatedRoute, Params, Route, Router } from "@angular/router";
import { concat, concatMap, filter, mergeMap } from "rxjs";
import Swal from "sweetalert2";

interface QrCodeData {
  name: string;
  enrollmentId: number | null;
  startingSemester: string | null;
  career: string | null;
  email: string;
  phoneNumber: number | null;
}

@Component({
  selector: "app-generate-qr-code-view",
  templateUrl: "./generate-qr-code-view.component.html",
  styleUrls: ["./generate-qr-code-view.component.scss"]
})
export class GenerateQrCodeViewComponent implements OnInit {
  qrCodeDataString: string | null = null;
  qrCodeUrl: SafeUrl | null = null;
  authenticatedWithTeams: boolean = false;

  qrCodeDataForm = new FormGroup({
    name: new FormControl<string>("", Validators.required),
    enrollmentId: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(11111111),
      Validators.max(99999999)
    ]),
    startingSemester: new FormControl<string | null>(null, Validators.required),
    career: new FormControl<string | null>(null, Validators.required),
    email: new FormControl<string>("", [Validators.required, Validators.email]),
    phoneNumber: new FormControl<number | null>(null, [
      Validators.min(1111111111),
      Validators.max(9999999999)
    ])
  });

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    route.queryParams
      .pipe(
        filter((params): params is { code: string } => typeof params["code"] === "string"),
        mergeMap(({ code }) => {
          const postData = new HttpParams()
            .set("client_id", "7ae052f5-54fa-4323-840e-f39d141c87a6")
            .set("scope", "User.Read")
            .set("code", code)
            .set("redirect_uri", "http://localhost:4200/generate-qr-code")
            .set("grant_type", "authorization_code")
            .set("code_verifier", localStorage.getItem("codeVerifier")!);

          return httpClient.post<{
            access_token: string;
            expires_in: number;
            ext_expires_in: number;
            refresh_token: string;
            scope: string;
            token_type: string;
          }>(
            "https://login.microsoftonline.com/2b83ac9e-2448-45df-9319-48d86236a5ea/oauth2/v2.0/token",
            postData,
            { headers: { "content-type": "application/x-www-form-urlencoded" } }
          );
        }),
        mergeMap(({ access_token }) =>
          httpClient.get<{
            displayName?: string;
            id?: string;
            mail?: string;
          }>("https://graph.microsoft.com/v1.0/me", {
            headers: { authorization: `Bearer ${access_token}` }
          })
        )
      )
      .subscribe((res) => {
        const enrollmentId = res.mail?.substring(1, 9);

        if (enrollmentId) this.qrCodeDataForm.patchValue({ enrollmentId: Number(enrollmentId) });

        this.qrCodeDataForm.patchValue({
          name: res.displayName,
          email: res.mail
        });

        this.qrCodeDataForm.updateValueAndValidity();

        this.authenticatedWithTeams = true;
        this.router.navigateByUrl("/generate-qr-code");
      });
  }

  ngOnInit(): void {
    this.qrCodeDataForm.controls.startingSemester.valueChanges.subscribe((startingSemester) => {
      if (startingSemester === "Enero 2024") {
        this.qrCodeDataForm.controls.enrollmentId.setValidators([
          Validators.min(11111111),
          Validators.max(99999999)
        ]);
      } else {
        this.qrCodeDataForm.controls.enrollmentId.setValidators([
          Validators.required,
          Validators.min(11111111),
          Validators.max(99999999)
        ]);
      }

      this.qrCodeDataForm.controls.enrollmentId.updateValueAndValidity();
    });
  }

  handleGenerateQrCodeClick() {
    const qrCodeData = this.qrCodeDataForm.value as QrCodeData;

    Swal.fire({
      icon: "warning",
      title: "Por favor, revisa tu información antes de continuar",
      html: `
        Nombre: ${qrCodeData.name} <br>
        Matrícula: ${qrCodeData.enrollmentId ? qrCodeData.enrollmentId : "No indicado"} <br>
        Semestre de inicio: ${qrCodeData.startingSemester} <br>
        Carrera: ${qrCodeData.career} <br>
        Correo: ${qrCodeData.email} <br>
        Teléfono: ${qrCodeData.phoneNumber ? qrCodeData.phoneNumber : "No indicado"} <br>
      `,
      showConfirmButton: true,
      confirmButtonText: "Obtener código QR",
      showDenyButton: true,
      denyButtonText: "Corregir información"
    }).then((result) => {
      if (result.isConfirmed)
        this.qrCodeDataString = `${qrCodeData.name}$${qrCodeData.enrollmentId}$${qrCodeData.startingSemester}$${qrCodeData.email}$${qrCodeData.phoneNumber}`;
    });
  }

  handleQrCodeUrlChange(url: SafeUrl) {
    this.qrCodeUrl = url;
  }

  enrollmentIdIsRequired(): boolean {
    return this.qrCodeDataForm.controls.enrollmentId.hasValidator(Validators.required);
  }

  async getMicrosoftTeamsLoginPage() {
    const codeVerifier = this.getRandomString({ length: 128 });
    localStorage.setItem("codeVerifier", codeVerifier);

    window.location.href = `https://login.microsoftonline.com/2b83ac9e-2448-45df-9319-48d86236a5ea/oauth2/v2.0/authorize?${new URLSearchParams(
      {
        client_id: "7ae052f5-54fa-4323-840e-f39d141c87a6",
        response_type: "code",
        redirect_uri: "http://localhost:4200/generate-qr-code",
        response_mode: "query",
        scope: "User.Read",
        state: "12345",
        code_challenge: await this.getCodeChallenge({ codeVerifier }),
        code_challenge_method: "S256"
      }
    )}`;
  }

  getRandomString({ length }: { length: number }) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async getCodeChallenge({ codeVerifier }: { codeVerifier: string }) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }
}
