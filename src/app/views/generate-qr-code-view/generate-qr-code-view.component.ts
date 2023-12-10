import { Component, inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { SafeUrl } from "@angular/platform-browser";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { filter, mergeMap } from "rxjs";
import { TeamsService, TeamsUserInfo } from "src/app/api/teams.service";
import Swal from "sweetalert2";

export type QrCodeData = {
  name: string;
  enrollmentId: string;
  startingSemester: string;
  career: string;
  email: string;
  phoneNumber: string;
};

@Component({
  selector: "app-generate-qr-code-view",
  templateUrl: "./generate-qr-code-view.component.html",
  styleUrls: ["./generate-qr-code-view.component.scss"]
})
export class GenerateQrCodeViewComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private teamsService = inject(TeamsService);
  private formBuilder = inject(FormBuilder);

  qrCodeDataString: string | null = null;
  qrCodeUrl: SafeUrl | null = null;
  authenticatedWithTeams: boolean = false;
  readOnlyFields = { name: false, email: false, enrollmentId: false };

  qrCodeDataForm = this.formBuilder.group({
    name: ["", Validators.required],
    enrollmentId: ["", [Validators.required, Validators.pattern(/\d{8}/)]],
    startingSemester: ["", Validators.required],
    career: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    phoneNumber: ["", [Validators.pattern(/\d{10}/)]]
  });

  constructor() {
    const codeIsInParams = (params: Params): params is { code: string } =>
      typeof params["code"] === "string";

    this.route.queryParams
      .pipe(
        filter(codeIsInParams),
        mergeMap(this.getTeamsAccessToken),
        mergeMap(({ access_token: accessToken }) =>
          this.teamsService.getLoggedInUserInfo(accessToken)
        )
      )
      .subscribe({
        next: this.handleInfoFromTeamsObtained,
        error: this.handleErrorFetchingTeamsInfo
      });
  }

  private handleInfoFromTeamsObtained = (teamsInfo: TeamsUserInfo) => {
    this.setFormDataFromTeamsInfo(teamsInfo);
    this.handleInfoFromTeamsSet();
  };

  private handleErrorFetchingTeamsInfo = async (error: any) => {
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
  };

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

  private getTeamsAccessToken = ({ code }: { code: string }) => {
    Swal.fire({
      title: "Obteniendo datos de Teams",
      didOpen: () => Swal.showLoading(),
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false
    });

    return this.teamsService.getAccessToken(code, localStorage.getItem("codeVerifier")!);
  };

  private isInstitutionalEmail(email: string): boolean {
    return /^a\d{8}@alumnos\.uady\.mx$/i.test(email);
  }

  setFormDataFromTeamsInfo({ displayName, mail }: TeamsUserInfo) {
    if (mail) {
      this.qrCodeDataForm.patchValue({ email: mail.trim() });
      this.readOnlyFields.email = true;

      if (this.isInstitutionalEmail(mail)) {
        const enrollmentId = mail.substring(1, 9);
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
    const qrCodeDataKeys = Object.keys(qrCodeData) as (keyof QrCodeData)[];
    const qrCodeDataValuesOrderedByKeys = qrCodeDataKeys
      .sort()
      .map((key) => qrCodeData[key] as string);

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
      if (result.isConfirmed) this.qrCodeDataString = JSON.stringify(qrCodeDataValuesOrderedByKeys);
    });
  }

  handleQrCodeUrlChange(url: SafeUrl) {
    this.qrCodeUrl = url;
  }

  enrollmentIdIsRequired(): boolean {
    return this.qrCodeDataForm.controls.enrollmentId.hasValidator(Validators.required);
  }

  async getMicrosoftTeamsLoginPage() {
    const { codeVerifier, authorizationUrl } = await this.teamsService.getTeamsAuthorizationUrl();
    localStorage.setItem("codeVerifier", codeVerifier);
    window.location.href = authorizationUrl.toString();
  }

  getStartingSemesters = (date?: Date): string[] => {
    const now = date || new Date();

    if (now.getMonth() <= 5) {
      return [`Agosto ${now.getFullYear() - 1}`, `Enero ${now.getFullYear()}`];
    } else {
      return [`Agosto ${now.getFullYear()}`, `Enero ${now.getFullYear() + 1}`];
    }
  };
}
