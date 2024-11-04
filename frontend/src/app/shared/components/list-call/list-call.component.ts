import { Component, OnInit } from '@angular/core';
import { CallService } from 'services/api/call/call.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list-call',
  templateUrl: './list-call.component.html',
  styleUrls: ['./list-call.component.css']
})
export class ListCallComponent implements OnInit {
  callsHistory: any[] = [];

  constructor(
    private callService: CallService,
    private ngxLoader: NgxUiLoaderService
  ) {
  }

  ngOnInit(): void {
    this.loadCalls();
    this.callService.callCreated$.subscribe(() => this.reloadCalls());
  }
  reloadCalls() {
    this.loadCalls();
  }
  loadCalls(): void {
    this.ngxLoader.start();
    this.callService.getAllAnnouncements().subscribe({
      next: (data) => {
        this.callsHistory = data.convocatorias; // Access the convocatorias array
        this.callsHistory.sort((a, b) => {
          if (a.status&& !b.status) return -1;
          if (!a.status && b.status) return 1;
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        });
        this.ngxLoader.stop();
      },
      error: () => {
        Swal.fire('Error', 'Failed to load calls history', 'error');
        this.ngxLoader.stop();
      }
    });
  }
  

}
