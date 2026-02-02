import { MiddlewareFn } from "type-graphql";
import { verifyToken } from "../utils/jwt.utils.js";
import { AuthContext } from "../index.js"; 

export const AuthMiddleware: MiddlewareFn<AuthContext> = async ({ context, args }, next) => {
    // 1. Try to get token from the query argument first
    // 2. Fall back to the Authorization header if not found in args
    const token = args.token || (context.req.headers.authorization?.startsWith('Bearer ') 
        ? context.req.headers.authorization.split(' ')[1] 
        : null);
    
    if (!token) {
        throw new Error("Unauthorized Access.");
    }

    try {
        const decoded = verifyToken(token);
        context.user = decoded; 
        return next();
    } catch (error) {
        throw new Error("Forbidden Access: Invalid or expired bearer token.");
    }
};
