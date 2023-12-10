import {
  AssistanceReportViewComponent,
  StudentRegistration
} from "./assistance-report-view.component";
import { TestBed } from "@angular/core/testing";

const registrations: StudentRegistration[] = [
  {
    name: "FELIPE SANCHEZ SOBERANIS",
    enrollmentId: "18214854",
    startingSemester: "",
    career: "",
    email: "",
    phoneNumber: "",
    registrationTime: "2000-01-01T09:00:00-06:00"
  },
  {
    name: "FELIPE SANCHEZ SOBERANIS",
    enrollmentId: "18214854",
    startingSemester: "",
    career: "",
    email: "",
    phoneNumber: "",
    registrationTime: "2000-01-08T09:00:00-06:00"
  }
];

describe("AssistanceReportViewComponent", () => {
  let comp: AssistanceReportViewComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssistanceReportViewComponent]
    });
    comp = TestBed.createComponent(AssistanceReportViewComponent).componentInstance;
  });

  it("", () => {
    expect(comp.getStudentsFromRegistrations(registrations)).toEqual([
      {
        name: "FELIPE SANCHEZ SOBERANIS",
        enrollmentId: "18214854",
        startingSemester: "",
        career: "",
        email: "",
        phoneNumber: "",
      }
    ]);
  });
});
