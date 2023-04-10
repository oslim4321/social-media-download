import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const videosDirectory = path.join(process.cwd(), "tmp");
  const fileNames = fs.readdirSync(videosDirectory);
  console.log(fileNames, "fileNames");

  if (!fileNames.length) {
    res.status(404).json("no file");
    return;
  }

  const files = fileNames.map((fileName) => {
    const filePath = path.join(videosDirectory, fileName);
    const fileContents = fs.readFileSync(filePath);

    return {
      name: fileName,
      contents: fileContents.toString("base64"),
    };
  });

  res.status(200).json({ files });
}
