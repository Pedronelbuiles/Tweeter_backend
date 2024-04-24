import express from 'express';
import userRoutes from './routes/userRoutes'
import tweetRoutes from './routes/tweetRoute'
import authRoutes from './routes/authRoutes'

const app = express();

app.use(express.json());
app.use('/user', userRoutes)
app.use('/tweet', tweetRoutes)
app.use('/auth', authRoutes)



app.listen(3001, () => {
    console.log("Server running at localhost:3001")
});