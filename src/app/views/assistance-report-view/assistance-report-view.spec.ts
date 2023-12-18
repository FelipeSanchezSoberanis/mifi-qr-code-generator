import { DateTime } from "luxon";
import {
  AssistanceReportViewComponent,
  StudentRegistration
} from "./assistance-report-view.component";
import { TestBed } from "@angular/core/testing";

const registrations: StudentRegistration[] = [
  {
    name: "STUDENT_1",
    enrollmentId: "ID_1",
    startingSemester: "SEMESTER_1",
    career: "CAREER_1",
    email: "EMAIL_1",
    phoneNumber: "PHONE_NUMBER_1",
    registrationTime: "2000-01-01"
  },
  {
    name: "STUDENT_2",
    enrollmentId: "ID_2",
    startingSemester: "SEMESTER_2",
    career: "CAREER_2",
    email: "EMAIL_2",
    phoneNumber: "PHONE_NUMBER_2",
    registrationTime: "2000-01-01"
  },
  {
    name: "STUDENT_3",
    enrollmentId: "ID_3",
    startingSemester: "SEMESTER_3",
    career: "CAREER_3",
    email: "EMAIL_3",
    phoneNumber: "PHONE_NUMBER_3",
    registrationTime: "2000-01-01"
  },
  {
    name: "STUDENT_1",
    enrollmentId: "ID_1",
    startingSemester: "SEMESTER_1",
    career: "CAREER_1",
    email: "EMAIL_1",
    phoneNumber: "PHONE_NUMBER_1",
    registrationTime: "2000-01-08"
  },
  {
    name: "STUDENT_2",
    enrollmentId: "ID_2",
    startingSemester: "SEMESTER_2",
    career: "CAREER_2",
    email: "EMAIL_2",
    phoneNumber: "PHONE_NUMBER_2",
    registrationTime: "2000-01-08"
  },
  {
    name: "STUDENT_3",
    enrollmentId: "ID_3",
    startingSemester: "SEMESTER_3",
    career: "CAREER_3",
    email: "EMAIL_3",
    phoneNumber: "PHONE_NUMBER_3",
    registrationTime: "2000-02-08"
  },
  {
    name: "STUDENT_3",
    enrollmentId: "ID_3",
    startingSemester: "SEMESTER_3",
    career: "CAREER_3",
    email: "EMAIL_3",
    phoneNumber: "PHONE_NUMBER_3",
    registrationTime: "2001-01-08"
  },
  {
    name: "STUDENT_1",
    enrollmentId: "ID_1",
    startingSemester: "SEMESTER_1",
    career: "CAREER_1",
    email: "EMAIL_1",
    phoneNumber: "PHONE_NUMBER_1",
    registrationTime: "2000-01-15"
  },
  {
    name: "STUDENT_2",
    enrollmentId: "ID_2",
    startingSemester: "SEMESTER_2",
    career: "CAREER_2",
    email: "EMAIL_2",
    phoneNumber: "PHONE_NUMBER_2",
    registrationTime: "2000-02-15"
  },
  {
    name: "STUDENT_3",
    enrollmentId: "ID_3",
    startingSemester: "SEMESTER_3",
    career: "CAREER_3",
    email: "EMAIL_3",
    phoneNumber: "PHONE_NUMBER_3",
    registrationTime: "2001-01-15"
  }
];

const sessions: DateTime[] = [
  DateTime.fromISO("2000-01-01"),
  DateTime.fromISO("2000-01-08"),
  DateTime.fromISO("2000-01-15")
];

describe("AssistanceReportViewComponent", () => {
  let comp: AssistanceReportViewComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssistanceReportViewComponent]
    });
    comp = TestBed.createComponent(AssistanceReportViewComponent).componentInstance;
  });

  it("should get unique enrollment ids ordered in ascending order", () => {
    expect(comp.getStudentsEnrollmentIdsFromRegistrations(registrations)).toEqual([
      "ID_1",
      "ID_2",
      "ID_3"
    ]);
  });

  it("should generate correct assistance report from sessions and registrations", () => {
    expect(comp.generateAssistanceReport(sessions, registrations)).toEqual({
      ID_1: {
        "2000-01-01": true,
        "2000-01-08": true,
        "2000-01-15": true
      },
      ID_2: {
        "2000-01-01": true,
        "2000-01-08": true,
        "2000-01-15": false
      },
      ID_3: {
        "2000-01-01": true,
        "2000-01-08": false,
        "2000-01-15": false
      }
    });
  });
});
