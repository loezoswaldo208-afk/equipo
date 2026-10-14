const STORAGE_KEY = 'registros_app_data_v2';

const registrosIniciales = [
  { id: 1, nombre: 'Paco memo', descripcion: 'Primer registro de muestra', estado: 'Activo' },
  { id: 2, nombre: 'El Jona', descripcion: 'Segundo registro de muestra', estado: 'Pendiente' },
  { id: 3, nombre: 'Saul bb', descripcion: 'Tercer registro de muestra', estado: 'Inactivo' }
];

let registros = cargarRegistros();
let siguienteId = registros.length > 0 ? Math.max(...registros.map(r => r.id)) + 1 : 1;

const formulario = document.getElementById('formularioRegistro');
const cuerpoTabla = document.getElementById('cuerpoTabla');
const campoId = document.getElementById('idRegistro');
const campoNombre = document.getElementById('nombre');
const campoDescripcion = document.getElementById('descripcion');
const campoEstado = document.getElementById('estado');
const tituloFormulario = document.getElementById('tituloFormulario');
const botonGuardar = document.getElementById('botonGuardar');
const botonLimpiar = document.getElementById('botonLimpiar');
const totalRegistros = document.getElementById('totalRegistros');
const buscar = document.getElementById('buscar');
const mensajeVacio = document.getElementById('mensajeVacio');

function cargarRegistros() {
  try {
    const datos = localStorage.getItem(STORAGE_KEY);
    return datos ? JSON.parse(datos) : [...registrosIniciales];
  } catch {
    return [...registrosIniciales];
  }
}

function guardarRegistros() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
}

function escaparHTML(texto) {
  if (typeof texto !== 'string') return '';
  const mapa = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return texto.replace(/[&<>"']/g, c => mapa[c]);
}

function dibujarTabla() {
  const filtro = buscar ? buscar.value.toLowerCase().trim() : '';
  const filtrados = registros.filter(r =>
    r.nombre.toLowerCase().includes(filtro) ||
    r.descripcion.toLowerCase().includes(filtro) ||
    r.estado.toLowerCase().includes(filtro)
  );

  cuerpoTabla.innerHTML = '';

  filtrados.forEach(registro => {
    const fila = document.createElement('tr');
    const claseEstado = registro.estado.toLowerCase();

    fila.innerHTML = `
      <td>${registro.id}</td>
      <td>${escaparHTML(registro.nombre)}</td>
      <td>${escaparHTML(registro.descripcion)}</td>
      <td><span class="estado ${claseEstado}">${escaparHTML(registro.estado)}</span></td>
      <td>
        <div class="botones-tabla">
          <button type="button" class="boton-icono" aria-label="Editar registro ${registro.id}" title="Editar" data-editar="${registro.id}">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button type="button" class="boton-icono eliminar" aria-label="Eliminar registro ${registro.id}" title="Eliminar" data-eliminar="${registro.id}">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </td>
    `;
    cuerpoTabla.appendChild(fila);
  });

  if (totalRegistros) {
    totalRegistros.textContent = registros.length;
  }

  if (mensajeVacio) {
    mensajeVacio.hidden = filtrados.length !== 0;
  }
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
    registros = registros.map(r => (r.id === id ? { id, ...datos } : r));
  } else {
    registros.push({ id: siguienteId++, ...datos });
  }

  guardarRegistros();
  limpiarFormulario();
  dibujarTabla();
});

cuerpoTabla.addEventListener('click', evento => {
  const botonEditar = evento.target.closest('[data-editar]');
  const botonEliminar = evento.target.closest('[data-eliminar]');

  if (botonEditar) {
    const id = Number(botonEditar.dataset.editar);
    const registro = registros.find(item => item.id === id);
    if (!registro) return;

    campoId.value = registro.id;
    campoNombre.value = registro.nombre;
    campoDescripcion.value = registro.descripcion;
    campoEstado.value = registro.estado;

    tituloFormulario.textContent = 'Actualizar registro';
    botonGuardar.innerHTML = '<span class="material-symbols-outlined">save</span> Guardar cambios';
    formulario.scrollIntoView({ behavior: 'smooth', block: 'center' });
    campoNombre.focus();
  }

  if (botonEliminar) {
    const id = Number(botonEliminar.dataset.eliminar);
    if (confirm('¿Quieres eliminar este registro?')) {
      registros = registros.filter(r => r.id !== id);
      guardarRegistros();

      if (Number(campoId.value) === id) {
        limpiarFormulario();
      }

      dibujarTabla();
    }
  }
});

if (botonLimpiar) {
  botonLimpiar.addEventListener('click', limpiarFormulario);
}

if (buscar) {
  buscar.addEventListener('input', dibujarTabla);
}

dibujarTabla();