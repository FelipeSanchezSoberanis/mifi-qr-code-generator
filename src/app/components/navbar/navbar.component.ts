import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren
} from "@angular/core";

@Component({
  selector: "navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements AfterViewInit {
  @ViewChild("navButton") navButton!: ElementRef<HTMLButtonElement>;
  @ViewChildren("routerLink") routerLinks!: QueryList<ElementRef<HTMLLinkElement>>;

  ngAfterViewInit(): void {
    this.routerLinks.forEach((routerLink) => {
      routerLink.nativeElement.addEventListener("click", () => {
        if (this.navButton.nativeElement.getAttribute("aria-expanded") === "true")
          this.navButton.nativeElement.click();
      });
    });
  }
}
