import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoadingService } from 'services/global/loading.service';

@Component({
  selector: 'app-resgistration-view',
  templateUrl: './resgistration-view.component.html',
  styleUrls: ['./resgistration-view.component.css'],
})
export class ResgistrationViewComponent implements OnInit {
  constructor(
    private _ngxUiLoaderService: NgxUiLoaderService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingService.loading$.subscribe((isLoading) => {
      if (isLoading) {
        this._ngxUiLoaderService.start();
      } else {
        this._ngxUiLoaderService.stop();
      }
    });
  }
}
