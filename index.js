const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const cookie = require('cookie-parser');
require('dotenv').config();
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const categoryRoute = require('./routes/categories');

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}));
app.use(cookie());


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
app.use('/api/posts', postRoute);
app.use('/api/categories', categoryRoute);


app.listen(PORT, () => console.log('API Server is running on port ' + PORT));