import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GenerateQrCodeViewComponent } from "./views/generate-qr-code-view/generate-qr-code-view.component";
import { JoinCsvsViewComponent } from "./views/join-csvs-view/join-csvs-view.component";

const routes: Routes = [
  {
    path: "generate-qr-code",
    component: GenerateQrCodeViewComponent
  },
  {
    path: "join-csvs",
    component: JoinCsvsViewComponent
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
