import { Router } from "express";
import { Cliente } from "../models/Cliente.js";
import { auth } from "../middlewares/auth.middleware.js"

const router = Router();

// Obteniendo todos los clientes
router.get('/', auth ,async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.json(clientes);
    } catch ({ message }) {
        res.status(500).json({ message })
    }

})

// Obteniendo un solo cliente
router.get('/:id', auth ,async (req, res) => {
    const { id: id_cliente } = req.params;
    try {
        const cliente = await Cliente.findByPk(id_cliente);
        if (!cliente)
            return res.status(404).json({ message: 'El cliente no existe' });
        res.json(cliente);
    } catch ({ message }) {
        res.status(500).json({ message })
    }
})

// Creando un cliente
router.post('/', auth ,async (req, res) => {
    const { nombre, numero_documento, telefono, correo } = req.body;

    try {
        // Verificación de datos vacíos
        const verify = [nombre, numero_documento, telefono, correo].some(element => element === undefined);
        if (verify)
            return res.status(400).json({
                message: "Uno o más campos vacíos"
            });

        // Verificar si el cliente ya existe
        const clienteExiste = await Cliente.findOne({ where: { numero_documento } });
        if (clienteExiste)
            return res.status(400).json({
                message: "El cliente ya existe"
            });

        const cliente = await Cliente.create({
            nombre,
            numero_documento,
            telefono,
            correo
        })

        res.json(cliente);
    } catch ({ message }) {
        res.status(500).json({ message });
    }
});

// Eliminando un cliente
router.delete('/:id', auth ,async (req, res) => {
    const { id: id_cliente } = req.params;
    try {
        await Cliente.destroy({ where: { id_cliente } });
        res.sendStatus(204);
    } catch ({ message }) {
        res.status(500).json({ message });
    }
});

// Actualizando un cliente
router.put('/:id', auth, async (req, res) => {
    const { id: id_cliente } = req.params;
    try {
        const cliente = await Cliente.findByPk(id_cliente);
        cliente.set(req.body);
        await cliente.save();
        res.json(cliente);
    } catch ({ message }) {
        res.status(500).json({ message });
    }
});

export default router;