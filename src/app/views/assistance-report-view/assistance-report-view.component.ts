import { Component, inject } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { DateTime } from "luxon";
import { QrCodeData } from "../generate-qr-code-view/generate-qr-code-view.component";

export type StudentRegistration = QrCodeData & { registrationTime: string };

@Component({
  selector: "app-assistance-report-view",
  templateUrl: "./assistance-report-view.component.html",
  styleUrls: ["./assistance-report-view.component.scss"]
})
export class AssistanceReportViewComponent {
  private formBuilder = inject(FormBuilder);

  sessions = this.formBuilder.array([]);

  addSession = () => this.sessions.push(new FormControl("", [Validators.required]));

  deleteSession = (i: number) => this.sessions.controls.splice(i, 1);

  generateAssistanceReport = (sessions: DateTime[], registrations: StudentRegistration[]) => {
    return 1;
  };

  getStudentsFromRegistrations = (registrations: StudentRegistration[]): QrCodeData[] => {
    const enrollmentIds = Array.from(new Set(registrations.map((r) => r.enrollmentId)));
    const students = enrollmentIds.map((id) => registrations.find((r) => r.enrollmentId === id)!);
    return students.map((s) => ({ ...s }));
  };
}
