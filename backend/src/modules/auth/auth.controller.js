import { registerOwner } from "./auth.service.js";

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