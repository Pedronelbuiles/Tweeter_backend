import { PrismaClient } from "@prisma/client/extension"

export const validateUsernameAndEmail = async (email:string, username: string, prisma: PrismaClient):Promise<boolean> => {
    const userFind = await prisma.user.findUnique({where: {username: username, email: email}})
    if (userFind?.id) return true
    return false
}
