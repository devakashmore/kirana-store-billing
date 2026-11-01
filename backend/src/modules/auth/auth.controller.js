
import { registerOwner, loginUser } from "./auth.service.js";
import { generateAccessToken } from "../../utils/token.js"
export async function registerOwnerController(req, res, next) {
    try {
        const store = await registerOwner(req.body);

        return res.status(201).json({
            success: true,
            message: "Store and owner account created successfully",
            data: {
                store: {
                    id: store.id,
                    name: store.name,
                },
                owner: store.users[0]
            }
        });
    } catch (error) {
        next(error);
    }
}

export async function loginController(req, res, next) {
    try {
        const user = await loginUser(req.body);

        const accessToken = generateAccessToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user,
                accessToken
            }
        });
    } catch (error) {
        next(error);
    }
}