// =========================================
// VYY'S - Funciones de JavaScript
// =========================================

// Formatea un número como colones. Ej: 14500 -> ₡14 500
function formatoColones(numero) {
    return "₡" + Math.round(numero).toLocaleString("es-CR").replace(/ |,|\./g, " ");
}

// ---------- Año del footer ----------
const anio = document.getElementById("anio");
if (anio) {
    anio.textContent = new Date().getFullYear();
}

// ---------- Menú para celulares ----------
const btnMenu = document.getElementById("btnMenu");
const listaMenu = document.getElementById("listaMenu");
if (btnMenu && listaMenu) {
    btnMenu.addEventListener("click", function () {
        listaMenu.classList.toggle("abierto");
    });
}

// =========================================
// FUNCIONALIDAD A: Saludo personalizado (index.html)
// =========================================
const btnSaludo = document.getElementById("btnSaludo");
const campoNombre = document.getElementById("nombreVisitante");
const mensajeSaludo = document.getElementById("mensajeSaludo");

function mostrarSaludo(nombre) {
    mensajeSaludo.textContent = "¡Hola, " + nombre + "! Qué bueno verte por VYY'S.";
}

if (btnSaludo && campoNombre && mensajeSaludo) {
    // Si el visitante ya había escrito su nombre, lo recordamos
    try {
        const guardado = localStorage.getItem("vyys_nombre");
        if (guardado) {
            campoNombre.value = guardado;
            mostrarSaludo(guardado);
        }
    } catch (e) {
        // si el navegador no permite guardar, no pasa nada
    }

    btnSaludo.addEventListener("click", function () {
        const nombre = campoNombre.value.trim();
        if (nombre === "") {
            mensajeSaludo.textContent = "Escribe tu nombre para saludarte.";
            return;
        }
        mostrarSaludo(nombre);
        try {
            localStorage.setItem("vyys_nombre", nombre);
        } catch (e) {}
    });

    campoNombre.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            btnSaludo.click();
        }
    });
}

// =========================================
// Productos: filtros y botón Agregar
// =========================================
const botonesFiltro = document.querySelectorAll(".filtros button");
const listaProductos = document.querySelectorAll(".producto");

botonesFiltro.forEach(function (boton) {
    boton.addEventListener("click", function () {
        const filtro = boton.dataset.filtro;

        botonesFiltro.forEach(function (b) {
            b.classList.remove("activo");
        });
        boton.classList.add("activo");

        listaProductos.forEach(function (producto) {
            if (filtro === "todos" || producto.dataset.categoria === filtro) {
                producto.style.display = "flex";
            } else {
                producto.style.display = "none";
            }
        });
    });
});

const contadorCarrito = document.getElementById("contadorCarrito");
let carrito = 0;

document.querySelectorAll(".btn-agregar").forEach(function (boton) {
    boton.addEventListener("click", function () {
        carrito++;
        contadorCarrito.textContent = carrito;
        boton.textContent = "¡Agregado!";
        setTimeout(function () {
            boton.textContent = "Agregar";
        }, 1200);
    });
});

// =========================================
// FUNCIONALIDAD B + C: Calculadora de compra con descuento
// =========================================
const btnCalcular = document.getElementById("btnCalcular");

if (btnCalcular) {
    btnCalcular.addEventListener("click", function () {
        const selector = document.getElementById("calcProducto");
        const resultado = document.getElementById("resultadoCalc");
        const precio = parseFloat(selector.value);
        const cantidad = parseInt(document.getElementById("calcCantidad").value);
        const nombreProducto = selector.options[selector.selectedIndex].text.split(" - ")[0];

        if (isNaN(cantidad) || cantidad < 1) {
            resultado.innerHTML = "Ingresa una cantidad válida (mínimo 1).";
            return;
        }

        const subtotal = precio * cantidad;

        // Descuento según la cantidad de unidades
        let porcentaje = 0;
        if (cantidad >= 12) {
            porcentaje = 15;
        } else if (cantidad >= 6) {
            porcentaje = 10;
        } else if (cantidad >= 3) {
            porcentaje = 5;
        }

        const descuento = subtotal * porcentaje / 100;
        const base = subtotal - descuento;
        const iva = base * 0.13;
        const total = base + iva;

        resultado.innerHTML =
            nombreProducto + " x " + cantidad + "<br>" +
            "Subtotal: " + formatoColones(subtotal) + "<br>" +
            "Descuento (" + porcentaje + "%): -" + formatoColones(descuento) + "<br>" +
            "IVA (13%): " + formatoColones(iva) + "<br>" +
            "<div class='total'>Total a pagar: " + formatoColones(total) + "</div>";
    });
}

// =========================================
// Validación del formulario de contacto (contacto.html)
// =========================================
const formulario = document.getElementById("formContacto");

if (formulario) {
    const campos = ["nombre", "apellidos", "correo", "telefono", "motivo", "mensaje"];

    function mostrarError(id, texto) {
        document.getElementById("error-" + id).textContent = texto;
        document.getElementById(id).classList.add("error");
    }

    function limpiarError(id) {
        document.getElementById("error-" + id).textContent = "";
        document.getElementById(id).classList.remove("error");
    }

    // Quita el error apenas el usuario vuelve a escribir
    campos.forEach(function (id) {
        document.getElementById(id).addEventListener("input", function () {
            limpiarError(id);
        });
    });

    formulario.addEventListener("submit", function (event) {
        event.preventDefault();

        const exito = document.getElementById("mensajeExito");
        exito.style.display = "none";

        const nombre = document.getElementById("nombre").value.trim();
        const apellidos = document.getElementById("apellidos").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const motivo = document.getElementById("motivo").value;
        const mensaje = document.getElementById("mensaje").value.trim();

        let valido = true;
        campos.forEach(limpiarError);

        if (nombre === "") {
            mostrarError("nombre", "Debe escribir su nombre.");
            valido = false;
        }
        if (apellidos === "") {
            mostrarError("apellidos", "Debe escribir sus apellidos.");
            valido = false;
        }

        const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (correo === "") {
            mostrarError("correo", "Debe escribir su correo electrónico.");
            valido = false;
        } else if (!patronCorreo.test(correo)) {
            mostrarError("correo", "El correo no tiene un formato válido.");
            valido = false;
        }

        // Teléfono de Costa Rica: 8 dígitos (se permite guion o espacio)
        const soloNumeros = telefono.replace(/[\s-]/g, "");
        if (telefono === "") {
            mostrarError("telefono", "Debe escribir su teléfono.");
            valido = false;
        } else if (!/^\d{8}$/.test(soloNumeros)) {
            mostrarError("telefono", "El teléfono debe tener 8 números.");
            valido = false;
        }

        if (motivo === "") {
            mostrarError("motivo", "Seleccione un motivo de contacto.");
            valido = false;
        }
        if (mensaje === "") {
            mostrarError("mensaje", "Debe escribir un mensaje.");
            valido = false;
        } else if (mensaje.length < 10) {
            mostrarError("mensaje", "El mensaje es muy corto (mínimo 10 caracteres).");
            valido = false;
        }

        if (!valido) {
            alert("Debe completar los campos obligatorios.");
            return;
        }

        exito.textContent = "Gracias, " + nombre + ". Su mensaje fue enviado correctamente.";
        exito.style.display = "block";
        formulario.reset();
    });
}
