import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GenerateQrCodeViewComponent } from "./views/generate-qr-code-view/generate-qr-code-view.component";
import { JoinCsvsViewComponent } from "./views/join-csvs-view/join-csvs-view.component";
import { HomeViewComponent } from "./views/home-view/home-view.component";
import { AssistanceReportViewComponent } from "./views/assistance-report-view/assistance-report-view.component";

const routes: Routes = [
  { path: "", component: HomeViewComponent },
  { path: "generate-qr-code", component: GenerateQrCodeViewComponent },
  { path: "join-csvs", component: JoinCsvsViewComponent },
  { path: "assistance-report", component: AssistanceReportViewComponent },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
