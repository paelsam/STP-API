import { Router } from "express";

import { Turno } from "../models/Turno.js";
import { Cliente } from "../models/Cliente.js";
import { Empleado } from "../models/Empleado.js";


const router = Router();


// Obteniendo todos los turnos
router.get('/', async (req, res) => {
    try {
        const turnos = await Turno.findAll({
            include: [{
                model: Cliente,
                as: 'cliente',
                attributes: ['id_cliente', 'nombre', 'numero_documento']
            },
            {
                model: Empleado,
                as: 'empleado',
                attributes: ['id_empleado', 'nombre']
            }]
        });
        res.json(turnos);
    } catch ({ message }) {
        res.status(500).json({ message })
    }
});

// Obteniendo un solo turno
router.get('/:id', async (req, res) => {
    const { id: id_turno } = req.params;
    try {
        const turno = await Turno.findByPk(id_turno);
        if (!turno)
            return res.status(404).json({ message: 'El turno no existe' });
        res.json(turno);
    } catch ({ message }) {
        res.status(500).json({ message })
    }
});

// Obteniendo un turno en base al documento de un cliente
router.get('/cliente/:numeroDocumento', async (req, res) => {
    const { numeroDocumento: numero_documento } = req.params;
    try {
        const turno = await Turno.findOne({
            include: [{
                model: Cliente,
                required: true,
                where: {
                    numero_documento
                },
                attributes: ['nombre', 'numero_documento']
            },
            {
                model: Empleado,
                required: true,
                attributes: ['nombre']
            }]
        })
        if (!turno)
            return res.status(404).json({ message: 'El turno no existe' });
        res.json(turno);
    } catch ({ message }) {
        res.status(500).json({ message })
    }
})

// Obteniendo un turno en base al correo del empleado
router.get('/empleado/:correo', async (req, res) => {
    const { correo } = req.params;
    try {
        const turno = await Turno.findAll({
            include: [{
                model: Cliente,
                required: true,
                attributes: ['nombre', 'numero_documento']
            },
            {
                model: Empleado,
                required: true,
                where: {
                    correo
                },
                attributes: ['nombre']
            }]
        })
        if (!turno)
            return res.status(404).json({ message: 'El turno no existe' });
        res.json(turno);
    } catch ({ message }) {
        res.status(500).json({ message })
    }
})

// Creando un turno
router.post('/', async (req, res) => {
    const { id_cliente, id_empleado, id_servicio } = req.body;

    try {
        // Verificación de datos vacíos
        const verify = [id_cliente, id_empleado, id_servicio]
            .some(element => element === undefined);
        if (verify)
            return res.status(400).json({
                message: "Uno o más campos vacíos"
            });

        // Verificar si el cliente ya tiene un turno asignado
        const turnoExiste = await Turno.findOne({ where: { id_cliente } });
        if (turnoExiste)
            return res.status(400).json({
                message: "Ya tienes un turno asignado"
            });

        const turnos = await Turno.create({ id_cliente, id_empleado, id_servicio })

        res.json(turnos);
    } catch ({ message }) {
        res.status(500).json({ message });
    }
});

// Eliminando un turno
router.delete('/:id', async (req, res) => {
    const { id: id_turno } = req.params;
    try {
        await Turno.destroy({ where: { id_turno } });
        res.sendStatus(204);
    } catch ({ message }) {
        res.status(500).json({ message });
    }
});

// Actualizando un turno
router.put('/:id', async (req, res) => {
    const { id: id_turno } = req.params;
    try {
        const turno = await Turno.findByPk(id_turno);
        turno.set(req.body);
        await turno.save();
        res.json(turno);
    } catch ({ message }) {
        res.status(500).json({ message });
    }

})


export default router;