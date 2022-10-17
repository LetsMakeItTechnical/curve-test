import "colors";
import mongoose, { connect } from "mongoose";

export const dataBaseConnection = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(
      "mongodb://ctUser:ctPass@localhost:27017",
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    // process.exit(1);
  }
};

export const disconnect = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

export default dataBaseConnection;
