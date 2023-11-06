import { Router } from "express";
import bcrypt from "bcrypt";

import { Empleado } from "../models/Empleado.js";


const router = Router();

// Obteniendo todos los empleados
router.get('/', async (req, res) => {
    try {
        const empleados = await Empleado.findAll();
        res.json(empleados);
    } catch ({ message }) {
        res.status(500).json({ message })
    }
})

// Obteniendo un solo empleado
router.get('/:id', async (req, res) => {
    const { id: id_empleado } = req.params;
    try {
        const empleado = await Empleado.findByPk(id_empleado);
        if (!empleado)
            return res.status(404).json({ message: 'El empleado no existe' });
        res.json(empleado);
    } catch ({ message }) {
        res.status(500).json({ message })
    }
})

// Creando un empleado
router.post('/', async (req, res) => {
    const { nombre, telefono, correo, password } = req.body;

    try {

        // Verificación de datos vacíos
        const verify = [nombre, telefono, correo, password].some(element => element === undefined);
        if (verify)
            return res.status(400).json({
                message: "Uno o más campos vacíos"
            });

        // Verificar si el empleado ya existe
        const empleadoExiste = await Empleado.findOne({ where: { correo } });
        if (empleadoExiste)
            return res.status(400).json({
                message: "El empleado ya existe"
            });

        if (password.length < 6)
            return res.status(400).json({
                message: "La contraseña debe tener mínimo 6 carácteres"
            })

        // Encriptando la contraseña
        const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));

        const empleado = await Empleado.create({
            nombre,
            telefono,
            correo,
            password: hashedPassword,
        });

        res.json(empleado);

    } catch ({ message }) {
        res.status(500).json({ message });
    }
});

// Eliminando un empleado
router.delete('/:id', async (req, res) => {
    const { id: id_empleado } = req.params;
    try {
        await Empleado.destroy({ where: { id_empleado } });
        res.sendStatus(204);
    } catch ({ message }) {
        res.status(500).json({ message });
    }
});

// Actualizando un empleado
router.put('/:id', async (req, res) => {
    const { id: id_empleado } = req.params;
    try {
        const empleado = await empleado.findByPk(id_empleado);
        empleado.set(req.body);
        await empleado.save();
        res.json(empleado);
    } catch ({ message }) {
        res.status(500).json({ message });
    }
});


export default router;