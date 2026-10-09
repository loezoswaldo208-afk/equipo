let registros = [
    { id: 1, nombre: 'Ejemplo uno', descripcion: 'Primer registro de muestra', estado: 'Activo' },
    { id: 2, nombre: 'Ejemplo dos', descripcion: 'Segundo registro de muestra', estado: 'Pendiente' },
    { id: 3, nombre: 'Ejemplo tres', descripcion: 'Tercer registro de muestra', estado: 'Inactivo' }
];
let siguienteId = 4;

const formulario = document.getElementById('formularioRegistro');
const cuerpoTabla = document.getElementById('cuerpoTabla');
const campoId = document.getElementById('idRegistro');
const campoNombre = document.getElementById('nombre');
const campoDescripcion = document.getElementById('descripcion');
const campoEstado = document.getElementById('estado');
const tituloFormulario = document.getElementById('tituloFormulario');
const botonGuardar = document.getElementById('botonGuardar');
const totalRegistros = document.getElementById('totalRegistros');
const buscar = document.getElementById('buscar');
const mensajeVacio = document.getElementById('mensajeVacio');

function dibujarTabla() {
    const filtro = buscar.value.toLowerCase().trim();
    const filtrados = registros.filter(registro =>
        registro.nombre.toLowerCase().includes(filtro) ||
        registro.descripcion.toLowerCase().includes(filtro) ||
        registro.estado.toLowerCase().includes(filtro)
    );

    cuerpoTabla.innerHTML = '';
    filtrados.forEach(registro => {
        const fila = document.createElement('tr');
        const claseEstado = registro.estado.toLowerCase();
        fila.innerHTML = `
            <td>${registro.id}</td>
            <td>${escaparHTML(registro.nombre)}</td>
            <td>${escaparHTML(registro.descripcion)}</td>
            <td><span class="estado ${claseEstado}">${registro.estado}</span></td>
            <td>
                <section class="botones-tabla">
                    <button type="button" class="boton-icono" aria-label="Editar registro ${registro.id}" title="Editar" data-editar="${registro.id}"><span class="material-symbols-outlined">edit</span></button>
                    <button type="button" class="boton-icono eliminar" aria-label="Eliminar registro ${registro.id}" title="Eliminar" data-eliminar="${registro.id}"><span class="material-symbols-outlined">delete</span></button>
                </section>
            </td>`;
        cuerpoTabla.appendChild(fila);
    });

    totalRegistros.textContent = registros.length;
    mensajeVacio.hidden = filtrados.length !== 0;
}

function escaparHTML(texto) {
    return texto.replace(/[&<>"']/g, caracter => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[caracter]);
}

function limpiarFormulario() {
    formulario.reset();
    campoId.value = '';
    tituloFormulario.textContent = 'Insertar registro';
    botonGuardar.innerHTML = '<span class="material-symbols-outlined">add</span> Agregar';
}

formulario.addEventListener('submit', evento => {
    evento.preventDefault();
    const datos = {
        nombre: campoNombre.value.trim(),
        descripcion: campoDescripcion.value.trim(),
        estado: campoEstado.value
    };

    if (!datos.nombre || !datos.descripcion) return;

    if (campoId.value) {
        const id = Number(campoId.value);
        registros = registros.map(registro => registro.id === id ? { id, ...datos } : registro);
    } else {
        registros.push({ id: siguienteId++, ...datos });
    }

    limpiarFormulario();
    dibujarTabla();
});

cuerpoTabla.addEventListener('click', evento => {
    const botonEditar = evento.target.closest('[data-editar]');
    const botonEliminar = evento.target.closest('[data-eliminar]');

    if (botonEditar) {
        const registro = registros.find(item => item.id === Number(botonEditar.dataset.editar));
        if (!registro) return;
        campoId.value = registro.id;
        campoNombre.value = registro.nombre;
        campoDescripcion.value = registro.descripcion;
        campoEstado.value = registro.estado;
        tituloFormulario.textContent = 'Actualizar registro';
        botonGuardar.innerHTML = '<span class="material-symbols-outlined">save</span> Guardar cambios';
        formulario.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (botonEliminar) {
        const id = Number(botonEliminar.dataset.eliminar);
        if (confirm('¿Quieres eliminar este registro?')) {
            registros = registros.filter(registro => registro.id !== id);
            if (Number(campoId.value) === id) limpiarFormulario();
            dibujarTabla();
        }
    }
});

document.getElementById('botonLimpiar').addEventListener('click', limpiarFormulario);
buscar.addEventListener('input', dibujarTabla);
dibujarTabla();
