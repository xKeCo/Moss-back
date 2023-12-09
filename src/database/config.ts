import mongoose, { ConnectOptions } from 'mongoose';

export const dbConnection = async () => {
  try {
    const connectionString = process.env.DB_CNN;

    if (!connectionString) {
      throw new Error('DB connection string not found');
    }

    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log('DB online');
  } catch (error) {
    console.log(error);
    throw new Error('Error a la hora de iniciar la BD.. ver logs');
  }
};
