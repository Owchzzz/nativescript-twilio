import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import * as platformModule from "tns-core-modules/platform";
import { DataService } from "../../providers/data.service";

@Component({
  selector: "ns-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  moduleId: module.id
})
export class HomeComponent implements OnInit {

    constructor(
        private dataService: DataService
    ) {
        
    }
    ngOnInit(): void {

    }
}