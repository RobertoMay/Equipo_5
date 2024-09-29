export interface ILoginResponse {
  token: string;
  nombresCompletos: string;  // Campo devuelto por el backend
  esAdministrador: boolean;  // Este campo debe ser proporcionado por el backend para saber si el usuario es admin
  message: string;
  }
  