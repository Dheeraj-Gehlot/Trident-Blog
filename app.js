 
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import flash from 'connect-flash';
import path from 'path';
import cors from 'cors';  
import router from './routes/routes.js';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload'; 
import morgan from 'morgan'; // Import morgan for logging


const app = express(); 
mongoose.Promise = global.Promise 
global.BASEPATH = process.cwd(); 
app.set('trust proxy', true);
dotenv.config()
 
// Connect to MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
 

// Middleware
app.use(fileUpload({
    createParentPath: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(morgan('dev'));
// app.use(cors()); 
app.use((err, req, res, next) => { 
    res.status(err.status || 500);
    res.json({
        code: 500,
        message: "Server Issue, Please Try Again Later"
    });
});
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(express.static(path.join(BASEPATH, '/public')));

// Global Variables for Flash Messages  
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// EJS
app.set('view engine', 'ejs');

// Routes 
app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
