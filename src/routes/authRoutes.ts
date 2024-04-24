import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { generateEmailToken } from './helpers/authHelpers'

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10

const router = Router()
const prisma = new PrismaClient()

router.post('/login', async (req, res) => {
    const { email } = req.body

    const emailToken = generateEmailToken()
    const expiration = new Date(new Date().getTime() +  EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000)

    try {
        const createdToken = await prisma.token.create({
            data: {
                type: 'EMAIL',
                emailToken,
                expiration,
                user: {
                    connectOrCreate: {
                        where: { email },
                        create: { email }
                    }
                }
            }
        })
        
        console.log(createdToken)
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(400).json({error: "Couldn't start the authentication process"})
    }

})

router.post('/authenticate', async (req, res) => {
    const { email, emailToken } = req.body

    const dbEmailToken = await prisma.token.findUnique({
        where: {
            emailToken
        },
        include: {
            user: true
        }
    })

    if (!dbEmailToken || !dbEmailToken.valid) {
        res.sendStatus(401)
    }

    if (dbEmailToken && dbEmailToken.expiration < new Date()) {
        return res.status(401).json({error: 'Expired token'})
    }

    if (dbEmailToken && dbEmailToken.user.email != email) {
        return res.sendStatus(401)
    }

    

    res.sendStatus(200)

})

export default router