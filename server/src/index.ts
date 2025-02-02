import express from 'express';
import cors from 'cors';
import morgan from 'morgan'
import vehiculoRouter from './routes/vehiculo';
import conductoresRouter from './routes/conductores';
import rutasRouter from './routes/rutas';

process.loadEnvFile()

const app = express();

app.use(morgan('dev'))
app.use(cors());
app.use(express.json());

// Rutas básicas
app.get('/health', (_req, res) => {
    res.send('OK')
});

app.use('/vehiculos', vehiculoRouter);
app.use('/conductores', conductoresRouter);
app.use('/rutas', rutasRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));