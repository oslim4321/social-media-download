import axios from "axios";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const { url } = req.body;
  // return res.json(url);
  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    const videoId = url.split("?")[0].split("/").pop(); // extract video ID
    const randomNumber = Math.floor(Math.random() * 1000000); // generate random number
    const filename = `${videoId}-${randomNumber}.mp4`; // add .mp4 extension and random number
    const filepath = path.join("tmp", filename); // save file to /tmp directory
    console.log(filepath);

    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    res
      .status(200)
      .json({ success: true, message: "Video downloaded successfully" });
  } catch (error) {
    console.error(error, "error");
    res
      .status(500)
      .json({ success: false, message: "Failed to download video" });
  }
}
