import { Component, ElementRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { HojasInscripcionService } from '../../../../services/api/inscription/inscription.service';
import { RegistrationService } from 'services/api/registration/registration.service';
import { IRegistration } from '../registration-form/iregistration-form.metadata';

@Component({
  selector: 'app-registration-process',
  templateUrl: './registration-process.component.html',
  styleUrls: ['./registration-process.component.css'],
})
export class RegistrationProcessComponent {
  currentStep: number = 1;
  progressWidth: string = '50%';
  @ViewChild('formulario', { static: false }) formulario!: ElementRef;
  formularioVisible = false;
  aspiranteId: string | null = null;
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
    edoNacimientoMadre: '',
    // Información del padre
    estadoPadre: '',
    curpPadre: '',
    nombrePadre: '',
    primerApellidoPadre: '',
    segundoApellidoPadre: '',
    fechaNacimientoPadre: '',
    edoNacimientoPadre: '',
    // Información del tutor
    parentescoTutor: '',
    curpTutor: '',
    nombreTutor: '',
    primerApellidoTutor: '',
    segundoApellidoTutor: '',
    fechaNacimientoTutor: '',
    edoNacimientoTutor: '',
    // Datos Casa o Comedor
    comunidadCasa: '',
    localidadCasa: '',
    centroCoordinador: '',
    tipoCasa: '',
    nombreCasa: '',
    //Translado de la Casa-Comunidad de porocedencia
    medioAcceso: '',
    especifAcceso: '',
    riesgoAcceso: '',
    especifRiesgo: '',
    //Discapacidades
    discapacidad: '',
    tipoDiscapacidad: '',
    especifDiscapacidad: '',
    //Datos Academicos
    tipoEscuela: '',
    cct: '',
    nombreEscuela: '',
    escolaridad: '',
    otraesco: '',
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
    solicitud: '',
  };
  constructor(private pdfService: HojasInscripcionService, private updateservice: RegistrationService) {}




  mostrarFormulario() {
    this.formularioVisible = true; // Muestra el formulario
    setTimeout(() => {
      // Espera un breve momento para que el formulario se muestre completamente
      this.formulario.nativeElement.scrollIntoView({ behavior: 'smooth' }); // Desplaza suavemente hacia el formulario
    }, 100); // Ajusta el tiempo si es necesario
  }
  nextStep() {
    if (this.validateStep(this.currentStep)) {
      this.currentStep++;
      this.updateProgressBar();
      this.formularioVisible = false;
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
    console.log(this.formData.estadoMadre);
    console.log(this.formData.estadoPadre);
    if (step === 1) {
      // Validar todos los campos de formData en el paso 1
    return (
      this.formData.curp.trim() !== '' &&
      this.formData.nombre.trim() !== '' &&
      this.formData.primerApellido.trim() !== '' &&
      this.formData.segundoApellido.trim() !== '' &&
      this.formData.sexo.trim() !== '' &&
      this.formData.telefonoFijo.trim() !== '' &&
      this.formData.telefonoMovil.trim() !== '' &&
      this.formData.correoElectronico.trim() !== '' &&
      this.formData.puebloIndigena.trim() !== '' &&
      this.formData.lenguaIndigena.trim() !== '' &&
      this.formData.fechaNacimiento.trim() !== '' &&
      this.formData.estado.trim() !== '' &&
      this.formData.municipio.trim() !== '' &&
      this.formData.localidad.trim() !== '' &&
      this.formData.comunidad.trim() !== ''&&
// Información de la madre
this.formData.estadoMadre.trim() !== '' &&
this.formData.curpMadre.trim() !== '' &&
this.formData.nombreMadre.trim() !== '' &&
this.formData.primerApellidoMadre.trim() !== '' &&
this.formData.segundoApellidoMadre.trim() !== '' &&
this.formData.fechaNacimientoMadre.trim() !== '' &&
this.formData.edoNacimientoMadre.trim() !== '' &&
// Información del padre
this.formData.estadoPadre.trim() !== '' &&
this.formData.curpPadre.trim() !== '' &&
this.formData.nombrePadre.trim() !== '' &&
this.formData.primerApellidoPadre.trim() !== '' &&
this.formData.segundoApellidoPadre.trim() !== '' &&
this.formData.fechaNacimientoPadre.trim() !== '' &&
this.formData.edoNacimientoPadre.trim() !== '' &&
// Información del tutor
this.formData.parentescoTutor.trim() !== '' &&
this.formData.curpTutor.trim() !== '' &&
this.formData.nombreTutor.trim() !== '' &&
this.formData.primerApellidoTutor.trim() !== '' &&
this.formData.segundoApellidoTutor.trim() !== '' &&
this.formData.fechaNacimientoTutor.trim() !== '' &&
this.formData.edoNacimientoTutor.trim() !== ''
);

} else if (step === 2) {
  // Validar todos los campos de formData en el paso 2
  console.log(this.formData.comunidadCasa);
  console.log(this.formData.localidadCasa);
  console.log(this.formData.centroCoordinador);
  console.log(this.formData.tipoCasa);
  console.log(this.formData.nombreCasa);
  console.log(this.formData.medioAcceso);
  console.log(this.formData.riesgoAcceso);
  console.log(this.formData.discapacidad);
  console.log(this.formData.tipoEscuela);
  console.log(this.formData.nombreEscuela);
  console.log(this.formData.escolaridad);
  console.log(this.formData.semestreoanosCursados);
  console.log(this.formData.tipoCurso);
  console.log(this.formData.alergia);
  console.log(this.formData.alergia);
  console.log(this.formData.respirar);
  console.log(this.formData.respirarDetalles);
  console.log(this.formData.tratamiento);
  return (
    this.formData.comunidadCasa.trim() !== '' &&
    this.formData.localidadCasa.trim() !== '' &&
    this.formData.centroCoordinador.trim() !== '' &&
    this.formData.tipoCasa.trim() !== '' &&
    this.formData.nombreCasa.trim() !== '' &&
    // Traslado de la Casa-Comunidad de procedencia
    this.formData.medioAcceso.trim() !== '' &&
    this.formData.riesgoAcceso.trim() !== '' &&
    // Discapacidades
    this.formData.discapacidad.trim() !== '' && // Datos Académicos
    this.formData.tipoEscuela.trim() !== '' &&
 
    this.formData.nombreEscuela.trim() !== '' &&
    this.formData.escolaridad.trim() !== '' &&
    this.formData.semestreoanosCursados.trim() !== '' &&
    this.formData.tipoCurso.trim() !== '' &&
    // Salud
    this.formData.alergia.trim() !== '' &&
    this.formData.respirar.trim() !== '' &&
    this.formData.tratamiento.trim() !== '' 
  );
}

    return false;
  }

  onSubmit() {
    if (this.validateStep(this.currentStep)) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Revisa los datos antes de enviar',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, enviar',
      }).then((result) => {
        if (result.isConfirmed) {
    // Recuperar el ID del aspirante desde localStorage
    const aspiranteId = localStorage.getItem('aspiranteId');

        if (!aspiranteId) {
          this.showError('ID de aspirante no encontrado. Por favor, inténtelo de nuevo.');
          return;
        }

          const data = {
            curp: this.formData.curp,
            nombre: this.formData.nombre,
            primerApellido: this.formData.primerApellido,
            segundoApellido: this.formData.segundoApellido,
            sexo: this.formData.sexo,
            telefonoFijo: this.formData.telefonoFijo,
            telefonoMovil: this.formData.telefonoMovil,
            correoElectronico: this.formData.correoElectronico,
            puebloIndigena: this.formData.puebloIndigena,
            lenguaIndigena: this.formData.lenguaIndigena,
            fechaNacimiento: this.formData.fechaNacimiento,
            estado: this.formData.estado,
            municipio: this.formData.municipio,
            localidad: this.formData.localidad,
            comunidad: this.formData.comunidad,
            estadoMadre: this.formData.estadoMadre,
            curpMadre: this.formData.curpMadre,
            nombreMadre: this.formData.nombreMadre,
            primerApellidoMadre: this.formData.primerApellidoMadre,
            segundoApellidoMadre: this.formData.segundoApellidoMadre,
            fechaNacimientoMadre: this.formData.fechaNacimientoMadre,
            edoNacimientoMadre: this.formData.edoNacimientoMadre,
            estadoPadre: this.formData.estadoPadre,
            curpPadre: this.formData.curpPadre,
            nombrePadre: this.formData.nombrePadre,
            primerApellidoPadre: this.formData.primerApellidoPadre,
            segundoApellidoPadre: this.formData.segundoApellidoPadre,
            fechaNacimientoPadre: this.formData.fechaNacimientoPadre,
            edoNacimientoPadre: this.formData.edoNacimientoPadre,
            parentescoTutor: this.formData.parentescoTutor,
            curpTutor: this.formData.curpTutor,
            nombreTutor: this.formData.nombreTutor,
            primerApellidoTutor: this.formData.primerApellidoTutor,
            segundoApellidoTutor: this.formData.segundoApellidoTutor,
            fechaNacimientoTutor: this.formData.fechaNacimientoTutor,
            edoNacimientoTutor: this.formData.edoNacimientoTutor,
            comunidadCasa: this.formData.comunidadCasa,
            localidadCasa: this.formData.localidadCasa,
            centroCoordinador: this.formData.centroCoordinador,
            tipoCasa: this.formData.tipoCasa,
            nombreCasa: this.formData.nombreCasa,
            medioAcceso: this.formData.medioAcceso,
            riesgoAcceso: this.formData.riesgoAcceso,
            discapacidad: this.formData.discapacidad,
            tipoDiscapacidad: this.formData.tipoDiscapacidad,
            tipoEscuela: this.formData.tipoEscuela,
            cct: this.formData.cct,
            nombreEscuela: this.formData.nombreEscuela,
            escolaridad: this.formData.escolaridad,
            semestreoanosCursados: this.formData.semestreoanosCursados,
            tipoCurso: this.formData.tipoCurso,
            alergia: this.formData.alergia,
            alergiaDetalles: this.formData.alergiaDetalles,
            respirar: this.formData.respirar,
            respirarDetalles: this.formData.respirarDetalles,
            tratamiento: this.formData.tratamiento,
            tratamientoDetalles: this.formData.tratamientoDetalles,
            solicitud: this.formData.solicitud,
          };
          console.log(data);
          this.pdfService.generateAndUploadPdf(aspiranteId, this.formData).subscribe({
            next: pdfResponse => {
              // Si la generación del PDF es exitosa, proceder a actualizar el aspirante
              const updatedAspirante: IRegistration = {
                nombresCompletos: `${this.formData.nombre} ${this.formData.primerApellido} ${this.formData.segundoApellido}`,
                apellidoPaterno: this.formData.primerApellido,
                apellidoMaterno: this.formData.segundoApellido,
                curp: this.formData.curp,
                correo: this.formData.correoElectronico,
                periodoinscripcion: this.formData.tipoCurso, // Ajusta según corresponda
                statusinscripcion: false, // O el valor correspondiente del formulario
              };

              this.updateservice.updateAspirante(aspiranteId, updatedAspirante).subscribe({
                next: response => {
                  if (!response.error) {
                    Swal.fire('Enviado', 'El PDF fue generado y los datos del aspirante se actualizaron exitosamente.', 'success');
                  } else {
                    this.showError(response.msg);
                  }
                },
                error: err => {
                  this.showError('Error al actualizar el aspirante: ' + err.message);
                }
              });
            },
            error: pdfErr => {
              this.showError('Error al generar el PDF: ' + pdfErr.message);
            }
          });
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
