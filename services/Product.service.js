import { query, where, orderBy, getDoc, doc, getDocs, addDoc, collection, updateDoc, deleteDoc, limit } from "firebase/firestore";
import { db } from "../config/firebase.js";

export default class ProductService {
    constructor() {
        this.ProductCollection = collection(db, "products");
    }

    async CreateProduct({ category, description, image, price, rating, title, number }) {
        const newProduct = { category, description, image, price, rating, title, number, created_at: new Date() };
        const docRef = await addDoc(this.ProductCollection, newProduct);
        return { id: docRef.id, ...newProduct };
    }

    async GetAllProducts() {
        const q = query(this.ProductCollection, orderBy('number', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }

    async GetProductById(id) {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return null;
        }
        return { id: docSnap.id, ...docSnap.data() };
    }

    async UpdateProduct(id, updateData) {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return null;
        }

        // Filtrar solo los campos que no sean undefined
        const validUpdates = {};
        for (const [key, value] of Object.entries(updateData)) {
            if (value !== undefined) {
                validUpdates[key] = value;
            }
        }

        if (Object.keys(validUpdates).length === 0) {
            // No hay nada que actualizar
            return await this.GetProductById(id);
        }

        await updateDoc(docRef, validUpdates);
        return await this.GetProductById(id);
    }

    async DeleteProduct(id) {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return false;
        }

        await deleteDoc(docRef);
        return true;
    }
}
