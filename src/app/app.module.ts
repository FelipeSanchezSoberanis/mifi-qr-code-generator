import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GenerateQrCodeViewComponent } from "./views/generate-qr-code-view/generate-qr-code-view.component";
import { ReactiveFormsModule } from "@angular/forms";
import { FormErrorMessageComponent } from "./components/form-error-message/form-error-message.component";
import { QRCodeModule } from "angularx-qrcode";
import { JoinCsvsViewComponent } from "./views/join-csvs-view/join-csvs-view.component";

@NgModule({
  declarations: [
    AppComponent,
    GenerateQrCodeViewComponent,
    FormErrorMessageComponent,
    JoinCsvsViewComponent
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, QRCodeModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
