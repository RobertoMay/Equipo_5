import { Component, ElementRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registration-process',
  templateUrl: './registration-process.component.html',
  styleUrls: ['./registration-process.component.css']
})
export class RegistrationProcessComponent {
  currentStep: number = 1;
  progressWidth: string = '50%';
  @ViewChild('formulario', { static: false }) formulario!: ElementRef; 
  formularioVisible = false;
  formData = {
    curp: '',
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    sexo: '',
    telefonoFijo: '',
    telefonoMovil: '',
    correoElectronico: '',
    puebloIndigena: '',
    lenguaIndigena: '',
    fechaNacimiento: '',
        // Direccion
    estado: '',
    municipio: '',
    localidad: '',
    comunidad: '',
        // Información de la madre
    estadoMadre: '',
    curpMadre: '',
    nombreMadre: '',
    primerApellidoMadre: '',
    segundoApellidoMadre: '',
    fechaNacimientoMadre: '',
    edoNacimientoMadre:'',
    // Información del padre
    estadoPadre: '',
    curpPadre: '',
    nombrePadre: '',
    primerApellidoPadre: '',
    segundoApellidoPadre: '',
    fechaNacimientoPadre: '',
    edoNacimientoPadre:'',
    // Información del tutor
    parentescoTutor: '',
    curpTutor: '',
    nombreTutor: '',
    primerApellidoTutor: '',
    segundoApellidoTutor: '',
    fechaNacimientoTutor: '',
    edoNacimientoTutor:'',
    // Datos Casa o Comedor
    comunidadCasa: '',
    localidadCasa: '',
    centroCoordinador: '',
    tipoCasa: '',
    nombreCasa:'',
    //Translado de la Casa-Comunidad de porocedencia
    medioAcceso: '',
    especifAcceso:'',
    riesgoAcceso: '',
    especifRiesgo:'',
    //Discapacidades
    discapacidad: '',
    tipoDiscapacidad: '',
    especifDiscapacidad:'',
    //Datos Academicos
    tipoEscuela: '',
    cct:'',
    nombreEscuela: '',
    escolaridad: '',
    otraesco:'',
    semestreoanosCursados: '',
    tipoCurso: '',
    //Salud
    alergia: '',
    alergiaDetalles: '',
    respirar: '',
    respirarDetalles: '',
    tratamiento: '',
    tratamientoDetalles: '',
    //Tramite
    solicitud: ''
  };

  mostrarFormulario() {
    this. formularioVisible = true; // Muestra el formulario
    setTimeout(() => {
      // Espera un breve momento para que el formulario se muestre completamente
      this.formulario.nativeElement.scrollIntoView({ behavior: 'smooth' }); // Desplaza suavemente hacia el formulario
    }, 100); // Ajusta el tiempo si es necesario
  }
  nextStep() {
    if (this.validateStep(this.currentStep)) {
      this.currentStep++;
      this.updateProgressBar();
      this.formularioVisible=false;
    } else {

      this.showError('Por favor, llena todos los campos requeridos.');
    }
  }

  previousStep() {
    this.currentStep--;
    this.updateProgressBar();
  }

  updateProgressBar() {
    if (this.currentStep === 1) {
      this.progressWidth = '50%';
    } else if (this.currentStep === 2) {
      this.progressWidth = '100%';
    }
  }

  validateStep(step: number): boolean {
    if (step === 1) {
      return !!this.formData.nombre;  // Convertir a booleano
    } else if (step === 2) {

    }
    return false;
  }
  

  onSubmit() {
    if (this.validateStep(this.currentStep)) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Revisa los datos antes de enviar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, enviar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Enviado', 'Tu formulario ha sido enviado correctamente.', 'success');
          // Aquí puedes enviar los datos al servidor...
        }
      });
    } else {
      this.showError('Por favor, llena todos los campos requeridos.');
    }
  }

  showError(message: string) {
    Swal.fire('Error', message, 'error');
  }
}