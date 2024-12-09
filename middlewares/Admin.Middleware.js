import UserService from "../services/User.service.js";
import { ROLES } from "../config/roles.js";
export default async function AdminMiddleware(req, res, next) {
    try {
        const email = req.user.email;
        const userService = new UserService();
        const user = await userService.GetUser(email);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user.roleId !== ROLES.ADMIN) {
            return res.status(403).json({ msg: 'Not authorized to perform this action.' });
        }

        // Si el rol es Admin, continúa con la siguiente función del pipeline de rutas
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
}
