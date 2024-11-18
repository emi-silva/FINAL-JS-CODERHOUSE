console.log("Script cargado");

// Inicializar carrito desde localStorage o vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Inicializar la variable de productos globalmente
let productos = [];

// Función para cargar los productos desde el archivo JSON
async function cargarProductos() {
    try {
        const response = await fetch('data/productos.json'); // O usa la ruta correcta si está en una subcarpeta
        productos = await response.json(); // Guardamos los productos globalmente
        mostrarProductos(productos); // Llamar a la función para mostrar los productos
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

// Función para mostrar los productos en el DOM
function mostrarProductos(productos) {
    const productosContainer = document.getElementById("productos-container");
    productosContainer.innerHTML = ""; // Limpiar el contenedor

    productos.forEach(producto => {
        const productoDiv = document.createElement("div");
        productoDiv.classList.add("producto");
        productoDiv.innerHTML = `
            <h3>${producto.nombre}</h3>
            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
            <p>Precio: $${producto.precio}</p>
            <p>Categoría: ${producto.categoria}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
        `;
        productosContainer.appendChild(productoDiv);
    });
}

// Función para agregar productos al carrito y guardar en localStorage
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        carrito.push(producto);
        actualizarCarrito();
        localStorage.setItem("carrito", JSON.stringify(carrito));
        alert(`${producto.nombre} ha sido agregado al carrito.`);
    }
}

// Función para actualizar el carrito en el DOM y localStorage
function actualizarCarrito() {
    mostrarCarrito();
}

// Función para mostrar el carrito
function mostrarCarrito() {
    const carritoContainer = document.getElementById("cart-items");
    carritoContainer.innerHTML = ""; // Limpiar el contenedor

    let total = 0;
    carrito.forEach((producto, index) => {
        const productoDiv = document.createElement("li");
        productoDiv.classList.add("producto");
        productoDiv.innerHTML = `
            <p>${producto.nombre} - $${producto.precio}</p>
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
        carritoContainer.appendChild(productoDiv);
        total += producto.precio;
    });

    document.getElementById("total").textContent = `Total: $${total}`;
}

// Función para eliminar productos del carrito
function eliminarDelCarrito(indice) {
    carrito.splice(indice, 1);
    actualizarCarrito();
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("Producto eliminado del carrito.");
}

// Función para vaciar el carrito
function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
    localStorage.removeItem("carrito");
    alert("Carrito vaciado.");
}

// Función para mostrar/ocultar el carrito (toggle)
function toggleCarrito() {
    const carritoModal = document.getElementById("shopping-cart");
    const overlay = document.getElementById("shopping-cart-overlay");

    // Alternar la clase 'visible' para mostrar o esconder el modal y el overlay
    carritoModal.classList.toggle("visible");
    overlay.classList.toggle("visible");
}

// Cargar los productos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    mostrarCarrito();
});

// Alerta simple para probar SweetAlert2
Swal.fire('¡Hola Emiliano! Esta es una alerta de prueba.');
