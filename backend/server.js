// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors()); // Permite peticiones de otros orígenes (nuestro frontend)
app.use(express.json()); // Permite a Express entender JSON

// --- Conexión a Mongo Atlas ---
// (Esta línea ya está correcta con tu contraseña)
const MONGO_URI = "mongodb+srv://admin_crud:elan123456@cluster0.tr6wnp9.mongodb.net/miBaseDeDatos?appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("Conectado a Mongo Atlas exitosamente"))
    .catch(err => console.error("Error al conectar a Mongo Atlas:", err));

// --- Modelo de Datos (Schema) ---
// Define la estructura de los datos en la colección 'tareas'
const TareaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    completada: { type: Boolean, default: false }
});

const Tarea = mongoose.model('Tarea', TareaSchema);

// --- RUTAS DE LA API (CRUD) ---

// CREATE (Crear)
app.post('/api/tareas', async (req, res) => {
    try {
        const nuevaTarea = new Tarea({
            titulo: req.body.titulo
        });
        const tareaGuardada = await nuevaTarea.save();
        res.status(201).json(tareaGuardada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// READ (Consultar)
app.get('/api/tareas', async (req, res) => {
    try {
        const tareas = await Tarea.find();
        res.json(tareas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE (Actualizar)
app.put('/api/tareas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const tareaActualizada = await Tarea.findByIdAndUpdate(id, req.body, { new: true });
        res.json(tareaActualizada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE (Eliminar)
app.delete('/api/tareas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Tarea.findByIdAndDelete(id);
        res.json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
