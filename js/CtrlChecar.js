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

    var forma = document.getElementById("forma"),
        fechas =document.getElementById("fecha"),
        horas = document.getElementById("hora");

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    document.getElementById("fechas").value = date;
    document.getElementById("horas").value = time;

    const fecha = getString(formData, "date").trim();
    const hora = getString(formData, "time").trim();
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