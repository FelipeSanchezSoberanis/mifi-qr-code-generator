import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GenerateQrCodeViewComponent } from "./views/generate-qr-code-view/generate-qr-code-view.component";

const routes: Routes = [
  {
    path: "generate-qr-code",
    component: GenerateQrCodeViewComponent
  },
  {
    path: "**",
    redirectTo: "generate-qr-code"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
