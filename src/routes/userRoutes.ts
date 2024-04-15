import { Router } from 'express'
import { PrismaClient } from '@prisma/client';
import { validateUsernameAndEmail } from './validators/userValidator'

const router = Router()
const prisma = new PrismaClient()

router.get("/", async (req, res) => {
    const allUser = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            image: true
        }
    })
    res.json(allUser)
});

router.get("/:id", async (req, res) => {
    const { id } = req.params
    const user = await prisma.user.findUnique({
         where: { id: id },
         include: {tweets: true},
    })
    if (!user) {
        return res.status(404).json({error: "User not found"})
    }
    res.json(user)
});

router.post("/", async (req, res) => {
    const { email, name, username } = req.body
    const userExist = await validateUsernameAndEmail(email, username, prisma)
    try {
        if (!userExist) {
            const result = await prisma.user.create({
                data: {
                    email,
                    name,
                    username,
                    bio: "Hi, I'm new on Twitter"
                }
            })
        
            res.json(result)
        } else {
            res.status(400).json({error: 'Username and email should be unique'})
        }
    } catch (error) {
        res.status(500).json({error: error})
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params
    const { bio, name, image } = req.body
    try {
        const result = await prisma.user.update({
            where: {id: id},
        data: { bio, name , image }        
    })
    res.json(result)
    } catch (error) {
        res.status(400).json({ error: `Falied to update the user` })
    }
});

router.delete("/:id", async(req, res) => {
    const { id } = req.params
    await prisma.user.delete({ where: {id: id} })
    res.sendStatus(200)
});

export default router