import express from 'express';
import { check } from 'express-validator';
import UserController from '../../controllers/user.controller.js';
import AuthMiddleware from "../../middlewares/auth.middleware.js";
import AdminMiddleware from "../../middlewares/Admin.Middleware.js";

export class UserRoute extends express.Router {
    constructor() {
        super();
        this.userController = new UserController();

        //@route    GET api/user/me
        //@desc     Get user by email
        //@access   Public
        this.get('/me',
            AuthMiddleware,
            this.userController.GetUser);

        //@route    POST api/user
        //@desc     Register User
        //@access   Public
        this.post(
            '/',
            [
                check('email', 'Please include a valid email').isEmail(),
                check('password', 'Please enter a password with 6 or more characters').isLength({
                    min: 6,
                }),
            ],
            this.userController.CreateUser
        );

        //@route    POST api/user/auth
        //@desc     Authenticate user & get token
        //@access   Public
        this.post(
            '/login',
            [
                check('email', 'Please include a valid email.').isEmail(),
                check('password', 'Please enter a password.').exists(),
                check('password', 'Please enter a valid password.').isLength({
                    min: 3,
                }),
            ],
            this.userController.LoginUser
        );

        //@route    PUT api/user
        //@desc     Update user (roleId, image)
        //@access   Private
        this.put('/:email',
            AuthMiddleware,
            AdminMiddleware,
            this.userController.UpdateUser);

        // DELETE /api/user/:email (Delete user)
        this.delete('/:email',
            AuthMiddleware,
            AdminMiddleware,
            this.userController.DeleteUser);
    }
}