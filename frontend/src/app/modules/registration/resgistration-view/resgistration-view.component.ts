import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-resgistration-view',
  templateUrl: './resgistration-view.component.html',
  styleUrls: ['./resgistration-view.component.css'],
})
export class ResgistrationViewComponent implements OnInit {
  constructor(private _ngxUiLoaderService: NgxUiLoaderService) {}
  ngOnInit(): void {
    // this._ngxUiLoaderService.start();
  }
}
