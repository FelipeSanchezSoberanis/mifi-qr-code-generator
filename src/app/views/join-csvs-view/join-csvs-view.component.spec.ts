import { ComponentFixture, TestBed } from "@angular/core/testing";

import { JoinCsvsViewComponent } from "./join-csvs-view.component";

describe("JoinCsvsViewComponent", () => {
  let component: JoinCsvsViewComponent;
  let fixture: ComponentFixture<JoinCsvsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoinCsvsViewComponent]
    });
    fixture = TestBed.createComponent(JoinCsvsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
