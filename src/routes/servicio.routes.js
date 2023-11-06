import { Router } from "express";
import { Servicio } from "../models/Servicio.js";


const router = Router();

// Obteniendo todos los servicio
router.get('/', async (req, res) => {
    try {
        const servicios = await Servicio.findAll();
        res.json(servicios);
    } catch ({ message }) {
        res.status(500).json({ message })
    }

});

// Obteniendo un solo servicio
router.get('/:id', async (req, res) => {
    const { id: id_servicio } = req.params;
    try {
        const servicio = await Servicio.findByPk(id_servicio);
        if (!servicio)
            return res.status(404).json({ message: 'El servicio no existe' });
        res.json(servicio);
    } catch ({ message }) {
        res.status(500).json({ message })
    }
});

// Creando un servicio
router.post('/', async (req, res) => {
    const { nombre, descripcion, imagen, tiempo_servicio } = req.body;

    try {
        // Verificación de datos vacíos
        const verify = [nombre, descripcion, imagen, tiempo_servicio]
                        .some(element => element === undefined);
        if (verify)
            return res.status(400).json({
                message: "Uno o más campos vacíos"
            });

        // Verificar si el servicio ya existe
        const servicioExiste = await Servicio.findOne({ where: { descripcion } });
        if (servicioExiste)
            return res.status(400).json({
                message: "El servicio ya existe"
            });

        const servicios = await Servicio.create({ nombre, descripcion, imagen, tiempo_servicio })

        res.json(servicios);
    } catch ({ message }) {
        res.status(500).json({ message });
    }
});

// Eliminando un servicio
router.delete('/:id', async (req, res) => {
    const { id: id_servicio } = req.params;
    try {
        await Servicio.destroy({ where: { id_servicio } });
        res.sendStatus(204);
    } catch ({ message }) {
        res.status(500).json({ message });
    }
});

// Actualizando un servicio
router.put('/:id', async (req, res) => {
    const { id: id_servicio } = req.params;
    try {
        const servicio = await Servicio.findByPk(id_servicio);
        servicio.set(req.body);
        await servicio.save();
        res.json(servicio);
    } catch ({ message }) {
        res.status(500).json({ message });
    }

})



export default router;