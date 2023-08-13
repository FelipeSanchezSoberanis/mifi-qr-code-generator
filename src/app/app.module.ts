import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GenerateQrCodeViewComponent } from "./views/generate-qr-code-view/generate-qr-code-view.component";
import { ReactiveFormsModule } from "@angular/forms";
import { FormErrorMessageComponent } from "./components/form-error-message/form-error-message.component";

@NgModule({
  declarations: [AppComponent, GenerateQrCodeViewComponent, FormErrorMessageComponent],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
