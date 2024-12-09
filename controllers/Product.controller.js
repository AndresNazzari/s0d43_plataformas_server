import ProductService from "../services/Product.service.js";
import {validationResult} from "express-validator";

export default class ProductController {
    constructor() {
        this.productService = new ProductService();

        this.CreateProduct = this.CreateProduct.bind(this);
        this.GetAllProducts = this.GetAllProducts.bind(this);
        this.GetProductById = this.GetProductById.bind(this);
        this.UpdateProduct = this.UpdateProduct.bind(this);
        this.DeleteProduct = this.DeleteProduct.bind(this);
    }

    async CreateProduct(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { category, description, image, price, rating, title, number } = req.body;
        try {
            const product = await this.productService.CreateProduct(
                { category, description, image, price, rating, title, number });
            res.status(200).json(product);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }

    async GetAllProducts(req, res) {
        try {
            const products = await this.productService.GetAllProducts();
            res.status(200).json(products);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }

    async GetProductById(req, res) {
        const { id } = req.params;
        try {
            const product = await this.productService.GetProductById(id);
            if (!product) {
                return res.status(404).json({ msg: 'Product not found' });
            }
            res.status(200).json(product);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }

    async UpdateProduct(req, res) {
        const { id } = req.params;
        const { category, description, image, price, rating, title, number } = req.body;
        try {
            const updatedProduct = await this.productService.UpdateProduct(id, { category, description, image, price, rating, title, number });
            if (!updatedProduct) {
                return res.status(404).json({ msg: 'Product not found' });
            }
            res.status(200).json(updatedProduct);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }

    async DeleteProduct(req, res) {
        const { id } = req.params;
        try {
            const deleted = await this.productService.DeleteProduct(id);
            if (!deleted) {
                return res.status(404).json({ msg: 'Product not found' });
            }
            res.status(200).json({ msg: `Product with id ${id} deleted successfully.` });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }
}
