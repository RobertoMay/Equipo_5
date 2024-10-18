// Definición de la interfaz StudentData para la propiedad 'data'
interface StudentData {
  // Información Personal del Estudiante
  curp: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  sexo: string;
  telefonoFijo: string;
  telefonoMovil: string;
  correoElectronico: string;
  fechaNacimiento: string;

  // Origen Indígena
  puebloIndigena: string;
  lenguaIndigena: string;

  // Dirección
  estado: string;
  municipio: string;
  localidad: string;
  comunidad: string;
  comunidadCasa: string;
  localidadCasa: string;

  // Información de la Madre
  estadoMadre: string;
  curpMadre: string;
  nombreMadre: string;
  primerApellidoMadre: string;
  segundoApellidoMadre: string;
  fechaNacimientoMadre: string;
  edoNacimientoMadre: string;

  // Información del Padre
  estadoPadre: string;
  curpPadre: string;
  nombrePadre: string;
  primerApellidoPadre: string;
  segundoApellidoPadre: string;
  fechaNacimientoPadre: string;
  edoNacimientoPadre: string;

  // Información del Tutor
  parentescoTutor: string;
  curpTutor: string;
  nombreTutor: string;
  primerApellidoTutor: string;
  segundoApellidoTutor: string;
  fechaNacimientoTutor: string;
  edoNacimientoTutor: string;

  // Información de la Casa
  centroCoordinador: string;
  tipoCasa: string;
  nombreCasa: string;
  medioAcceso: string;
  especifAcceso: string;
  riesgoAcceso: string;
  especifRiesgo: string;

  // Salud
  discapacidad: string;
  tipoDiscapacidad: string;
  especifDiscapacidad: string;
  alergia: string;
  alergiaDetalles: string;
  respirar: string;
  respirarDetalles: string;
  tratamiento: string;
  tratamientoDetalles: string;

  // Educación
  tipoEscuela: string;
  cct: string;
  nombreEscuela: string;
  escolaridad: string;
  otraesco: string;
  semestreoanosCursados: string;
  tipoCurso: string;

  // Solicitud
  solicitud: string;
}

// Definición de la clase DataStudent
export class DataStudent {
  // Nombre de la colección en la base de datos
  static collectionName = 'DataStudent';

  // Identificadores
  id: string;
  aspiranteId: string;
  aspiranteCurp: string;

  // Datos del Estudiante
  data: StudentData;

  /**
   * Constructor de la clase DataStudent
   * @param partial - Objeto parcial que contiene las propiedades para inicializar la instancia
   */
  constructor(partial: Partial<DataStudent>) {
    Object.assign(this, partial);
  }
}
