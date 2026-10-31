import { prisma } from "../../config/database.js";
import { hashPassword } from "../../utils/password.js";


export async function registerOwner(data) {
    const {
        storeName,
        name,
        email,
        mobile,
        password
    } = data;

    // frist hased the password
    const passwordHash = await hashPassword(password);

    try {
        const result = await prisma.$transaction(
            async (tx) => {
                //  only allow   registration of the first store
                const storeCount = await tx.store.count();

                if (storeCount > 0) {
                    const error = new Error(
                        "Store registration is currently closed."
                    );
                    error.statusCode = 403;
                    throw error;
                }

                // Create store and owner together

                const store = await tx.store.create({
                    data: {
                        name: storeName,

                        users: {
                            create: {
                                name,
                                email: email || null,
                                mobile: mobile || null,
                                passwordHash,
                                role: "OWNER"
                            }
                        }
                    },
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        users: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                mobile: true,
                                role: true,
                                isActive: true,
                                createdAt: true
                            }
                        }
                    }
                });
                return store;
            },
            {
                isolationLevel: "Serializable"
            }
        );
        return result;

    } catch (error) {
        if (error.code === "P2002") {
            const conflictError = new Error(
                "Email or mobile number is already registered."
            );

            conflictError.statusCode = 409;
            throw conflictError;
        }

        throw error;
    
}

}