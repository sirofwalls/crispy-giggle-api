const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users')

app.use(express.json());

const dbConnect = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
          });
    } catch (err) {
        console.log(err)
    }
};
dbConnect().then(console.log('Database is connected')).catch(err => console.log(err));

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);


app.listen('5000', () => console.log('API Server is running.'));