import { prop, getModelForClass, modelOptions, pre } from '@typegoose/typegoose';

interface IBasicInformation {
  gender: 'M' | 'F' | 'O' | '';
  bloodType: 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | '';
  birthDate: Date;
  birthPlace: string;
  height: string;
  weight: string;
  maritalStatus: 'S' | 'C' | 'V' | 'D' | 'M' | '';
  occupation: string;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: 0,
  },
})
@pre<Patient>('save', async function (next) {
  const patient = this;

  if (!patient.isModified('name')) return next();

  patient.name = patient.name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  patient.photoURL = `https://source.boringavatars.com/beam/120/${patient?.dniNumber}?colors=0A0310,49007E`;

  patient.contactInformation.emergencyContactName =
    patient.contactInformation.emergencyContactName
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  next();
})
class Patient {
  @prop({ type: String, required: true, capitalize: true, maxlength: 50 })
  public name!: string;

  @prop({
    type: String,
    required: true,
    enum: ['CC', 'TI', 'O', ''],
    default: 'CC',
    uppercase: true,
  })
  public dniType!: 'CC' | 'TI' | 'O' | '';

  @prop({ type: String, required: true, unique: true })
  public dniNumber!: string;

  @prop({
    type: String,
    required: [true, 'Email is required.'],
    trim: true,
    lowercase: true,
    match: [
      /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      'The email address is badly formatted.',
    ],
  })
  public email!: string;

  @prop({ type: String, lowercase: true })
  public photoURL!: string;

  @prop({ type: Object, required: true })
  public basicInformation!: IBasicInformation;

  @prop({ type: Object, required: true })
  public contactInformation!: {
    address: string;
    phone1: string;
    phone2?: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactPhone2?: string;
  };

  @prop({ type: Object, required: true })
  public medicalInformation!: {
    EPSActive: boolean;
    EPSName?: string;
    visitedDoctor: boolean;
    doctorType?: 'G' | 'E' | '';
    inTreatment: boolean;
    treatment?: string;
    boneScan: boolean;
    boneScanType?: string;
  };

  @prop({ type: Boolean, required: true, default: true })
  public termsAndConditions!: boolean;

  @prop({ type: Boolean, required: true, default: false })
  public savedFullInformation!: boolean;
}

export const PatientModel = getModelForClass(Patient);
