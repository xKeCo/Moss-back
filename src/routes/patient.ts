/*
    Patient Routes / Patient
    host + /api/patient
 */

// Express
import express from 'express';

// Validators
// import { check } from 'express-validator';
// import { fieldValidators } from '../middlewares/fieldValidators';

// Controllers (functions)
import { createPatient, getPatientById, getPatients } from '../controllers/patients';

const router = express.Router();

// @route   POST api/patient - Create patient
router.post('/', createPatient);

// @route   GET api/patient - Get all patients
router.get('/', getPatients);

// @route  GET api/patient/:id - Get patient by id
router.get('/patient/:id', getPatientById);

export default router;
