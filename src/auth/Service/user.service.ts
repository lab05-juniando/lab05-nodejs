import { prisma } from "../../db/db";
import { AppError } from "../../errors/appError";
import { userSchema } from "../Schemas/User.schema";
import { z } from "zod";


type UserData = z.infer<typeof userSchema>;

export const getPerfil = async (userId: string) => {

    const user = await prisma.user.findUnique ({
        where: {id: userId}
    })
    if (!user) {
        throw new AppError("Usuario não encontrado", 404);
    }
    return user;
}

 export const updatePerfil = async (userId: string, data: UserData) => {
 const user = await prisma.user.findUnique({
        where: {id: userId}
    })
    if (!user) {
        throw new AppError("Usuario não encontrado", 404);
    }
    const existingEmail = await prisma.user.findFirst({
        where: {
            email: data.email,
            id: { not: userId }

        } 
    }
)

    if (!existingEmail){
        throw new AppError("Email já cadastrado", 400);
    }

    const updatedUser = await prisma.user.update({
        where: {id: userId},
        data: {...data}
    } 
)
    return updatedUser;
 }