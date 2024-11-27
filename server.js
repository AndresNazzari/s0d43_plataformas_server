import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import path from 'path';
import express from 'express';
import cors from 'cors';

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

/*============================[Database]==========================*/
// await createDatabase();
// await createTables();

/*============================[Routes]============================*/
// app.use('/api/user', new UserRoute());
// app.use('/api/category', new CategoryRoute());
// app.use('/api/income', new IncomeRoute());
// app.use('/api/expense', new ExpenseRoute());

/*============================[Server]============================*/
const PORT = process.env.PORT || 8080;

//Serve static assters in production
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
