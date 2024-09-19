import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-registration-form, [app-registration-form]',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css'],
})
export class RegistrationFormComponent {
  public submitted = false;
  form: FormGroup | any;

  constructor(
    private formBuilder: FormBuilder,
    private _ngxUiLoaderService: NgxUiLoaderService
  ) {
    this.form = this.formBuilder.group({
      fullNames: ['', [Validators.required]],
      firstLastName: ['', [Validators.required]],
      secondLastName: ['', [Validators.required]],
      curp: [
        '',
        [
          Validators.required,
          Validators.maxLength(18),
          Validators.pattern(
            /^[A-Z]{4}\d{6}[HM]{1}(AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[A-Z]{3}[A-Z\d]{1}\d{1}$/
          ),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
          ),
        ],
      ],
    });
  }

  get fm() {
    return this.form.controls;
  }

  sendData() {
    this.submitted = true;
    if (!this.form.valid) {
      return;
    }
    this._ngxUiLoaderService.start();
    alert('Data send');
    this._ngxUiLoaderService.stop();

    setTimeout(() => {
      Swal.fire({
        title: 'Alarma',
        text: 'Se ha registrado correctamente',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000,
      });
    }, 750);
  }

  toUppercase(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }
}
