import jwt from 'jsonwebtoken';

export default function AuthMiddleware(req, res, next) {
    // Obtener el token desde el encabezado Authorization
    const authHeader = req.header('Authorization');

    // Verificar si existe el encabezado Authorization
    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // El authHeader tiene el formato "Bearer <token>", así que necesitamos extraer la parte del token
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ msg: 'Token format is not valid' });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}
