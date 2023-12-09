import { response } from 'express';
import { PatientModel } from '../models';

// Create Patient
export const createPatient = async (req: any, res = response) => {
  const patient = new PatientModel(req.body);

  try {
    const patientExists = await PatientModel.findOne({
      dniNumber: patient.dniNumber,
    });

    if (patientExists) {
      return res.status(400).json({
        ok: false,
        msg: `Ya existe un paciente con ese número de documento (${patient.dniType}. ${patient.dniNumber}).`,
      });
    }

    await patient.save();

    res.json({
      ok: true,
      msg: 'patient created successfully',
      patient,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    });
  }
};

// Get all patients
export const getPatients = async (req: any, res = response) => {
  try {
    const patients = await PatientModel.find({
      savedFullInformation: false,
    });

    res.json({
      ok: true,
      msg: 'getPatients',
      patients,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    });
  }
};

// Get patient by id
export const getPatientById = async (req: any, res = response) => {
  const id = req.params.id;

  try {
    const patient = await PatientModel.find({
      dniNumber: id,
    });

    if (!patient) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un paciente con ese id',
      });
    }

    res.json({
      ok: true,
      msg: 'getPatientById',
      patient,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    });
  }
};
