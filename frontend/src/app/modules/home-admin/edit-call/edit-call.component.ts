import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CallService } from 'services/api/call/call.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { IConvocatoria } from 'models/icalls.metadata';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoadingService } from 'services/global/loading.service';
import { Router } from '@angular/router';

export function dateRangeValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const startDate = formGroup.get('startDate')?.value;
    const endDate = formGroup.get('endDate')?.value;

    if (!startDate || !endDate) {
      return null;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return { dateRangeInvalid: true };
    }

    return null;
  };
}

@Component({
  selector: 'app-edit-call',
  templateUrl: './edit-call.component.html',
  styleUrls: ['./edit-call.component.css'],
})
export class EditCallComponent implements OnInit {
  form: FormGroup | any;
  convocatoria: IConvocatoria | null = null;
  public submitted = false;
  isAdmin: boolean = false;

  constructor(
    private callService: CallService,
    private formBuilder: FormBuilder,
    private _ngxUiLoaderService: NgxUiLoaderService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  get fm() {
    return this.form.controls;
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isAdmin =
      localStorage.getItem('esAdministrador') === 'true' ? true : false;

    if (token) {
      if (!this.isAdmin) {
        this.logout();
      } else {
        this.loadingService.loading$.subscribe((isLoading) => {
          if (isLoading) {
            this._ngxUiLoaderService.start();
          } else {
            this._ngxUiLoaderService.stop();
          }
        });

        this.loadingService.startLoading();
        this.setForm();
        this.callService.getById('all').subscribe(
          (response) => {
            if (response.error) {
              this.loadingService.stopLoading();
              console.error(
                'Error al obtener las convocatorias:',
                response.msg
              );
              setTimeout(() => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: response.msg,
                });
              }, 750);
            } else {
              const data = response.data;
              if (data) {
                if (Array.isArray(data)) {
                  this.form.patchValue({
                    id: (data[0] as IConvocatoria).id,
                    title: (data[0] as IConvocatoria).title,
                    startDate: (data[0] as IConvocatoria).startDate,
                    endDate: (data[0] as IConvocatoria).endDate,
                    status: (data[0] as IConvocatoria).status,
                  });
                } else {
                  this.form.patchValue({
                    id: (data as IConvocatoria).id,
                    title: (data as IConvocatoria).title,
                    startDate: (data as IConvocatoria).startDate,
                    endDate: (data as IConvocatoria).endDate,
                    status: (data as IConvocatoria).status,
                  });
                }

                this.loadingService.stopLoading();
              } else {
                this.loadingService.stopLoading();
                setTimeout(() => {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Error',
                    text: 'No se encontraron datos',
                  });
                }, 750);
              }
            }
          },
          (error) => {
            console.error('Error al obtener las convocatorias', error);
          }
        );
      }
    } else {
      this.logout();
    }
  }

  setForm() {
    this.form = this.formBuilder.group(
      {
        id: ['', [Validators.required]],
        title: ['', [Validators.required]],
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        status: ['', [Validators.required]],
      },
      {
        validator: dateRangeValidator(),
      }
    );
  }

  updateDate() {
    this.submitted = true;
    if (!this.form.valid) {
      return;
    }

    this.loadingService.startLoading();

    this.callService
      .updateAnnouncement(this.form.get('id').value, this.form.value)
      .subscribe(
        (r) => {
          if (!r.error) {
            this.loadingService.stopLoading();
            setTimeout(() => {
              Swal.fire({
                title: 'Se ha actualizado correctamente',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
              });
            }, 750);
            this.submitted = false;
          } else {
            this.loadingService.stopLoading();
            console.log(r.error + ' ' + r.msg);
            setTimeout(() => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: r.msg,
              });
            }, 750);
          }
        },
        (error) => {
          console.error(error);
          this.loadingService.stopLoading();
        }
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('esAdministrador');
    this.isAdmin = false;
    this.router.navigate(['/']);
  }
}
