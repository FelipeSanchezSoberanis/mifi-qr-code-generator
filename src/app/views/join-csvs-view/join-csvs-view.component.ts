import { Component } from "@angular/core";
import * as Papa from "papaparse";

@Component({
  selector: "app-join-csvs-view",
  templateUrl: "./join-csvs-view.component.html",
  styleUrls: ["./join-csvs-view.component.scss"]
})
export class JoinCsvsViewComponent {
  downloadString: string | null = null;

  async handleUploadedFilesChanged(event: Event) {
    if (!event || !event.target) return;

    const fileList = (event.target as HTMLInputElement).files;

    if (!fileList) return;

    const files = Array.from(fileList);

    if (!files.length) return;

    const csvContents: any[] = [];
    for (let file of files) {
      Papa.parse(await file.text(), { header: true }).data.forEach((content) => {
        csvContents.push(content);
      });
    }

    const newFile = new Blob([Papa.unparse(csvContents)], { type: "text/csv" });
    this.downloadString = URL.createObjectURL(newFile);
  }
}
