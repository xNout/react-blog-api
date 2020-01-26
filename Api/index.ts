import App from './listener';

const PUERTO = 3535;
App.listen(PUERTO, () => console.log("Servidor corriendo!"));