/*
    Treatment Routes / Treatments
    host + /api/treatments
 */

// Express
import express from 'express';

// Controllers (functions)
import {
  createTreatment,
  getTreatmentByPatientId,
  getTreatmentByTreatmentId,
  getTreatments,
  updateTreatment,
} from '../controllers/treatment';

const router = express.Router();

// @route   POST api/treatments - Create treatments
router.post('/', createTreatment);

// @route   GET api/treatments - Get all treatments
router.get('/', getTreatments);

// @route  GET api/treatments/:patientID - Get treatment by patient id
router.get('/:id', getTreatmentByPatientId);

// @route  GET api/treatments/:id - Get treatment by treatment id
router.get('/:patientId/:treatmentId', getTreatmentByTreatmentId);

// @route   PUT api/treatments/:id - Update treatment by id
router.put('/:id', updateTreatment);
export default router;
