import { PrismaClient } from '@prisma/client';
import { Router } from 'express'

const router = Router()
const prisma = new PrismaClient()

router.get("/", async(req, res) => {
    const allTweets = await prisma.tweet.findMany({
        include: {user: {select: { id: true, name:true, username: true, image: true }}}
    })
    res.json(allTweets)
});

router.get("/:id", async (req, res) => {
    const { id } = req.params
    const tweet = await prisma.tweet.findUnique({ where: { id: id }, include: {user: true} })
    if (!tweet) {
        return res.status(404).json({error: "Tweet not found"})
    }
    res.json(tweet)
});

router.post("/", async (req, res) => {
    const { content, image, userId } = req.body
    try {
        const result = await prisma.tweet.create({
            data: {
                content,
                image,
                userId //TODO manage based on the auth user
            }
        })
        res.json(result)
    } catch (error) {
        res.status(500).json({error: error})
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params
    const { content, image } = req.body
    try {
        const result = await prisma.tweet.update({
            where: {id: id},
            data: { content , image, updatedAt: new Date() }
    })
    res.json(result)
    } catch (error) {
        res.status(400).json({ error: `Falied to update the tweet` })
    }
});

router.delete("/:id",  async(req, res) => {
    const { id } = req.params
    await prisma.tweet.delete({ where: {id: id} })
    res.sendStatus(200)
})

export default router