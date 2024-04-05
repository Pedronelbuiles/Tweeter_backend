import { Router } from 'express'
import { PrismaClient } from '@prisma/client';

const router = Router()
const prisma = new PrismaClient()

router.get("/", async (req, res) => {
    const allUser = await prisma.user.findMany()
    res.json(allUser)
});

router.get("/:id", async (req, res) => {
    const { id } = req.params
    const user = await prisma.user.findUnique({ where: { id: id } })
    res.json(user)
});

router.post("/", async (req, res) => {
    const { email, name, username } = req.body
    const result = await prisma.user.create({
        data: {
            email,
            name,
            username,
            bio: "Hi, I'm new on Twitter"
        }
    })

    res.json(result)
});

router.put("/:id", (req, res) => {
    const { id } = req.params
    res.status(501).json({ error: `Not implemented ${id}` })
});

router.delete("/:id", (req, res) => {
    const { id } = req.params
    res.status(501).json({ error: `Not implemented ${id}` })
});

export default router