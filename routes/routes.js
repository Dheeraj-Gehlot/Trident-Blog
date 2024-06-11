import express from 'express';
const router = express.Router();

import { renderHomePage, renderLoginPage, renderSignupPage,   register  } from '../controllers/userController.js';

// Home Page
router.get('/', renderHomePage);

// Login Page
router.get('/login', renderLoginPage);

// Signup Page
router.get('/signup', renderSignupPage);

// Signup Handle
router.post('/signup', register);


export default router;
 
