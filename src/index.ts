import express from 'express';
import userRoutes from './routes/userRoutes';
import inspiracionalRoutes from './routes/inspiracionalRoutes';
import sermaoRoutes from './routes/sermaoRoutes';

const app = express();
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', inspiracionalRoutes)
app.use('/api', sermaoRoutes)

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
