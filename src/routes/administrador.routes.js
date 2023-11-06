import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Administrador } from "../models/Administrador.js";


const router = Router();

// Obteniendo todos los administrador
router.get('/', async (req, res) => {
    try {
        const administradores = await Administrador.findAll();
        res.json(administradores);
    } catch ({ message }) {
        res.status(500).json({ message })
    }
})

// Obteniendo un solo administrador
router.get('/:id', async (req, res) => {
    const { id: id_administrador } = req.params;
    try {
        const administrador = await Administrador.findByPk(id_administrador);
        if (!administrador)
            return res.status(404).json({ message: 'El administrador no existe' });
        res.json(administrador);
    } catch ({ message }) {
        res.status(500).json({ message })
    }
})

// Creando un administrador
router.post('/', async (req, res) => {
    const { nombre, correo, password } = req.body;

    try {

        // Verificación de datos vacíos
        const verify = [nombre, correo, password].some(element => element === undefined);
        if (verify)
            return res.status(400).json({
                message: "Uno o más campos vacíos"
            });

        // Verificar si el administrador ya existe
        const administradorExiste = await Administrador.findOne({ where: { correo } });
        if (administradorExiste)
            return res.status(400).json({
                message: "El administrador ya existe"
            });

        if (password.length < 6)
            return res.status(400).json({
                message: "La contraseña debe tener mínimo 6 carácteres"
            })

        // Encriptando la contraseña
        const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));

        const administrador = await Administrador.create({
            nombre,
            correo,
            password: hashedPassword,
        });

        res.json(administrador);

    } catch ({ message }) {
        res.status(500).json({ message });
    }
});

// Eliminando un administrador
router.delete('/:id', async (req, res) => {
    const { id: id_administrador } = req.params;
    try {
        await Administrador.destroy({ where: { id_administrador } });
        res.sendStatus(204);
    } catch ({ message }) {
        res.status(500).json({ message });
    }
});

// Actualizando un administrador
router.put('/:id', async (req, res) => {
    const { id: id_administrador } = req.params;
    try {
        const administrador = await Administrador.findByPk(id_administrador);
        administrador.set(req.body);
        await administrador.save();
        res.json(administrador);
    } catch ({ message }) {
        res.status(500).json({ message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { correo, password } = req.body;
    try {
        // Buscar administrador
        const administrador = await Administrador.findOne({ where: { correo } });
        if (!administrador)
            return res.status(404) 
                    .json({ message: "administrador no encontrado" });

        // Comparando contraseñas
        if(bcrypt.compareSync(password, administrador.password)) {
            // Devolvemos token
            const token = jwt.sign({ administrador }, process.env.SECRET_TOKEN, {
                expiresIn: process.env.EXPIRES_IN
            });
            res.json({ ...administrador.dataValues , token });
        } else {
            return res.status(401).json({ message: "Contraseña incorrecta"});
        }
    } catch ({ message }) {
        res.status(500).json({ message });
    }

});


export default router;