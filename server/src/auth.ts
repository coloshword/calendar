import jwt from 'jsonwebtoken'

export const authMiddleware = async (req: any, res: any , next:any) => {
    try {
        const token = await req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "RANDOM-TOKEN");
        const user = decodedToken;

        req.user = user;
        next();
    }
    catch(error) {
        res.status(401).json({
            error: new Error("Invalid request!") 
        });
    }
};

