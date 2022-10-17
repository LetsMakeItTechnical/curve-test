import mongoose from "mongoose";

interface Tracks {
  _id: string;
  slug: string;
  title: string;
  version: string;
  artist: string;
  p_line: string;
  aliases: string[];
  isrc: string;
  contract_id: mongoose.Schema.Types.ObjectId;
}

export default Tracks;
