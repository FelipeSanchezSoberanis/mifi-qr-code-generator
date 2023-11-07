import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SafeUrl } from "@angular/platform-browser";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { concatMap, filter, mergeMap } from "rxjs";
import { TeamsService, TeamsUserInfo } from "src/app/api/teams.service";
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
export class GenerateQrCodeViewComponent {
  qrCodeDataString: string | null = null;
  qrCodeUrl: SafeUrl | null = null;
  authenticatedWithTeams: boolean = false;
  readOnlyFields = { name: false, email: false, enrollmentId: false };

  qrCodeDataForm = new FormGroup({
    name: new FormControl<string>("", Validators.required),
    enrollmentId: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
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

  constructor(private router: Router, route: ActivatedRoute, private teamsService: TeamsService) {
    const codeIsInParams = (params: Params): params is { code: string } =>
      typeof params["code"] === "string";

    route.queryParams
      .pipe(
        filter(codeIsInParams),
        mergeMap(({ code }) => this.getTeamsAccessToken(code)),
        mergeMap(({ access_token }) => teamsService.getLoggedInUserInfo(access_token))
      )
      .subscribe({
        next: (teamsInfo) => this.handleInfoFromTeamsObtained(teamsInfo),
        error: (error) => this.handleErrorFetchingTeamsInfo(error)
      });
  }

  private handleInfoFromTeamsObtained(teamsInfo: TeamsUserInfo) {
    this.setFormDataFromTeamsInfo(teamsInfo);
    this.handleInfoFromTeamsSet();
  }

  private async handleErrorFetchingTeamsInfo(error: any) {
    const res = await Swal.fire({
      title: "Error obteniendo datos de Teams",
      text: JSON.stringify(error),
      icon: "error",
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: true
    });

    if (!res.isConfirmed) return;

    this.qrCodeDataForm.updateValueAndValidity();
    this.authenticatedWithTeams = true;
    this.router.navigateByUrl("/generate-qr-code");
  }

  private async handleInfoFromTeamsSet() {
    const res = await Swal.fire({
      title: "Datos obtenidos de Teams",
      icon: "success",
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: true
    });

    if (!res.isConfirmed) return;

    this.qrCodeDataForm.updateValueAndValidity();
    this.authenticatedWithTeams = true;
    this.router.navigateByUrl("/generate-qr-code");
  }

  private getTeamsAccessToken(code: string) {
    Swal.fire({
      title: "Obteniendo datos de Teams",
      didOpen: () => Swal.showLoading(),
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false
    });

    return this.teamsService.getAccessToken(code, localStorage.getItem("codeVerifier")!);
  }

  private isInstitutionalEmail(email: string): boolean {
    return /^a\d{8}@alumnos\.uady\.mx$/i.test(email);
  }

  setFormDataFromTeamsInfo({ displayName, mail }: TeamsUserInfo) {
    if (mail) {
      this.qrCodeDataForm.patchValue({ email: mail.trim() });
      this.readOnlyFields.email = true;

      if (this.isInstitutionalEmail(mail)) {
        const enrollmentId = Number(mail.substring(1, 9));
        this.qrCodeDataForm.patchValue({ enrollmentId });
        this.readOnlyFields.enrollmentId = true;
      }
    }

    if (displayName) {
      this.qrCodeDataForm.patchValue({ name: displayName.trim().toUpperCase() });
      this.readOnlyFields.name = true;
    }
  }

  handleGenerateQrCodeClick() {
    const qrCodeData = this.qrCodeDataForm.value as QrCodeData;

    Swal.fire({
      icon: "warning",
      title: "Por favor, revisa tu información antes de continuar",
      html: `
        Nombre: ${qrCodeData.name} <br>
        Matrícula: ${qrCodeData.enrollmentId || "No indicado"} <br>
        Semestre de inicio: ${qrCodeData.startingSemester} <br>
        Carrera: ${qrCodeData.career} <br>
        Correo: ${qrCodeData.email} <br>
        Teléfono: ${qrCodeData.phoneNumber || "No indicado"} <br>
      `,
      showConfirmButton: true,
      confirmButtonText: "Obtener código QR",
      showDenyButton: true,
      denyButtonText: "Corregir información"
    }).then((result) => {
      if (result.isConfirmed) this.qrCodeDataString = JSON.stringify(qrCodeData);
    });
  }

  handleQrCodeUrlChange(url: SafeUrl) {
    this.qrCodeUrl = url;
  }

  enrollmentIdIsRequired(): boolean {
    return this.qrCodeDataForm.controls.enrollmentId.hasValidator(Validators.required);
  }

  async getMicrosoftTeamsLoginPage() {
    const { codeVerifier, loginUrl } = await this.teamsService.getTeamsLoginPage();
    localStorage.setItem("codeVerifier", codeVerifier);
    window.location.href = loginUrl;
  }
}
