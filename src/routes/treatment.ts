/*
    Treatment Routes / Treatments
    host + /api/treatments
 */

// Express
import express from 'express';

// Controllers (functions)
import {
  createTreatment,
  getTreatmentByPatient,
  getTreatments,
  updateTreatment,
} from '../controllers/treatment';

const router = express.Router();

// @route   POST api/treatments - Create treatments
router.post('/', createTreatment);

// @route   GET api/treatments - Get all treatments
router.get('/', getTreatments);

// @route  GET api/treatments/:id - Get treatment by patient id
router.get('/:id', getTreatmentByPatient);

// @route   PUT api/treatments/:id - Update treatment by id
router.put('/:id', updateTreatment);
export default router;
