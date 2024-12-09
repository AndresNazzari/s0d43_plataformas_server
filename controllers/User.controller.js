import UserService from "../services/User.service.js";
import {validationResult} from "express-validator";

export default class UserController {
    constructor() {
        this.userService = new UserService();

        this.CreateUser = this.CreateUser.bind(this);
        this.LoginUser = this.LoginUser.bind(this);
        this.GetUser = this.GetUser.bind(this);
        this.UpdateUser = this.UpdateUser.bind(this);
        this.DeleteUser = this.DeleteUser.bind(this);

    }

    async CreateUser(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password, roleId, image } = req.body;

        try {
            const queryResult = await this.userService.UserExists(email);

            if (queryResult) {
                return res.status(400).json({ errors: [{ msg: 'Email already registered' }] });
            }

            const passwordEncrypted = await this.userService.EncryptPassword(password);
            await this.userService.CreateUser(email, roleId, image, passwordEncrypted);
            const token = this.userService.GenerateToken(email, roleId, image);

            res.status(200).json({ token });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }

    async LoginUser(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        try {
            const userExists = await this.userService.UserExists(email);

            if (!userExists) {
                return res.status(401).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }
            const user = await this.userService.GetUser(email);
            const isMatch = await this.userService.ComparePassword(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const token = this.userService.GenerateToken(email);

            res.status(200).json({ token });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }

    async GetUser(req, res) {
        try {
            const email = req.user.email;
            const user = await this.userService.GetUser(email);
            const { password, ...userWithoutPassword } = user;
            res.status(200).json({ userWithoutPassword });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }

    async UpdateUser(req, res) {
        const { roleId, image } = req.body;
        const { email } = req.params;

        try {
            const user = await this.userService.GetUser(email);

            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            // Preparar objeto con campos a actualizar
            const updateData = {};
            if (roleId) updateData.roleId = roleId;
            if (image) updateData.image = image;

            // Si no hay nada que actualizar
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ msg: 'No fields to update' });
            }

            // Llamar al service para actualizar
            await this.userService.UpdateUser(email, updateData);

            // Obtener el usuario actualizado
            const updatedUser = await this.userService.GetUser(email);
            if (!updatedUser) {
                return res.status(500).json({ msg: 'Error retrieving updated user' });
            }

            // Remover el password antes de responder
            const { password, ...userWithoutPassword } = updatedUser;
            res.status(200).json({ user: userWithoutPassword });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }

    async DeleteUser(req, res) {
        const { email } = req.params;

        try {
            const user = await this.userService.GetUser(email);
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            await this.userService.DeleteUser(email);
            res.status(200).json({ msg: `User with email ${email} deleted successfully.` });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }
}