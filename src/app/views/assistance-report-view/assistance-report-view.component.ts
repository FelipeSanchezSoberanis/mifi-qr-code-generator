import { Component, inject } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { DateTime } from "luxon";
import { QrCodeData } from "../generate-qr-code-view/generate-qr-code-view.component";

export type StudentRegistration = QrCodeData & { registrationTime: string };
export type AssistanceRecord = { [key: string]: boolean };
export type AssistanceReport = { [key: string]: AssistanceRecord };

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

  generateAssistanceReport = (
    sessions: DateTime[],
    registrations: StudentRegistration[]
  ): AssistanceReport => {
    const enrollmentIds = this.getStudentsEnrollmentIdsFromRegistrations(registrations);

    const registrationsData = registrations.map((r) => ({
      ...r,
      registrationTime: DateTime.fromISO(r.registrationTime)
    }));

    const assistanceReport: AssistanceReport = {};

    enrollmentIds.forEach((id) => {
      assistanceReport[id] = {};
      sessions.forEach((s) => {
        const studentAssistanceToSession = registrationsData.find(
          (r) => r.enrollmentId === id && r.registrationTime.hasSame(s, "day")
        );
        studentAssistanceToSession;
        assistanceReport[id][s.toISODate()!] = studentAssistanceToSession !== undefined;
      });
    });

    return assistanceReport;
  };

  getStudentsEnrollmentIdsFromRegistrations = (registrations: StudentRegistration[]): string[] => {
    const enrollmentIds = Array.from(new Set(registrations.map((r) => r.enrollmentId)));
    enrollmentIds.sort();
    return enrollmentIds;
  };
}
