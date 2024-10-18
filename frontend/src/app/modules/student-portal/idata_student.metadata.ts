import { IBaseModel } from '@shared/base-model'; // Asegúrate de que la ruta sea correcta

// Definición de la interfaz StudentData para la propiedad 'data'
export interface StudentData {
  curp: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  sexo: string;
  telefonoFijo: string;
  telefonoMovil: string;
  correoElectronico: string;
  fechaNacimiento: string;
  puebloIndigena: string;
  lenguaIndigena: string;
  estado: string;
  municipio: string;
  localidad: string;
  comunidad: string;
  comunidadCasa: string;
  localidadCasa: string;
  estadoMadre: string;
  curpMadre: string;
  nombreMadre: string;
  primerApellidoMadre: string;
  segundoApellidoMadre: string;
  fechaNacimientoMadre: string;
  edoNacimientoMadre: string;
  estadoPadre: string;
  curpPadre: string;
  nombrePadre: string;
  primerApellidoPadre: string;
  segundoApellidoPadre: string;
  fechaNacimientoPadre: string;
  edoNacimientoPadre: string;
  parentescoTutor: string;
  curpTutor: string;
  nombreTutor: string;
  primerApellidoTutor: string;
  segundoApellidoTutor: string;
  fechaNacimientoTutor: string;
  edoNacimientoTutor: string;
  centroCoordinador: string;
  tipoCasa: string;
  nombreCasa: string;
  medioAcceso: string;
  especifAcceso?: string;
  riesgoAcceso: string;
  especifRiesgo?: string;
  discapacidad: string;
  tipoDiscapacidad: string;
  especifDiscapacidad?: string;
  alergia: string;
  alergiaDetalles?: string;
  respirar: string;
  respirarDetalles?: string;
  tratamiento: string;
  tratamientoDetalles?: string;
  tipoEscuela: string;
  cct: string;
  nombreEscuela: string;
  escolaridad: string;
  otraesco?: string;
  semestreoanosCursados: string;
  tipoCurso: string;
  solicitud: string;
}

// Definición del modelo de DataStudent para el front-end
export class IDataStudent implements IBaseModel {
  id?: string; // Parte de IBaseModel
  aspiranteId!: string; // ID del aspirante
  aspiranteCurp!: string; // CURP del aspirante
  data!: StudentData; // Contiene la información completa del estudiante
}
