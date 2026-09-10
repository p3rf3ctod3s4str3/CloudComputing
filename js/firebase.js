
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Reemplaza estos datos por la configuración de tu proyecto en Firebase.
const firebaseConfig = {
  apiKey: "PEGA_AQUI",
  authDomain: "PEGA_AQUI",
  projectId: "PEGA_AQUI",
  storageBucket: "PEGA_AQUI",
  messagingSenderId: "PEGA_AQUI",
  appId: "PEGA_AQUI"
};

const configurado = firebaseConfig.apiKey !== "PEGA_AQUI" && firebaseConfig.projectId !== "PEGA_AQUI";
const estado = document.getElementById("estadoFirebase");
const formulario = document.getElementById("formFirebase");
const mensaje = document.getElementById("mensajeFirebase");
const tabla = document.getElementById("tablaFirebase");

if (!configurado) {
  estado.textContent = "Sin configurar";
  estado.className = "estado pendiente";
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    mensaje.textContent = "Primero debes completar la configuración en js/firebase.js.";
  });
} else {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const productosRef = collection(db, "productos");

  estado.textContent = "Conectado";
  estado.className = "estado conectado";

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    try {
      await addDoc(productosRef, {
        nombre: document.getElementById("fbNombre").value.trim(),
        cantidad: Number(document.getElementById("fbCantidad").value)
      });
      formulario.reset();
      mensaje.textContent = "Producto guardado en Firebase.";
    } catch (error) {
      console.error(error);
      mensaje.textContent = "No se pudo guardar. Revisa Firebase y las reglas de Firestore.";
    }
  });

  onSnapshot(productosRef, (snapshot) => {
    if (snapshot.empty) {
      tabla.innerHTML = '<tr><td colspan="3" class="vacio">No hay productos en Firebase.</td></tr>';
      return;
    }

    tabla.innerHTML = "";
    snapshot.forEach((registro) => {
      const producto = registro.data();
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${String(producto.nombre ?? "")}</td>
        <td>${Number(producto.cantidad ?? 0)}</td>
        <td>
          <button class="mini editar">Editar</button>
          <button class="mini eliminar">Eliminar</button>
        </td>
      `;

      fila.querySelector(".eliminar").addEventListener("click", async () => {
        await deleteDoc(doc(db, "productos", registro.id));
      });

      fila.querySelector(".editar").addEventListener("click", async () => {
        const nuevaCantidad = prompt("Nueva cantidad:", producto.cantidad);
        if (nuevaCantidad === null) return;
        await updateDoc(doc(db, "productos", registro.id), {
          cantidad: Number(nuevaCantidad)
        });
      });

      tabla.appendChild(fila);
    });
  });
}
