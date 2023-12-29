import { prop, getModelForClass, modelOptions, pre } from '@typegoose/typegoose';

export interface IRealTxPlan {
  txPhase: string;
  txActivity: string;
  txETT: string;
  txStartDate: string;
  txPrice: number;
}

export interface ITxEvolution {
  txEvolDate: string;
  txEvolDesc: string;
  txEvolId: string;
  txEvolDoc: string;
  txEvolPayment: number;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: 0,
  },
})
// make this
// Get total price from realtxplan each txPrice and sum all and save in totalPrice
// get totalPaid from txEvolutions each txEvolPayment and sum all and save in totalPaid
// Do this on save and update
@pre<Treatment>('save', async function (next) {
  const treatment = this;

  if (!treatment.isModified('realTxPlan')) return next();

  const totalPrice = treatment.realTxPlan.reduce((acc, curr) => {
    return acc + curr.txPrice;
  }, 0);

  treatment.totalPrice = totalPrice;

  const totalPaid = treatment.txEvolutions.reduce((acc, curr) => {
    return acc + curr.txEvolPayment;
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

  @prop({ type: String, required: true, maxlength: 150 })
  public treatment!: string;

  @prop({ type: String, required: true, maxlength: 10 })
  public patientId!: string;

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
