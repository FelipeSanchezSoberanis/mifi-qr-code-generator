import { inject, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GenerateQrCodeViewComponent } from "./views/generate-qr-code-view/generate-qr-code-view.component";
import { ReactiveFormsModule } from "@angular/forms";
import { FormErrorMessageComponent } from "./components/form-error-message/form-error-message.component";
import { QRCodeModule } from "angularx-qrcode";
import { JoinCsvsViewComponent } from "./views/join-csvs-view/join-csvs-view.component";
import { HomeViewComponent } from "./views/home-view/home-view.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { AssistanceReportViewComponent } from "./views/assistance-report-view/assistance-report-view.component";
import { EventType, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

@NgModule({
  declarations: [
    AppComponent,
    GenerateQrCodeViewComponent,
    FormErrorMessageComponent,
    JoinCsvsViewComponent,
    HomeViewComponent,
    NavbarComponent,
    AssistanceReportViewComponent
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, QRCodeModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  private router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e.type === EventType.NavigationEnd))
      .subscribe((e) => window.dataLayer.push({ event: "navigation", to: e.url }));
  }
}
