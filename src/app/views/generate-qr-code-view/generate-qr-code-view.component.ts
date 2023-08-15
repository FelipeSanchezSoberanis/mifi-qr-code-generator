import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SafeUrl } from "@angular/platform-browser";
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

  handleGenerateQrCodeClick() {
    const qrCodeData = this.qrCodeDataForm.value as QrCodeData;

    Swal.fire({
      icon: "warning",
      title: "Por favor, revisa tu información antes de continuar",
      html: `
        Nombre: ${qrCodeData.name} <br>
        Matrícula: ${qrCodeData.enrollmentId} <br>
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
}
