import mongoose from "mongoose";
import { NextFunction } from "express";
import slugify from "slugify";
import Tracks from "./Tracks.type";

const tracksSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      unique: true,
      trim: true,
    },

    slug: String,

    version: String,

    artist: String,

    p_line: String,

    aliases: [String],

    isrc: {
      type: String,
      required: [true, "isrc is required"],
      trim: true,
    },

    contract_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contracts",
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

tracksSchema.index({ slug: 1 });

tracksSchema.pre("save", function (this: Tracks, next: NextFunction) {
  this.slug = slugify(this.title, { lower: true });

  next();
});

export interface TrackssDocument extends Tracks, Document {}

export const TracksModel = mongoose.model<Tracks & mongoose.Document>(
  "Tracks",
  tracksSchema
);
