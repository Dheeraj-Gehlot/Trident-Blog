import { genratePassword,createToken } from "../helper/helper.js";
import { PostDetails } from "../models/postModel.js";
import {UserDetails} from '../models/User.js';
import schema from '../validation/schema.js'
  

// Render Home Page
  const renderHomePage = async (req, res,next) => { 
    // let PostTabel = await PostDetails;
    
    await PostDetails.find().then((result,err)=>{
        if(!err){
            res.render('index',{
                loginUrl: process.env.DOMAIN + '/login',
                HomeUrl : process.env.DOMAIN + '/',
                SignupUrl : process.env.DOMAIN + '/login',
                posts: result
             });
        }
    })
};

// Render Login Page
  const renderLoginPage = (req, res) => {

    res.render('login',{
        loginUrl: process.env.DOMAIN + '/login',
        HomeUrl : process.env.DOMAIN + '/',  
        SignupUrl : process.env.DOMAIN + '/signup',
     });
};

// Render Signup Page
  const renderSignupPage = (req, res) => {
    res.render('signup',{
        loginUrl: process.env.DOMAIN + '/login',
        HomeUrl : process.env.DOMAIN + '/',  
        SignupUrl : process.env.DOMAIN + '/signup',
     });
};  

// Signup Handle
const register = async(req,res,next)=>{ 
    let request = req?.body;
    let errors = [];
    const { username, email, password, confirm_password } = req.body;
    
    // Check required fields
    if (!username || !email || !password || !confirm_password) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check passwords match
    if (password !== confirm_password) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }
    if (errors.length > 0) {
        res.render('signup', {
            errors,
            username,
            email,
            password,
            confirm_password
        });
    }
    try { 
        let checkuser = await UserDetails.findOne({email:request?.email},{email:1}); 
        if(checkuser?.email){
            errors.push({ msg: 'Email is already registered' });
            res.render('signup', {
                errors,
                username,
                email,
                password,
                confirm_password
            });
        }
        request.type = 'user';
        let pass = genratePassword(request?.password)
        _.extend(request,pass)
        let user = await UserDetails.create(request);
        let token = createToken(user?._id?.toString())
        return res.status(200).json({
            status:true,
            message :"user Cretaed"+ user?._id?.toString(),
            token :token
        }) 
    } catch (error) {  
        errors.push({ msg: error.message  });
            res.render('signup', {
                errors,
                username,
                email,
                password,
                confirm_password
            });
            
    }
}

  const signupUser = (req, res) => {
    const { username, email, password, confirm_password } = req.body;
    let errors = [];

    // Check required fields
    if (!username || !email || !password || !confirm_password) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check passwords match
    if (password !== confirm_password) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('signup', {
            errors,
            username,
            email,
            password,
            confirm_password
        });
    } else {
        // Validation passed
        User.findOne({ email: email }).then(user => {
            if (user) {
                // User exists
                errors.push({ msg: 'Email is already registered' });
                res.render('signup', {
                    errors,
                    username,
                    email,
                    password,
                    confirm_password
                });
            } else {
                const newUser = new User({
                    username,
                    email,
                    password
                });

                // Hash Password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    // Set password to hashed
                    newUser.password = hash;
                    // Save user
                    newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered and can log in');
                            res.redirect('/login');
                        })
                        .catch(err => console.log(err));
                }));
            }
        });
    }
};


export   {
    renderHomePage,
    renderLoginPage,
    renderSignupPage,
    register
}