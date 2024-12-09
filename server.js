import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import path from 'path';
import express from 'express';
import cors from 'cors';
import { UserRoute } from "./routes/api/User.route.js";
import { ProductRoute } from "./routes/api/Product.route.js";
import {seedProducts} from "./config/seedProducts.js";

/*============================[Config]==========================*/
const app = express();

const corsOptions = {
    // origin: 'https://budgetapp-front.netlify.app/',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// seedProducts();
/*============================[Routes]============================*/
app.use('/api/user', new UserRoute());
app.use('/api/product', new ProductRoute());

/*============================[Server]============================*/
const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const server = app.listen(PORT, () => {
    console.log(`🚀 Server started on port  ${server.address().port}`);
});
server.on('error', (error) => console.log(`Error on server ${error}`));
