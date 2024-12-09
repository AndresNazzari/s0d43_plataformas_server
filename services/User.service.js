import jwt from "jsonwebtoken";
import { query, where, getDocs, addDoc, collection, updateDoc, deleteDoc, limit } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { db } from "../config/firebase.js";

export default class UserService {
    constructor() {
        this.UserCollection = collection(db, "users");
    }

    async UserExists(email) {
        const q = query(this.UserCollection, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.some(doc => doc.data().email === email);
    }

    async ComparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    async EncryptPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    GenerateToken(email, roleId, image) {
        const payload = { user: { email, roleId, image } };
        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 60*60*24*365,
        });
    }

    async CreateUser(email, roleId, image, passwordEncrypted) {
        await addDoc(this.UserCollection, {email, roleId, image, password: passwordEncrypted, created_at: new Date()});
    }

    async GetUser(email) {
        const q = query(this.UserCollection, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs[0].data();
    }

    async UpdateUser(email, updateData) {
        // Primero obtenemos la referencia del documento del usuario
        const q = query(this.UserCollection, where("email", "==", email), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new Error('User not found');
        }

        const userDoc = querySnapshot.docs[0];
        const userRef = userDoc.ref;

        // Actualizar el documento con los campos recibidos
        await updateDoc(userRef, updateData);
    }

    async DeleteUser(email) {
        const q = query(this.UserCollection, where("email", "==", email), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new Error('User not found');
        }

        const userDoc = querySnapshot.docs[0];
        await deleteDoc(userDoc.ref);
    }
}