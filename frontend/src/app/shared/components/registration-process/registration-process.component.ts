import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentdocService } from 'services/api/studentdoc/studentdoc.service';
import { DataStudentService } from 'services/api/datastudent/datastudent.service'; // Actualiza la ruta si es necesario
import { IStudentDocDocument } from 'models/istudentdoc.metadata'; // Ajusta la ruta según sea necesario
import { StudentDocument } from 'models/istudentdoc.metadata'; // Ajusta la ruta según sea necesario
import { StudentEnrollmentFormService } from 'services/api/student-enrollment-form/student-enrollment-form.service';

@Component({
  selector: 'app-registration-process',
  templateUrl: './registration-process.component.html',
  styleUrls: ['./registration-process.component.css'],
})
export class RegistrationProcessComponent implements OnInit {
  isAccepted: boolean = false;
  isCollapsed: boolean = true;
  isAddressCollapsed: boolean = true;
  madreCollapsed: boolean = true;
  padreCollapsed: boolean = true;
  tutorCollapsed: boolean = true;
  casaCollapsed: boolean = true;
  trasladoCollapsed: boolean = true;
  discapacidadCollapsed: boolean = true;
  academicoCollapsed: boolean = true;
  saludCollapsed: boolean = true;
  inscripcionCollapsed: boolean = true;

  currentStep: number = 1;
  progressWidth: string = '33.33%';
  @ViewChild('formulario', { static: false }) formulario!: ElementRef;
  formularioVisible = false;
  studentName: string = '';
  aspiranteId: string | null = null;
  statusenrollment: string | null = null;
  currentEnrollmentPeriod: string = '';
  termsAccepted: boolean = false; // Variable para habilitar o deshabilitar el botón

  // Método que se ejecuta cuando se acepta los términos
  onTermsAccepted() {
    this.termsAccepted = true;

  }
  updateEnrollmentPeriod(enrollmentPeriod: string) {
    this.currentEnrollmentPeriod = enrollmentPeriod;
  }
  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }
  toggleAddressCollapse(): void {
    this.isAddressCollapsed = !this.isAddressCollapsed;
  }
   togglemadreCollapse(): void {
    this.madreCollapsed = !this.madreCollapsed;
  }
  togglepadreCollapse(): void {
    this.padreCollapsed = !this.padreCollapsed;
  }
  toggletutorCollapse(): void {
    this.tutorCollapsed = !this.tutorCollapsed;
  }
  togglecasaCollapse(): void {
    this.casaCollapsed = !this.casaCollapsed;
  } 

  toggletrasladoCollapse(): void {
    this.trasladoCollapsed = !this.trasladoCollapsed;
  }

  togglediscapacidadCollapse(): void {
    this.discapacidadCollapsed = !this.discapacidadCollapsed;
  } 

  toggleacademicoCollapse(): void {
    this.academicoCollapsed= !this.academicoCollapsed;
  } 
  
  togglesaludCollapse(): void {
    this.saludCollapsed= !this.saludCollapsed;
  }


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
  
  constructor(
    private fb: FormBuilder,
    private datastudentservice: DataStudentService,
    private studentdocService: StudentdocService,
    private studentEnrollmentService: StudentEnrollmentFormService
  ) {}
  
  ngOnInit(): void {
    this.aspiranteId = localStorage.getItem('aspiranteId')!;

    this.getEnrollmentForm();
  
  

  }
  toggleinscripcionCollapse(): void {
    this.inscripcionCollapsed = !this.inscripcionCollapsed;
  }
  updateEnrollmentStatus(status: boolean) {
    this.isAccepted = status;
  }

  mostrarFormulario() {
    this.formularioVisible = true; // Muestra el formulario
    setTimeout(() => {
      // Espera un breve momento para que el formulario se muestre completamente
      this.formulario.nativeElement.scrollIntoView({ behavior: 'smooth' }); // Desplaza suavemente hacia el formulario
    }, 100); // Ajusta el tiempo si es necesario
  }
  //Metodo para avanzar al siguiente Paso
  nextStep() {
    if (this.validateStep(1)) {
      this.currentStep++; // Incrementar el paso actual
      this.updateProgressBar(); // Actualizar la barra de progreso
      this.formularioVisible = false; // Ocultar el formulario si es necesario
    } else {
      this.showError('Por favor, llena todos los campos requeridos.');
    }
      
  }
  

  // Metodo para regresar al paso anterior
  previousStep() {
    this.currentStep--;
    this.updateProgressBar();
  }
  //Actualiza la barra de progreso
  updateProgressBar() {
    this.progressWidth = `${(this.currentStep / 3) * 100}%`;
  }
  // Valida los pasos, ya sea para pasar al siguiente o mandar los datos
  validateStep(step: number): boolean {
    console.log(this.formData.estadoMadre);
    const missingFields: string[] = [];
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
        this.formData.comunidad.trim() !== '' &&
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
          const statusenrollment = localStorage.getItem('statusenrollment')!;
          const idenrollment = localStorage.getItem('idenrollment')!;
   
          if (!aspiranteId) {
            this.showError(
              'ID de aspirante no encontrado. Por favor, inténtelo de nuevo.'
            );
            return;
          }

          const dataStudent = {
            id: '',
            aspiranteId,
            aspiranteCurp: this.formData.curp,
            data: {
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
              especifAcceso: this.formData.especifAcceso,
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
              especificDiscapacidad: this.formData.especifDiscapacidad,
              tratamientoDetalles: this.formData.tratamientoDetalles,
              solicitud: this.formData.solicitud,
            },
          };
          this.datastudentservice
            .create('datastudents/', dataStudent)
            .subscribe({
              next: (response) => {
                Swal.fire(
                  'Enviado',
                  'Los datos del estudiante se han registrado exitosamente.',
                  'success'
                );
                // Realizar el POST en `StudentdocService` después del registro exitoso
                const documentss: StudentDocument[] = [
                  {
                    name: 'Solicitud de Ingreso',
                    type: 'Solicitud Ingreso',
                    link: 'Anexo1_solicitud_ingreso', // Ajusta el enlace
                    date: new Date(),
                    status: 'uploaded',
                  },
                ];
                const studentDoc: IStudentDocDocument = {
                  aspiranteId: aspiranteId, // Usar ID recibido del primer POST
                  name: this.formData.nombre,
                  lastName1: this.formData.primerApellido,
                  lastName2: this.formData.segundoApellido,
                  email: this.formData.correoElectronico,
                  curp: this.formData.curp,
                  enrollmentPeriod: statusenrollment, // Esto se debe ajustar al recibir la convocatoria
                  convocatoriaId: idenrollment,
                  enrollmentStatus: false, // inicia en falso por que aun no esta aceptado
                  Documents: documentss, // Agrega los documentos si los tienes
                  fecha: new Date(), // Fecha actual
                  hora: new Date().toLocaleTimeString(), // Hora actual
                };

                this.studentdocService
                  .create('studentdoc/', studentDoc)
                  .subscribe({
                    next: () => {
                      this.nextStep();
                    },
                    error: (err) => {
                      this.showError(
                        'Error al registrar los documentos del estudiante: ' +
                          err.message
                      );
                    },
                  });
              },
              error: (err) => {
                this.showError(
                  'Error al registrar los datos del estudiante: ' + err.message
                );
              },
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

  getEnrollmentForm() {
    this.studentEnrollmentService
      .getById(`aspirante/${this.aspiranteId}`)
      .subscribe(
        (response) => {
          if (!response.error) {
            this.studentName = response.data?.data.nombre;
            this.currentStep = 3;
            this.updateProgressBar();
            this.formularioVisible = false;
          } else {
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }

  
}
