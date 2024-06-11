import Joi from 'joi'; 

const register = Joi.object({
    name : Joi.string().required(), 
    email :Joi.string().email().required(),
    password : Joi.string().required().min(8)
})

// const login =Joi.object({
//     email :Joi.string().email().required(),
//     password : Joi.string().required().min(8)
// })

// const changePassword = Joi.object({
//     old_password:Joi.string().required().min(8),
//     new_password:Joi.string().required().min(8), 
// })

// const editUserByAdmin =Joi.object({
//     id:Joi.string().required(),
//     first_name : Joi.string().required(),
//     last_name: Joi.string().required(),
//     email :Joi.string().email().required(),
//     password : Joi.string().min(8)
// })
export default {
    register, 
}