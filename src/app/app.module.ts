import { NgModule } from "@angular/core";
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

@NgModule({
  declarations: [
    AppComponent,
    GenerateQrCodeViewComponent,
    FormErrorMessageComponent,
    JoinCsvsViewComponent,
    HomeViewComponent,
    NavbarComponent
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, QRCodeModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
