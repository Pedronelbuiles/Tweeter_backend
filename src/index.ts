import express from 'express';
import userRoutes from './routes/userRoutes'
import tweetRoutes from './routes/tweetRoute'

const app = express();

app.use(express.json());
app.use('/user', userRoutes)
app.use('/tweet', tweetRoutes)



app.listen(3000, () => {
    console.log("Server running at localhost:3000")
});