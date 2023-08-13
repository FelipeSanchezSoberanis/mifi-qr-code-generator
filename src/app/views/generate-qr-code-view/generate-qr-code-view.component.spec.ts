import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GenerateQrCodeViewComponent } from "./generate-qr-code-view.component";

describe("GenerateQrCodeViewComponent", () => {
  let component: GenerateQrCodeViewComponent;
  let fixture: ComponentFixture<GenerateQrCodeViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateQrCodeViewComponent]
    });
    fixture = TestBed.createComponent(GenerateQrCodeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
