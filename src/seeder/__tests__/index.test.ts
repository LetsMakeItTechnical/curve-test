import { importData, objectKeysToLowerCase, readExcelFile } from "..";
import * as dbConnection from "../../db/test.db";
import { TracksModel } from "../../services/Tracks/Tracks.model";

// Setup connection to the database
beforeAll(async () => {
  process.env.NODE_ENV = "TEST";
  await dbConnection.connect();
});

const tracksData = [
  {
    ID: "Leave blank if a new Track",
    Title: "",
    Version: "",
    Artist: "",
    ISRC: "Any dashes, spaces or other characters will be stripped out on import",
    "P Line": "",
    Aliases: "Separate multiple alises using a semi-colon (;)",
    Contract: "Should match the contract name exactly",
  },
  {
    ID: "",
    Title: "Track 1",
    Version: "Version 1",
    Artist: "Artist 1",
    ISRC: "ISRC1",
    "P Line": "P Line 1",
    Aliases: "aliases1;aliases2",
    Contract: "Contract 1",
  },
  {
    ID: "",
    Title: "Track 2",
    Version: "Version 2",
    Artist: "Artist 2",
    ISRC: "ISRC2",
    "P Line": "P Line 2",
    Aliases: "aliases11 ; aliases22",
    Contract: "Contract 2",
  },
];

beforeEach(async () => await dbConnection.clear());
afterAll(async () => await dbConnection.close());
afterEach(() => jest.clearAllMocks());

describe("seed", () => {
  it("should ingest xcelfile lines into TracksModel that are valid ", async () => {
    const importTitles = await importData();

    const tracks = await TracksModel.find().select("title");
    const trackTitles = tracks.map((track) => track.title);

    expect(importTitles).toEqual(trackTitles);
  });

  it("should convert xcel file to json", async () => {
    const json = await readExcelFile({
      input: `${__dirname}/track-import-test.xlsx`, // input xls
    });

    expect(json).toEqual(tracksData);
  });
});
