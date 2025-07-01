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
    // ... (resto de productos permanece igual)
];

// Ofertas especiales (productos con descuento)
const ofertas = productos.map(producto => {
    return {
        ...producto,
        precioOferta: (producto.precio * 0.8).toFixed(2), // 20% de descuento
        descuento: "20% OFF"
    };
}).slice(0, 4); // Tomamos los primeros 4 productos para las ofertas

// ... (resto del código JavaScript permanece igual)

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
