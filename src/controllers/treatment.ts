import { response } from 'express';
import { IRealTxPlan, ITxEvolution, PatientModel, TreatmentModel } from '../models';

// Create Patient
export const createTreatment = async (req: any, res = response) => {
  const treatment = new TreatmentModel(req.body);

  try {
    const treatmentExists = await TreatmentModel.findOne({
      patientId: treatment.patientId,
    });

    if (treatmentExists) {
      return res.status(400).json({
        ok: false,
        msg: `Ya existe un tratamiento activo para el paciente con id ${treatment.patientId}`,
      });
    }

    treatment.realTxPlan = treatment.realTxPlan.map((tx) => {
      return {
        ...tx,
        txActive: true,
      };
    });

    treatment.txEvolutions = treatment.txEvolutions.map((tx) => {
      return {
        ...tx,
        txEvolActive: true,
      };
    });

    const totalPrice = treatment.realTxPlan.reduce((acc, curr) => {
      return acc + Number(curr.txPrice);
    }, 0);

    treatment.totalPrice = Number(totalPrice);

    const totalPaid = treatment.txEvolutions.reduce((acc, curr) => {
      return acc + Number(curr.txEvolPayment);
    }, 0);

    treatment.totalPaid = totalPaid;

    treatment.balance = totalPrice - totalPaid;

    await treatment.save();

    res.json({
      ok: true,
      msg: 'Treatment created successfully',
      treatment: treatment,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    });
  }
};

// Get all treatments
export const getTreatments = async (req: any, res = response) => {
  try {
    const treatments = await TreatmentModel.find();

    res.json({
      ok: true,
      msg: 'getTreatments',
      treatments: treatments[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    });
  }
};

// Get Treatment by Patient Id
export const getTreatmentByTreatmentId = async (req: any, res = response) => {
  const { treatmentId, patientId } = req.params;

  try {
    const treatment = await TreatmentModel.find({
      _id: treatmentId,
      patientId,
    });

    if (!treatment.length) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un tratamiento con este id para este paciente',
      });
    }

    const patient = await PatientModel.findOne(
      { dniNumber: patientId },
      { _id: 0, name: 1 }
    );

    treatment[0].patientName = patient?.name || '';

    res.json({
      ok: true,
      msg: 'getTreatmentByTreatmentId',
      treatment: treatment[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    });
  }
};

// Get Treatment by Patient Id
export const getTreatmentByPatientId = async (req: any, res = response) => {
  const id = req.params.id;

  try {
    const treatment = await TreatmentModel.find({
      patientId: id,
    });

    if (!treatment.length) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un tratamiento para este paciente',
      });
    }

    const patient = await PatientModel.findOne({ dniNumber: id }, { _id: 0, name: 1 });

    treatment[0].patientName = patient?.name || '';

    res.json({
      ok: true,
      msg: 'getTreatmentByPatientId',
      treatment: treatment[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    });
  }
};

// update treatment
export const updateTreatment = async (req: any, res = response) => {
  const id = req.params.id;

  try {
    const treatment = await TreatmentModel.findById(id);

    if (!treatment) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un tratamiento para este paciente',
      });
    }

    req.body.realTxPlan = req.body.realTxPlan.map((tx: IRealTxPlan) => {
      return {
        ...tx,
        txActive: true,
      };
    });

    req.body.txEvolutions = req.body.txEvolutions.map((tx: ITxEvolution) => {
      return {
        ...tx,
        txEvolActive: true,
      };
    });

    const totalPrice = req.body.realTxPlan.reduce((acc: number, curr: IRealTxPlan) => {
      return acc + Number(curr.txPrice);
    }, 0);

    const totalPaid = req.body.txEvolutions.reduce((acc: number, curr: ITxEvolution) => {
      return acc + Number(curr.txEvolPayment);
    }, 0);

    const balance = totalPrice - totalPaid;

    const newTreatment = {
      ...req.body,
      totalPrice,
      totalPaid,
      balance,
    };

    const treatmentUpdated = await TreatmentModel.findByIdAndUpdate(id, newTreatment, {
      new: true,
    });

    res.json({
      ok: true,
      msg: 'updateTreatment',
      treatment: treatmentUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    });
  }
};
