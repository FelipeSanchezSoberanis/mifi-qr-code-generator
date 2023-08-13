import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
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
  constructor(private formBuilder: FormBuilder) {}

  qrCodeDataForm = this.formBuilder.group({
    name: ["", Validators.required],
    enrollmentId: [null, [Validators.required, Validators.min(11111111), Validators.max(99999999)]],
    startingSemester: [null, Validators.required],
    career: [null, Validators.required],
    email: ["", [Validators.required, Validators.email]],
    phoneNumber: [null, [Validators.min(1111111111), Validators.max(9999999999)]]
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
    });
  }
}
