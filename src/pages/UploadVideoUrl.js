import { useState } from "react";
import axios from "axios";
import VideoList from "./videosList";

const UploadVideoUrl = () => {
  const [url, setUrl] = useState("");

  const handleUpload = async () => {
    try {
      const response = await axios.post("/api/download-video-url", {
        url: url,
      });
      console.log(response.data, "res");
      if (response.data) {
        alert("video downloaded");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  return (
    <div>
      <h1>Upload video Url</h1>
      <input
        style={{ width: "80%", padding: "20px 0" }}
        type="text"
        value={url}
        onChange={handleUrlChange}
      />
      <button
        style={{ width: "15%", padding: "20px 0" }}
        onClick={handleUpload}
      >
        Upload URL
      </button>

      <VideoList />
    </div>
  );
};

export default UploadVideoUrl;
