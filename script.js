// Datos de productos
const productos = [
    {
        id: 1,
        nombre: "Smartphone X",
        precio: 599.99,
        categoria: "electronica",
        imagen: "imagenes/producto1.jpg",
        descripcion: "El último smartphone con cámara de 108MP y pantalla AMOLED."
    },
    {
        id: 2,
        nombre: "Laptop Pro",
        precio: 1299.99,
        categoria: "electronica",
        imagen: "imagenes/producto2.jpg",
        descripcion: "Potente laptop con procesador i9 y 16GB de RAM."
    },
    {
        id: 3,
        nombre: "Camiseta Casual",
        precio: 29.99,
        categoria: "ropa",
        imagen: "imagenes/producto3.jpg",
        descripcion: "Camiseta 100% algodón para un look casual y cómodo."
    },
    {
        id: 4,
        nombre: "Juego de Sábanas",
        precio: 49.99,
        categoria: "hogar",
        imagen: "imagenes/producto4.jpg",
        descripcion: "Juego de sábanas de algodón egipcio, 600 hilos."
    },
    {
        id: 5,
        nombre: "Auriculares Inalámbricos",
        precio: 149.99,
        categoria: "electronica",
        imagen: "imagenes/producto5.jpg",
        descripcion: "Auriculares con cancelación de ruido y 30h de batería."
    },
    {
        id: 6,
        nombre: "Zapatos Deportivos",
        precio: 89.99,
        categoria: "ropa",
        imagen: "imagenes/producto6.jpg",
        descripcion: "Zapatos deportivos con amortiguación para mayor comodidad."
    }
];

// Ofertas especiales (productos con descuento)
const ofertas = productos.map(producto => {
    return {
        ...producto,
        precioOferta: (producto.precio * 0.8).toFixed(2), // 20% de descuento
        descuento: "20% OFF"
    };
}).slice(0, 4); // Tomamos los primeros 4 productos para las ofertas

// Carrito de compras
let carrito = [];

// Elementos del DOM
const gridProductos = document.querySelector('.grid-productos');
const sliderOfertas = document.querySelector('.slider-ofertas');
const btnFiltros = document.querySelectorAll('.btn-filtro');
const carritoIcono = document.querySelector('.carrito');
const contadorCarrito = document.querySelector('.contador-carrito');
const modalCarrito = document.querySelector('.modal-carrito');
const cerrarModal = document.querySelector('.cerrar-modal');
const itemsCarrito = document.querySelector('.items-carrito');
const precioTotal = document.querySelector('.precio-total');
const btnComprar = document.querySelector('.btn-comprar');

// Cargar productos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    renderProductos(productos);
    renderOfertas(ofertas);
    actualizarCarrito();

    // Verificar si hay items en el localStorage
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
});

// Renderizar productos
function renderProductos(productos) {
    gridProductos.innerHTML = '';
    
    productos.forEach(producto => {
        const productoHTML = `
            <div class="card-producto" data-categoria="${producto.categoria}">
                <div class="card-img">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </div>
                <div class="card-info">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <div class="precio">
                        <span>$${producto.precio.toFixed(2)}</span>
                        <button class="btn-agregar" data-id="${producto.id}">Agregar</button>
                    </div>
                </div>
            </div>
        `;
        gridProductos.innerHTML += productoHTML;
    });

    // Agregar event listeners a los botones
    document.querySelectorAll('.btn-agregar').forEach(btn => {
        btn.addEventListener('click', agregarAlCarrito);
    });
}

// Renderizar ofertas
function renderOfertas(ofertas) {
    sliderOfertas.innerHTML = '';
    
    ofertas.forEach(oferta => {
        const ofertaHTML = `
            <div class="card-oferta">
                <div class="card-img" style="height: 150px; width: 150px; border-radius: 50%; overflow: hidden; margin-bottom: 15px;">
                    <img src="${oferta.imagen}" alt="${oferta.nombre}" style="object-fit: cover;">
                </div>
                <h3>${oferta.nombre}</h3>
                <p>${oferta.descripcion}</p>
                <div class="precio">
                    <span class="precio-anterior">$${oferta.precio.toFixed(2)}</span>
                    <span>$${oferta.precioOferta}</span>
                    <span class="descuento">${oferta.descuento}</span>
                </div>
                <button class="btn-agregar" data-id="${oferta.id}" style="margin-top: 15px;">Agregar</button>
            </div>
        `;
        sliderOfertas.innerHTML += ofertaHTML;
    });

    // Agregar event listeners a los botones de ofertas
    document.querySelectorAll('.slider-ofertas .btn-agregar').forEach(btn => {
        btn.addEventListener('click', agregarAlCarrito);
    });
}

// Filtrar productos por categoría
btnFiltros.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover clase active de todos los botones
        btnFiltros.forEach(b => b.classList.remove('active'));
        // Agregar clase active al botón clickeado
        btn.classList.add('active');
        
        const categoria = btn.dataset.categoria;
        
        if (categoria === 'todos') {
            renderProductos(productos);
        } else {
            const productosFiltrados = productos.filter(
                producto => producto.categoria === categoria
            );
            renderProductos(productosFiltrados);
        }
    });
});

// Funciones del carrito
function agregarAlCarrito(e) {
    const id = parseInt(e.target.dataset.id);
    const producto = productos.find(p => p.id === id);
    
    // Verificar si el producto ya está en el carrito
    const productoEnCarrito = carrito.find(item => item.id === id);
    
    if (productoEnCarrito) {
        // Incrementar cantidad
        productoEnCarrito.cantidad++;
    } else {
        // Agregar nuevo producto al carrito
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }
    
    actualizarCarrito();
    mostrarNotificacion(`${producto.nombre} agregado al carrito`);
}

function actualizarCarrito() {
    // Actualizar contador
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    contadorCarrito.textContent = totalItems;
    
    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Actualizar modal del carrito si está abierto
    if (modalCarrito.style.display === 'flex') {
        renderCarrito();
    }
}

function renderCarrito() {
    itemsCarrito.innerHTML = '';
    
    if (carrito.length === 0) {
        itemsCarrito.innerHTML = '<p>Tu carrito está vacío</p>';
        precioTotal.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        
        const itemHTML = `
            <div class="item-carrito" data-id="${item.id}">
                <div class="item-info">
                    <div class="item-img">
                        <img src="${item.imagen}" alt="${item.nombre}">
                    </div>
                    <div>
                        <h4>${item.nombre}</h4>
                        <p>$${item.precio.toFixed(2)}</p>
                    </div>
                </div>
                <div class="item-controls">
                    <div class="cantidad-control">
                        <button class="btn-cantidad btn-restar">-</button>
                        <span>${item.cantidad}</span>
                        <button class="btn-cantidad btn-sumar">+</button>
                    </div>
                    <p class="subtotal">$${subtotal.toFixed(2)}</p>
                    <button class="btn-eliminar"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        itemsCarrito.innerHTML += itemHTML;
    });
    
    precioTotal.textContent = `$${total.toFixed(2)}`;
    
    // Agregar event listeners a los controles
    document.querySelectorAll('.btn-restar').forEach(btn => {
        btn.addEventListener('click', restarCantidad);
    });
    
    document.querySelectorAll('.btn-sumar').forEach(btn => {
        btn.addEventListener('click', sumarCantidad);
    });
    
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', eliminarDelCarrito);
    });
}

function restarCantidad(e) {
    const itemCarrito = e.target.closest('.item-carrito');
    const id = parseInt(itemCarrito.dataset.id);
    const item = carrito.find(item => item.id === id);
    
    if (item.cantidad > 1) {
        item.cantidad--;
    } else {
        // Eliminar si la cantidad es 1
        carrito = carrito.filter(item => item.id !== id);
    }
    
    actualizarCarrito();
}

function sumarCantidad(e) {
    const itemCarrito = e.target.closest('.item-carrito');
    const id = parseInt(itemCarrito.dataset.id);
    const item = carrito.find(item => item.id === id);
    
    item.cantidad++;
    actualizarCarrito();
}

function eliminarDelCarrito(e) {
    const itemCarrito = e.target.closest('.item-carrito');
    const id = parseInt(itemCarrito.dataset.id);
    
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarrito();
}

// Abrir y cerrar modal del carrito
carritoIcono.addEventListener('click', () => {
    modalCarrito.style.display = 'flex';
    renderCarrito();
});

cerrarModal.addEventListener('click', () => {
    modalCarrito.style.display = 'none';
});

// Cerrar modal al hacer clic fuera
modalCarrito.addEventListener('click', (e) => {
    if (e.target === modalCarrito) {
        modalCarrito.style.display = 'none';
    }
});

// Finalizar compra
btnComprar.addEventListener('click', () => {
    if (carrito.length === 0) return;
    
    alert('¡Compra realizada con éxito! Gracias por tu compra.');
    carrito = [];
    actualizarCarrito();
    modalCarrito.style.display = 'none';
});

// Mostrar notificación
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 10);
    
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// Estilos para la notificación (podrían ir en CSS)
const estiloNotificacion = document.createElement('style');
estiloNotificacion.textContent = `
    .notificacion {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1001;
    }
    .notificacion.mostrar {
        opacity: 1;
    }
`;
document.head.appendChild(estiloNotificacion);