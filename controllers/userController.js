import { matchPassword, createToken } from "../helper/helper.js";
import { CategoryMoldel } from "../models/categoryModel.js";
import { PostDetails } from "../models/postModel.js";
import { UserDetails } from '../models/User.js';
import schema from '../validation/schema.js'
import fs from 'fs';
import path from 'path';


// Render Dashboard
const renderDashboard = async (req, res, next) => {
    // let PostTabel = await PostDetails;
    res.render('dashboard');
};

// Render Login Page
const renderLoginPage = (req, res) => {

    res.render('login', {
        loginUrl: process.env.DOMAIN + '/login',
        HomeUrl: process.env.DOMAIN + '/',
        SignupUrl: process.env.DOMAIN + '/signup',
    });
};


const login = async (req, res, next) => {
    let request = req?.body;
    let errors = [];
    const { email, password } = req.body;
    console.log(req?.body, "chekc");

    // Check required fields
    if (!email || !password) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }


    if (errors.length > 0) {
        return res.status(400).json({
            status: false,
            errors: errors,
        })
    } else {
        try {
            let user = await UserDetails.findOne({ email: request?.email }, { email: 1, password: 1, password_salt: 1 });
            if (!user) {
                errors.push({ msg: 'Email is not registered' });
                console.log(errors, "errors");
                return res.status(400).json({
                    status: false,
                    errors: errors,
                })
            } else {

                let pass = matchPassword(request?.password, user?.password, user?.password_salt);
                console.log(pass, "pass");
                if (!pass) {
                    errors.push({ msg: 'Password is not correct' });
                    return res.status(400).json({
                        status: false,
                        errors: errors,
                    })
                } else {
                    let token = createToken(user?._id?.toString());
                    return res.status(200).json({
                        status: true,
                        message: "User Logged In Successfully",
                        token: token
                    });
                }
            }
        } catch (error) {
            errors.push({ msg: error.message });
            return res.status(400).json({
                status: false,
                errors: errors,
            });
        }
    }
};

const createblog = async (req, res, next) => {
    let request = req?.body;
    let errors = [];

    // Check required fields
    if (!request?.Title || !request?.Seo_Meta_Title || !request?.Heading || !request?.Description || !request?.Category) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Handle image upload
    let imagePath = '';
    if (req.file) {
        // Folder name based on blog title (slugify for safety) 
        const blogDir = path.join(process.cwd(), 'public', 'blog');
        if (!fs.existsSync(blogDir)) {
            fs.mkdirSync(blogDir, { recursive: true });
        }
        const ext = path.extname(req.file.originalname);
        const fileName = Date.now() + ext;
        const destPath = path.join(blogDir, fileName);
        fs.writeFileSync(destPath, req.file.buffer);
        imagePath = `/images/blog/${fileName}`;
    }

    if (errors.length > 0) {
        return res.status(400).json({
            status: false,
            errors: errors,
        });
    } else {
        try {
            let blog = new PostDetails({
                Title: request?.Title,
                Seo_Meta_Title: request?.Seo_Meta_Title,
                Heading: request?.Heading,
                Description: request?.Description,
                Image: imagePath, // Save image path in DB
                Category: request?.Category
            });
            await blog.save();
            return res.status(200).json({
                status: true,
                message: "Blog created successfully"
            });
        } catch (error) {
            errors.push({ msg: error.message });
            return res.status(400).json({
                status: false,
                errors: errors,
            });
        }
    }
};

const editblog = async (req, res, next) => {
    let request = req?.body;
    let errors = [];

    // Check required fields
    if (!request?.id || !request?.Title || !request?.Seo_Meta_Title || !request?.Heading || !request?.Description || !request?.Category) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            status: false,
            errors: errors,
        });
    } else {
        try {
            let blog = await PostDetails.findByIdAndUpdate(request?.id, {
                Title: request?.Title,
                Seo_Meta_Title: request?.Seo_Meta_Title,
                Heading: request?.Heading,
                Description: request?.Description,
                // Image: imagePath, // Save image path in DB
                Category: request?.Category
            });
            if (!blog) {
                errors.push({ msg: 'Blog not found' });
                return res.status(404).json({
                    status: false,
                    errors: errors,
                });
            }
            return res.status(200).json({
                status: true,
                message: "Blog updated successfully"
            });
        } catch (error) {
            errors.push({ msg: error.message });
            return res.status(400).json({
                status: false,
                errors: errors,
            });
        }
    }
};

const viewblog = async (req, res, next) => {
    let request = req?.query;
    let errors = [];

    // Check required fields
    if (!request?.id) {
        errors.push({ msg: 'Blog ID is required' });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            status: false,
            errors: errors,
        });
    } else {
        try {
            let blog = await PostDetails.findById(request?.id);
            if (!blog) {
                errors.push({ msg: 'Blog not found' });
                return res.status(404).json({
                    status: false,
                    errors: errors,
                });
            }
            return res.status(200).json({
                status: true,
                blog: blog
            });
        } catch (error) {
            errors.push({ msg: error.message });
            return res.status(400).json({
                status: false,
                errors: errors,
            });
        }
    }
};

const deleteblog = async (req, res, next) => {
    let request = req?.query;
    let errors = [];

    // Check required fields
    if (!request?.id) {
        errors.push({ msg: 'Blog ID is required' });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            status: false,
            errors: errors,
        });
    } else {
        try {
            let blog = await PostDetails.findByIdAndDelete(request?.id);
            if (!blog) {
                errors.push({ msg: 'Blog not found' });
                return res.status(404).json({
                    status: false,
                    errors: errors,
                });
            }
            return res.status(200).json({
                status: true,
                message: "Blog deleted successfully"
            });
        } catch (error) {
            errors.push({ msg: error.message });
            return res.status(400).json({
                status: false,
                errors: errors,
            });
        }
    }
};

const blogList = async (req, res, next) => {
    try {
        let blogs = await PostDetails.find();
        return res.status(200).json({
            blogs: blogs
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            errors: [{ msg: error.message }],
        });
    }
};

const createCategory = async (req, res, next) => {
    let request = req?.body;
    let errors = [];
    // Check required fields
    if (!request?.name) {
        errors.push({ msg: 'Please fill in all fields' });
    }
    if (errors.length > 0) {
        return res.status(400).json({
            status: false,
            errors: errors,
        });
    } else {
        try {
            let category = new CategoryMoldel({
                name: request?.name,
            });
            await category.save();
            return res.status(200).json({
                status: true,
                message: "Category created successfully"
            });
        } catch (error) {
            errors.push({ msg: error.message });
            return res.status(400).json({
                status: false,
                errors: errors,
            });
        }
    }
};

const getCategories = async (req, res, next) => {
    try {
        let categories = await CategoryMoldel.find();
        return res.status(200).json({
            status: true,
            categories: categories
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            errors: [{ msg: error.message }],
        });
    }
};

const deleteCategory = async (req, res, next) => {
    let request = req?.query;
    let errors = [];

    // Check required fields
    if (!request?.id) {
        errors.push({ msg: 'Category ID is required' });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            status: false,
            errors: errors,
        });
    } else {
        try {
            let category = await CategoryMoldel.findByIdAndDelete(request?.id);
            if (!category) {
                errors.push({ msg: 'Category not found' });
                return res.status(404).json({
                    status: false,
                    errors: errors,
                });
            }
            return res.status(200).json({
                status: true,
                message: "Category deleted successfully"
            });
        } catch (error) {
            errors.push({ msg: error.message });
            return res.status(400).json({
                status: false,
                errors: errors,
            });
        }
    }
};

const updateCategory = async (req, res, next) => {
    let request = req?.body;
    let errors = [];
    // Check required fields
    if (!request?.id || !request?.name) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            status: false,
            errors: errors,
        });
    } else {
        try {
            let category = await CategoryMoldel.findByIdAndUpdate(request?.id, {
                name: request?.name,
            });
            if (!category) {
                errors.push({ msg: 'Category not found' });
                return res.status(404).json({
                    status: false,
                    errors: errors,
                });
            }
            return res.status(200).json({
                status: true,
                message: "Category updated successfully"
            });
        } catch (error) {
            errors.push({ msg: error.message });
            return res.status(400).json({
                status: false,
                errors: errors,
            });
        }
    }
};

const viewcategory = async (req, res, next) => {
    let request = req?.query;
    let errors = [];

    // Check required fields
    if (!request?.id) {
        errors.push({ msg: 'Category ID is required' });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            status: false,
            errors: errors,
        });
    } else {
        try {
            let category = await CategoryMoldel.findById(request?.id);
            if (!category) {
                errors.push({ msg: 'Category not found' });
                return res.status(404).json({
                    status: false,
                    errors: errors,
                });
            }
            return res.status(200).json({
                status: true,
                category: category
            });
        } catch (error) {
            errors.push({ msg: error.message });
            return res.status(400).json({
                status: false,
                errors: errors,
            });
        }
    }
};

export {
    renderDashboard,
    renderLoginPage,
    login,
    createblog,
    editblog,
    viewblog,
    deleteblog,
    blogList,
    createCategory,
    getCategories,
    deleteCategory,
    updateCategory,
    viewcategory
};