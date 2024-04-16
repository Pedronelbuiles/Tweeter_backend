import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { generateEmailToken } from './helpers/authHelpers'

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10

const router = Router()
const prisma = new PrismaClient()

router.post('/login', async (req, res) => {
    const { email } = req.body

    const emailToken = generateEmailToken()
    const expiration = new Date(new Date().getTime() +  EMAIL_TOKEN_EXPIRATION_MINUTES * 60 *100)

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

})

export default router