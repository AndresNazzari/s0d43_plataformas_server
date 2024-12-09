import {POKEMONS} from './productMock.js';
import ProductService from '../services/Product.service.js';
import {db} from './firebase.js';

export async function seedProducts() {
    const productService = new ProductService();
    try {
        console.log('Seeding products...');
        for (const product of POKEMONS) {
            const createdProduct = await productService.CreateProduct(product);
            console.log('Product created:', createdProduct.title, 'with id:', createdProduct.id);
        }
        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1); // Salir con código de error
    }
    process.exit(0); // Salir con éxito
}

