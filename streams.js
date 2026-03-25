import fs from "fs";
import zlib from "zlib";
import { pipeline } from "stream";

// 1. Read file in chunks
const readStream = fs.createReadStream("./big.txt", {
  encoding: "utf-8",
  highWaterMark: 64,
});

readStream.on("data", (chunk) => {
  console.log("Chunk:", chunk);
});

readStream.on("end", () => {
  console.log("Finished reading file");
});

// 2. Copy file using streams
const copyReadStream = fs.createReadStream("./source.txt");
const copyWriteStream = fs.createWriteStream("./dest.txt");

copyReadStream.pipe(copyWriteStream);

// 3. Compress file using pipeline
pipeline(
  fs.createReadStream("./data.txt"),
  zlib.createGzip(),
  fs.createWriteStream("./data.txt.gz"),
  (err) => {
    if (err) console.error("Pipeline failed:", err);
    else console.log("File compressed successfully");
  }
);