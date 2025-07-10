import mongoose from 'mongoose';
import { UserDetails } from '../models/User.js';
import { configDotenv } from 'dotenv';
import { genratePassword } from '../helper/helper.js';

configDotenv();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected successfully.`);
        await defaultSetUp();
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error}`);
    };
};

const defaultSetUp = async () => {
    try {
        const checkAdmin = await UserDetails.findOne({ email: "superadmin@yopmail.com" });
        if (!checkAdmin) {
            let password = genratePassword("superadmin123");
            await UserDetails.create({
                email: "superadmin@yopmail.com",
                password_salt: password.password_salt,
                password: password.password,
                name: "Super Admin",
                role: "superadmin",
            });
            console.log(`Super admin created successfully.`);
        };
    } catch (error) {
        console.error(`Error creating super admin: ${error}`);
    } finally {
        mongoose.disconnect();
    }
};

defaultSetUp();
connectDB();
