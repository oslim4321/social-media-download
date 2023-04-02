import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const videosDirectory = path.join(process.cwd(), "public", "videos");
  const fileNames = fs.readdirSync(videosDirectory);
  console.log(fileNames, "fileNames");

  const files = fileNames.map((fileName) => {
    const filePath = path.join(videosDirectory, fileName);
    const fileContents = fs.readFileSync(filePath);

    return {
      name: fileName,
      contents: fileContents.toString("base64"),
    };
  });
  if (!files.length) {
    res.status(404).json("no file");
  }

  res.status(200).json({ files });
}
