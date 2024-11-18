export interface AdminDashboardData {
    adminName: string;
    alumnos: {
      total: number;
      inscritos: number;
      porInscribirse: number;
    };
    documentos: {
      porInscribirse: number;
      completos: number;
      pendientes: number;
    };
    albergue: {
      cupoTotal: number;
      plazasOcupadas: number;
      plazasDisponibles: number;
    };

    distribucionGenero: {
      hombresInscritos: number;
      mujeresInscritos: number;
      otrosInscritos: number;
    };
  }
  