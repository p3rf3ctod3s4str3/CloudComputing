
const CLAVE = "productosLocal";

function obtenerProductos() {
  return JSON.parse(localStorage.getItem(CLAVE)) || [];
}

function guardarProductos(productos) {
  localStorage.setItem(CLAVE, JSON.stringify(productos));
}

function escapar(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function mostrarProductos() {
  const tabla = document.getElementById("tablaLocal");
  const productos = obtenerProductos();

  if (!productos.length) {
    tabla.innerHTML = '<tr><td colspan="3" class="vacio">No hay productos registrados.</td></tr>';
    return;
  }

  tabla.innerHTML = productos.map((producto, indice) => `
    <tr>
      <td>${escapar(producto.nombre)}</td>
      <td>${producto.cantidad}</td>
      <td>
        <button class="mini editar" onclick="editarProducto(${indice})">Editar</button>
        <button class="mini eliminar" onclick="eliminarProducto(${indice})">Eliminar</button>
      </td>
    </tr>
  `).join("");
}

window.eliminarProducto = function(indice) {
  const productos = obtenerProductos();
  productos.splice(indice, 1);
  guardarProductos(productos);
  mostrarProductos();
};

window.editarProducto = function(indice) {
  const productos = obtenerProductos();
  const nuevoNombre = prompt("Nuevo nombre:", productos[indice].nombre);
  if (nuevoNombre === null) return;

  const nuevaCantidad = prompt("Nueva cantidad:", productos[indice].cantidad);
  if (nuevaCantidad === null) return;

  productos[indice] = {
    nombre: nuevoNombre.trim(),
    cantidad: Number(nuevaCantidad)
  };

  guardarProductos(productos);
  mostrarProductos();
};

document.getElementById("formLocal").addEventListener("submit", function(evento) {
  evento.preventDefault();

  const productos = obtenerProductos();
  productos.push({
    nombre: document.getElementById("nombre").value.trim(),
    cantidad: Number(document.getElementById("cantidad").value)
  });

  guardarProductos(productos);
  this.reset();
  document.getElementById("mensajeLocal").textContent = "Producto guardado en LocalStorage.";
  mostrarProductos();
});

mostrarProductos();
