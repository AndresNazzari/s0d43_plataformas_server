import express from 'express';
import { check } from 'express-validator';
import ProductController from '../../controllers/Product.controller.js';
import AuthMiddleware from "../../middlewares/auth.middleware.js";
import AdminMiddleware from "../../middlewares/Admin.Middleware.js";

export class ProductRoute extends express.Router {
    constructor() {
        super();
        this.productController = new ProductController();

        //@route    GET /api/product
        //@desc     Get all products
        //@access   Public
        this.get('/', this.productController.GetAllProducts);

        //@route    GET /api/product/:id
        //@desc     Get product by id
        //@access   Public
        this.get('/:id', this.productController.GetProductById);

        //@route    POST /api/product
        //@desc     Create product
        //@access   Public
        // Aquí puedes agregar validaciones con express-validator si deseas
        this.post(
            '/',
            AuthMiddleware,
            AdminMiddleware,
            [
                check('title', 'Title is required').notEmpty(),
                check('price', 'Price must be a number').isNumeric(),
            ],
            this.productController.CreateProduct
        );

        //@route    PUT /api/product/:id
        //@desc     Update product
        //@access   Public
        this.put('/:id',
            AuthMiddleware,
            AdminMiddleware,
            this.productController.UpdateProduct);

        //@route    DELETE /api/product/:id
        //@desc     Delete product
        //@access   Public
        this.delete('/:id',
            AuthMiddleware,
            AdminMiddleware,
            this.productController.DeleteProduct);
    }
}