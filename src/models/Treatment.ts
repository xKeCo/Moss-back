import { prop, getModelForClass, modelOptions, pre } from '@typegoose/typegoose';

export interface IRealTxPlan {
  txId: string;
  txPhase: string;
  txActivity: string;
  txETT: string;
  txStartDate: string;
  txPrice: string;
}

export interface ITxEvolution {
  txEvolDate: string;
  txEvolDesc: string;
  txEvolId: string;
  txEvolDoc: string;
  txEvolPayment: string;
}

export interface IToothState {
  tooth: number;
  cavities: {
    center: number;
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  extract: number;
  absent: number;
  crown: number;
  endodontics: number;
  filter: number;
  unerupted: number;
  implant: number;
  regeneration: number;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: 0,
  },
})
@pre<Treatment>('save', async function (next) {
  const treatment = this;

  if (!treatment.isModified('realTxPlan')) return next();

  const totalPrice = treatment.realTxPlan.reduce((acc, curr) => {
    return acc + Number(curr.txPrice);
  }, 0);

  treatment.totalPrice = Number(totalPrice);

  const totalPaid = treatment.txEvolutions.reduce((acc, curr) => {
    return acc + Number(curr.txEvolPayment);
  }, 0);

  treatment.totalPaid = totalPaid;

  treatment.balance = totalPrice - totalPaid;

  next();
})
class Treatment {
  @prop({ type: String, required: true, maxlength: 150 })
  public diagnosis!: string;

  @prop({ type: String, required: true, maxlength: 150 })
  public prognosis!: string;

  @prop({ type: String, required: true, maxlength: 10, unique: true })
  public patientId!: string;

  @prop({ type: Array, required: true })
  public initialOdontogram!: Array<IToothState>;

  @prop({
    type: Array<IRealTxPlan>,
    required: true,
  })
  public realTxPlan!: Array<IRealTxPlan>;

  @prop({
    type: Array<ITxEvolution>,
    required: true,
  })
  public txEvolutions!: Array<ITxEvolution>;

  @prop({ type: Number })
  public totalPrice!: number;

  @prop({ type: Number })
  public totalPaid!: number;

  @prop({ type: Number })
  public balance!: number;
}

export const TreatmentModel = getModelForClass(Treatment);
