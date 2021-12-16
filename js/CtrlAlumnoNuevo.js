import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraEmpleados
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";

const daoEmpleado = getFirestore().collection("Empleado");
/** @type {HTMLFormElement} */
const forma = document["forma"];

getAuth().onAuthStateChanged(protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,["Cliente"])) {
    forma.addEventListener("submit", guarda);
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData = new FormData(forma);

    const matricula = getString(formData, "matricula").trim();  
    const nombre = getString(formData, "nombre").trim();
    const fecha = getString(formData, "fecha").trim();
    const hora = getString(formData, "hora").trim();
    /**
     * @type {
        import("./tipos.js").
                Alumno} */
    const modelo = {
      matricula,
      nombre,
      fecha,
      hora
    };
    await daoEmpleado.add(modelo);
    muestraEmpleados();
  } catch (e) {
    muestraError(e);
  }
}