import express from 'express';
const router = express.Router();

import { renderDashboard, renderLoginPage, login,createblog,editblog,viewblog,deleteblog,blogList, createCategory,updateCategory,deleteCategory,getCategories,viewcategory } from '../controllers/userController.js';
import verifyToken from '../middleware/auth.js';
// Home Page
// router.get('/', renderHomePage);

// Login Page
router.get('/', renderLoginPage);
router.get('/dashboard', renderDashboard);

// Login Handle
router.post('/login', login);
router.post('/create-blog', verifyToken, createblog);
router.post('/edit-blog', verifyToken, editblog);
router.get('/view-blog', verifyToken, viewblog);
router.delete('/delete-blog', verifyToken, deleteblog);
router.get('/blog-list', verifyToken, blogList);

// category Page
router.post('/create-category', verifyToken, createCategory);
router.post('/edit-category', verifyToken, updateCategory);
router.get('/view-category', verifyToken, viewcategory);
router.delete('/delete-category', verifyToken, deleteCategory);
router.get('/category-list', verifyToken, getCategories);

export default router;
