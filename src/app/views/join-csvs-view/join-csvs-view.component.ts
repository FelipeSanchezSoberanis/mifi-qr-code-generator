import { Component } from "@angular/core";

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

    const fileContents: string[] = [];

    let i = 0;
    for (let file of files) {
      const content = await file.text();
      const lines = content.split(/\r?\n/);
      if (i === 0) fileContents.push(lines[0] + "\n");
      fileContents.push(lines.slice(1, lines.length).join("\n"));
      i++;
    }

    const newFile = new Blob(fileContents, { type: "text/csv" });
    this.downloadString = URL.createObjectURL(newFile);
  }
}
