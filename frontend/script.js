document.addEventListener('DOMContentLoaded', () => {

    // --- VARIABLES GLOBALES ---
    // IMPORTANTE: Esta URL es para tus pruebas locales.
    // ¡¡Después la cambiaremos por la de Render!!
    const API_URL = 'http://localhost:3000/api/tareas'; 

    const form = document.getElementById('tarea-form');
    const inputTitulo = document.getElementById('titulo-tarea');
    const inputId = document.getElementById('tarea-id');
    const listaTareas = document.getElementById('lista-tareas');
    const btnSubmit = document.getElementById('btn-submit');

    // --- FUNCIONES CRUD (USANDO ASYNC/AWAIT Y PROMISES) ---

    // READ (GET) - Cargar todas las tareas
    async function cargarTareas() {
        try {
            // fetch() devuelve una Promise. 'await' espera a que se resuelva.
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`Error: ${response.status}`);

            // .json() también devuelve una Promise. 'await' espera los datos.
            const tareas = await response.json();

            mostrarTareasEnDOM(tareas);

        } catch (error) {
            // Esto es el equivalente al .catch() de una Promise
            console.error('Error al cargar tareas:', error);
            listaTareas.innerHTML = '<li>Error al cargar las tareas.</li>';
        }
    }

    // CREATE (POST) - Crear una nueva tarea
    async function crearTarea(titulo) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ titulo: titulo })
            });

            if (!response.ok) throw new Error(response.statusText);

            cargarTareas(); // Recargamos la lista

        } catch (error) {
            console.error('Error al crear tarea:', error);
        }
    }

    // DELETE (DELETE) - Eliminar una tarea
    async function eliminarTarea(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error(response.statusText);

            cargarTareas(); // Recargamos la lista

        } catch (error) {
            console.error('Error al eliminar tarea:', error);
        }
    }

    // UPDATE (PUT) - Actualizar una tarea
    async function actualizarTarea(id, titulo) {
         try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo: titulo })
            });

            if (!response.ok) throw new Error(response.statusText);

            cargarTareas(); // Recargamos la lista

        } catch (error) {
            console.error('Error al actualizar tarea:', error);
        }
    }

    // --- Funciones del DOM (para pintar en pantalla) ---
    function mostrarTareasEnDOM(tareas) {
        listaTareas.innerHTML = ''; // Limpiar lista

        if (tareas.length === 0) {
            listaTareas.innerHTML = '<li>No hay tareas pendientes.</li>';
            return;
        }

        tareas.forEach(tarea => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${tarea.titulo}</span>
                <div class="acciones">
                    <button class="btn-editar" data-id="${tarea._id}" data-titulo="${tarea.titulo}">Editar</button>
                    <button class="btn-eliminar" data-id="${tarea._id}">Eliminar</button>
                </div>
            `;
            listaTareas.appendChild(li);
        });
    }

    // --- Event Listeners (Escuchadores de eventos) ---

    // Listener para el formulario (Crear o Actualizar)
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const titulo = inputTitulo.value.trim();
        const id = inputId.value;

        if (!titulo) return;

        if (id) {
            actualizarTarea(id, titulo);
        } else {
            crearTarea(titulo);
        }

        // Limpiar formulario
        form.reset();
        inputId.value = '';
        btnSubmit.textContent = 'Agregar';
    });

    // Listener para botones de la lista (Editar o Eliminar)
    listaTareas.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-eliminar')) {
            const id = e.target.dataset.id;
            if (confirm('¿Estás seguro de eliminar esta tarea?')) {
                eliminarTarea(id);
            }
        }

        if (e.target.classList.contains('btn-editar')) {
            const id = e.target.dataset.id;
            const titulo = e.target.dataset.titulo;

            inputTitulo.value = titulo;
            inputId.value = id;
            btnSubmit.textContent = 'Actualizar';
            inputTitulo.focus();
        }
    });

    // --- Carga Inicial ---
    cargarTareas();
});
