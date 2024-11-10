import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CallService } from 'services/api/call/call.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IConvocatoria } from 'models/icalls.metadata';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-call',
  templateUrl: './create-call.component.html',
  styleUrls: ['./create-call.component.css'],
})
export class CreateCallComponent implements OnInit {
  callForm!: FormGroup;
  isAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private callService: CallService,
    private ngxLoader: NgxUiLoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isAdmin =
      localStorage.getItem('esAdministrador') === 'true' ? true : false;

    if (token) {
      if (this.isAdmin) {
        this.callForm = this.fb.group(
          {
            title: ['', Validators.required],
            cupo: ['', [Validators.required, Validators.min(1)]],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
          },
          { validators: this.dateRangeValidator }
        );
      } else {
        this.logout();
      }
    } else {
      this.logout();
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('esAdministrador');
    this.isAdmin = false;
    this.router.navigate(['/']);
  }

  // Validador personalizado para verificar que startDate no sea mayor a endDate
  dateRangeValidator(formGroup: FormGroup) {
    const startDate = formGroup.get('startDate')?.value;
    const endDate = formGroup.get('endDate')?.value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  createCall(): void {
    if (this.callForm.invalid) {
      Swal.fire(
        'Warning',
        'Please fill all required fields correctly',
        'warning'
      );
      return;
    }
  
    const { startDate, endDate } = this.callForm.value;
  
    const dataToSend: IConvocatoria = {
      id: '',
      status: true,
      title: this.callForm.value.title,
      cupo: this.callForm.value.cupo,
      startDate: startDate,
      endDate: endDate,
    };
  
    if (new Date(startDate) > new Date(endDate)) {
      Swal.fire(
        'Warning',
        'Start date cannot be later than end date',
        'warning'
      );
      return;
    }
  
    this.callService.addAnnouncement(dataToSend).subscribe({
      next: (response) => {
        if (response.error) {
          Swal.fire('Error', response.msg, 'error'); // Mostrará el mensaje específico del backend
        } else {
          Swal.fire(
            'Creado correctamente',
            response.msg,
            'success'
          );
          this.callForm.reset();
          this.ngxLoader.stop();
          this.callService.notifyCallCreated();
        }
      },
      error: () => {
        Swal.fire('Error', 'Failed to create call', 'error');
        this.ngxLoader.stop();
      },
    });
  }
  
  
}
