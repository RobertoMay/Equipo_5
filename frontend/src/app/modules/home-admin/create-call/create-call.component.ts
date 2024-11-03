import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
// import { CallService } from '../services/call.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-create-call',
  templateUrl: './create-call.component.html',
  styleUrls: ['./create-call.component.css']
})
export class CreateCallComponent {
  callForm: FormGroup;
  callsHistory: any[] = [];

  constructor(
    private fb: FormBuilder,
    // private callService: CallService,
    private ngxLoader: NgxUiLoaderService
  ) {
    this.callForm = this.fb.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      quota: ['', [Validators.required, Validators.min(1)]]
    });
  }




  createCall(): void {
    if (this.callForm.invalid) {
      Swal.fire('Warning', 'Please fill all required fields correctly', 'warning');
      return;
    }

    const { startDate, endDate } = this.callForm.value;
    if (new Date(startDate) > new Date(endDate)) {
      Swal.fire('Warning', 'Start date cannot be later than end date', 'warning');
      return;
    }

  
    // this.callService.createCall(this.callForm.value).subscribe({
    //   next: () => {
    //     Swal.fire('Success', 'Call created successfully!', 'success');
    //     this.callForm.reset();
    //     this.loadCalls();
    //     this.ngxLoader.stop();
    //   },
    //   error: () => {
    //     Swal.fire('Error', 'Failed to create call', 'error');
    //     this.ngxLoader.stop();
    //   }
    // });
  }
}