import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    // Comprobar que existe el token
    if (!req.headers.authorization)
        return res.status(401)
            .json({ message: "Acceso no autorizado" });
    else {
        // Comprobando la validez del token
        const token = req.headers.authorization.split(" ")[1];

        jwt.verify(token, process.env.SECRET_TOKEN, (error, decoded) => {
            if (error)
                return res.status(500).json({ message: "Ha ocurrido un error al decodificar los datos:", error });
            else
                next();
        });
    }
}