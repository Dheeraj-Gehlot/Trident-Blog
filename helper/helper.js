
import jwt from 'jsonwebtoken'; 
import crypto from 'crypto';
const genratePassword = (pass)=>{
    let password_salt = crypto.randomBytes(8).toString('base64');
    let password = crypto.pbkdf2Sync(pass,password_salt,1000,32,'sha512').toString('base64');
    return {password_salt,password}
}

const createToken = (id)=>{ 
    return jwt.sign({ id }, process.env.TOKEN_KEY, {
      expiresIn: '5minutes', // Token will expire in 5 minutes
    }); 
}

const matchPassword = (inputPass, storedHash, storedSalt) => {
    let hash = crypto.pbkdf2Sync(inputPass, storedSalt, 1000, 32, 'sha512').toString('base64');
    return hash === storedHash;
}


export {
    genratePassword,
    createToken,
    matchPassword
}