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
            <button onclick="confirmarAgregarAlCarrito(${producto.id})">Agregar al Carrito</button>
        `;
        productosContainer.appendChild(productoDiv);
    });
}

// Función para mostrar SweetAlert2 y confirmar la acción de agregar al carrito
function confirmarAgregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    
    if (producto) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas agregar ${producto.nombre} al carrito?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, agregar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                agregarAlCarrito(id);
                Swal.fire(
                    'Agregado!',
                    `${producto.nombre} ha sido agregado al carrito.`,
                    'success'
                );
            } else {
                Swal.fire(
                    'Cancelado',
                    'El producto no fue agregado al carrito.',
                    'info'
                );
            }
        });
    }
}

// Función para agregar productos al carrito y guardar en localStorage
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        carrito.push(producto);
        actualizarCarrito();
        localStorage.setItem("carrito", JSON.stringify(carrito));
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
            <button onclick="confirmarEliminarDelCarrito(${index})">Eliminar</button>
        `;
        carritoContainer.appendChild(productoDiv);
        total += producto.precio;
    });

    document.getElementById("total").textContent = `Total: $${total}`;
}

// Función para confirmar la eliminación de un producto del carrito
function confirmarEliminarDelCarrito(indice) {
    const producto = carrito[indice];
    
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar ${producto.nombre} del carrito?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarDelCarrito(indice);
            Swal.fire(
                'Eliminado!',
                `${producto.nombre} ha sido eliminado del carrito.`,
                'success'
            );
        } else {
            Swal.fire(
                'Cancelado',
                'El producto no fue eliminado del carrito.',
                'info'
            );
        }
    });
}

// Función para eliminar productos del carrito
function eliminarDelCarrito(indice) {
    carrito.splice(indice, 1);
    actualizarCarrito();
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para confirmar el vaciado del carrito
function confirmarVaciadoCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas vaciar todo el carrito?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'No, cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            vaciarCarrito();
            Swal.fire(
                'Vaciado!',
                'El carrito ha sido vaciado.',
                'success'
            );
        } else {
            Swal.fire(
                'Cancelado',
                'El carrito no fue vaciado.',
                'info'
            );
        }
    });
}

// Función para vaciar el carrito
function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
    localStorage.removeItem("carrito");
}

// Función para mostrar/ocultar el carrito (toggle)
function toggleCarrito() {
    const carritoModal = document.getElementById("shopping-cart");
    const overlay = document.getElementById("shopping-cart-overlay");

    // Alternar la clase 'visible' para mostrar o esconder el modal y el overlay
    carritoModal.classList.toggle("visible");
    overlay.classList.toggle("visible");
}

// Función para confirmar la compra
function confirmarCompra() {
    if (carrito.length === 0) {
        Swal.fire({
            title: 'Carrito vacío',
            text: 'No tienes productos en tu carrito para realizar la compra.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    let total = 0;
    carrito.forEach(producto => {
        total += producto.precio;
    });

    Swal.fire({
        title: 'Confirmar compra',
        text: `¿Estás seguro que deseas comprar estos productos por un total de $${total}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'No, cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            vaciarCarrito();
            Swal.fire(
                'Compra confirmada!',
                '¡Gracias por tu compra! Te enviaremos los detalles por correo.',
                'success'
            );
        } else {
            Swal.fire(
                'Compra cancelada',
                'No se realizó ninguna compra.',
                'info'
            );
        }
    });
}

// Cargar los productos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    mostrarCarrito();
});
