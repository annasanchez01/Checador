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
const params = new URL(location.href).searchParams;
const id = params.get("id");
/** @type {HTMLFormElement} */
const forma = document["forma"];

getAuth().onAuthStateChanged(protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario, ["Administrador"])) {
    busca();
  }
}

/** Busca y muestra los datos que
 * corresponden al id recibido. */
async function busca() {
  try {
    const doc =
      await daoEmpleado.doc(id).get();
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
                  Alumno} */
      const data = doc.data();
      forma.matricula.value = data.matricula;
      forma.nombre.value = data.nombre || "";
      forma.hora.value = data.hora || "";
      forma.fecha.value = data.fecha || "";
      forma.addEventListener(
        "submit", guarda);
      forma.eliminar.
        addEventListener("click", elimina);
    } else {
      throw new Error(
        "No se encontró.");
    }
  } catch (e) {
    muestraError(e);
    muestraEmpleados();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData =
      new FormData(forma);
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
    await daoEmpleado.
      doc(id).
      set(modelo);
      muestraEmpleados();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +  "eliminación")) {
      await daoEmpleado.
        doc(id).
        delete();
        muestraEmpleados();
    }
  } catch (e) {
    muestraError(e);
  }
}

