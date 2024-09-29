import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RegistrationService } from 'services/api/registration/registration.service';
import { IRegistration } from './iregistration-form.metadata';
import { LoadingService } from 'services/global/loading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registration-form, [app-registration-form]',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css'],
})
export class RegistrationFormComponent implements OnInit {
  public submitted = false;
  form: FormGroup | any;
  private student!: IRegistration;

  constructor(
    private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
    private loadingService: LoadingService,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.setForm();
  }

  get fm() {
    return this.form.controls;
  }

  setForm() {
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

  sendData() {
    this.submitted = true;
    if (!this.form.valid) {
      return;
    }

    this.loadingService.startLoading();

    this.student = {
      nombresCompletos: this.form.get('fullNames').value,
      apellidoPaterno: this.form.get('firstLastName').value,
      apellidoMaterno: this.form.get('secondLastName').value,
      curp: this.form.get('curp').value,
      correo: this.form.get('email').value,
    };

    this.registrationService.addStudent(this.student).subscribe(
      (r) => {
        if (!r.error) {
          this.loadingService.stopLoading();
          setTimeout(() => {
            Swal.fire({
              title: 'Se ha registrado correctamente',
              text: 'Ve a la sección Login para iniciar sesión con Correo y Curp',
              icon: 'success',
              showConfirmButton: true,
            });
          }, 750);
          this.setForm();
          this.modalService.dismissAll();
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

  toUppercase(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }
}
