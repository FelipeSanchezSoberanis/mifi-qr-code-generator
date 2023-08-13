import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

interface QrCodeData {
  name: string;
  enrollmentId: number | null;
  startingSemester: string;
  career: string;
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
    startingSemester: ["", Validators.required],
    career: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    phoneNumber: [null, [Validators.min(1111111111), Validators.max(9999999999)]]
  });

  handleGenerateQrCodeClick() {
    console.log(this.qrCodeDataForm.value as QrCodeData);
  }
}
