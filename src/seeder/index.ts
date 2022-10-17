import dotenv from "dotenv";
import node_xj from "xls-to-json";
import PromisePool from "@supercharge/promise-pool/dist";
import slugify from "slugify";
import { promisify } from "util";

import { TracksModel } from "../services/Tracks/Tracks.model";
import { ContractsModel } from "../services/Contracts/Contracts.model";
import { sendError } from "./error.handler";
import dataBaseConnection from "../db/mongoose";

dotenv.config();

export function objectKeysToLowerCase(record) {
  Object.keys(record).forEach((key) => {
    let value = record[key];
    delete record[key];
    const newKey = key.toLowerCase().split(" ").join("_");

    if (newKey === "aliases") {
      value = value.trim().split(";");
    }

    record[newKey] = value;
  });
}

export async function readExcelFile(
  params: Record<string, any>
): Promise<Record<string, any>[]> {
  return promisify(node_xj)(params);
}

if (process.env.NODE_ENV !== "TEST") {
  dataBaseConnection();
}

// IMPORT DATA INTO DB
export const importData = async () => {
  const importedTracksTitles: string[] = [];

  try {
    const tracks = await readExcelFile({
      input: `${__dirname}/track-import-test.xlsx`, // input xls
    });

    tracks.forEach((track) => objectKeysToLowerCase(track));

    const errors = [];

    await ContractsModel.create({
      name: "Contract 1",
    });

    const { results } = await PromisePool.withConcurrency(100)
      .for(tracks)
      .process(async (data) => {
        const response = await ContractsModel.findOne({
          slug: slugify(data.contract, { lower: true }),
        }).select("_id");

        if (!response) {
          errors.push({ message: "contract not found", failureLine: 62 });
        }

        if (data.title) importedTracksTitles.push(data.title);

        delete data.id;

        return {
          ...data,
          contract: response?._id ? response._id : data.contract,
        };
      });

    // log errors
    if (errors.length) {
      console.log("----list of errors----");
      console.log(JSON.stringify(errors));
      console.log("====list of errors====");
    }

    await TracksModel.create(results);
  } catch (err) {
    const error = sendError(err);
    console.error("----handles error----");
    console.error(JSON.stringify(error));
    console.error("====handles error====");
  }

  return importedTracksTitles;
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await ContractsModel.deleteMany();
    await TracksModel.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
  process.exit();
} else if (process.argv[2] === "--delete") {
  deleteData();
  process.exit();
}
