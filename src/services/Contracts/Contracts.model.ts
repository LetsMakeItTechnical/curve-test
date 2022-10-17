import * as mongoose from "mongoose";
import { NextFunction } from "express";
import slugify from "slugify";
import Contracts from "./Contracts.type";

const contractsSchema = new mongoose.Schema(
  {
    slug: String,
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

contractsSchema.index({ slug: 1 });

contractsSchema.pre("save", function (this: Contracts, next: NextFunction) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

export const ContractsModel = mongoose.model<Contracts & mongoose.Document>(
  "Contracts",
  contractsSchema
);
