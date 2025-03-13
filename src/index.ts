import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import inspiracionalRoutes from './routes/inspiracionalRoutes';
import sermaoRoutes from './routes/sermaoRoutes';
import eventoRoutes from './routes/eventoRoutes';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', userRoutes);
app.use('/api', inspiracionalRoutes)
app.use('/api', sermaoRoutes)
app.use('/api', eventoRoutes)

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
