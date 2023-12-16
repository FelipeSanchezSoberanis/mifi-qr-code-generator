import { Component, inject } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { DateTime } from "luxon";
import { QrCodeData } from "../generate-qr-code-view/generate-qr-code-view.component";
import { ActivatedRoute, Router } from "@angular/router";
import { filter } from "rxjs";

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
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  sessions = this.formBuilder.array([]);

  addSession = () => {
    const sessions = this.sessions.value as string[];
    sessions.push("");
    this.router.navigate(["."], {
      queryParams: { sessions: JSON.stringify(sessions) },
      relativeTo: this.activatedRoute
    });
  };

  deleteSession = (i: number) => {
    const sessions = this.sessions.value as string[];
    sessions.splice(i, 1);
    this.router.navigate(["."], {
      queryParams: { sessions: JSON.stringify(sessions) },
      relativeTo: this.activatedRoute
    });
  };

  handleSessionChanged = () => {
    this.router.navigate(["."], {
      queryParams: { sessions: JSON.stringify(this.sessions.value) },
      relativeTo: this.activatedRoute
    });
  };

  constructor() {
    this.activatedRoute.queryParams
      .pipe(
        filter((queryParams): queryParams is { sessions: string } => {
          return queryParams["sessions"] !== undefined;
        })
      )
      .subscribe((queryParams) => {
        const sessions = JSON.parse(queryParams.sessions) as string[];
        this.sessions.clear();
        sessions.forEach((s) => this.sessions.push(new FormControl(s, [Validators.required])));
        this.sessions.updateValueAndValidity();
      });
  }

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
