// Dotenv
import 'dotenv/config';

// Express
import express from 'express';

// CORS
import cors from 'cors';

// db config
import { dbConnection } from './database/config';

// Routes
import authRouter from './routes/auth';
import patientRouter from './routes/patient';
import treatmentRouter from './routes/treatment';

const app = express();

dbConnection();

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// CORS
app.use(cors(corsOptions));

// Public folder
app.use(express.static('./public/index.html'));

// Body parser
app.use(express.json());

// Routes
// Auth
app.use('/api/auth', authRouter);

// Patient
app.use('/api/patients', patientRouter);

// Treatment
app.use('/api/treatments', treatmentRouter);

// Port
app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}!`);
});
