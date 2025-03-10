import express from 'express';
import userRoutes from './routes/userRoutes';
import inspiracionalRoutes from './routes/inspiracionalRoutes';

const app = express();
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', inspiracionalRoutes)

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
