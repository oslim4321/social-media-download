import { useEffect, useState } from "react";

const VideoList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("/api/getVideoList")
      .then((response) => response.json())
      .then((data) => setVideos(data.files))
      .catch((error) => console.error(error));
  }, []);
  console.log(videos);
  return (
    <div>
      {videos.map((video) => (
        <div key={video.name}>
          <h3>{video.name}</h3>
          <video controls>
            <source
              src={`data:video/mp4;base64,${video.contents}`}
              type="video/mp4"
            />
          </video>
        </div>
      ))}
    </div>
  );
};

export default VideoList;
