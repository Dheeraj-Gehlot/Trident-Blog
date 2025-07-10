import jwt from 'jsonwebtoken';
import mongoose from "mongoose"

const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    try {
        if (!token && req.originalUrl !== `/blog-list` && req.originalUrl !== `/view-blog`) {
            return res.status(403).send({ status: false, message: "A token is required for authentication" });
        };

        if (token) {
            let Admin = mongoose.model('user');
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            req.user = decoded;
            var dt = await Admin.exists({ _id: req.user.id, role: "superadmin" });
            if (!dt) {
                return res.status(401).send({ status: false, message: "Authentication failed" });
            };
        };
    } catch (err) {
        return res.status(401).send({ status: false, message: "Invalid Token", err: err.message });
    };
    return next();
};

export default verifyToken;
