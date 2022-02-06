/*
    Client interface to display videos.

*/
import React, { useState, useEffect } from "react";
import { VideoStreamerClient } from "../proto_definations/video-streaming_pb_service";
import { VideoMetaData, UUID } from "../proto_definations/video-streaming_pb";
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";

const CreateVideoRequest = (uuid_val: string) => {
  const uuid = new UUID();
  uuid.setValue(uuid_val);

  const video_meta = new VideoMetaData();
  video_meta.setValue(uuid);

  return video_meta;
};
const client = new VideoStreamerClient("http://0.0.0.0:8080");

const VidDisplay = () => {
  const VideoRequest = CreateVideoRequest("2b9f4c07-c457-4cc6-8ece-fd4962bae97e");

  const VideoStream = client.getVideoStream(VideoRequest);

  const [frame, setFrame] = useState<string>("");
  const [play, setPlay] = useState<boolean>(false);

  // Frame updater.
  useEffect(() => {
    VideoStream.on("data", (response) => {
      if (!play) VideoStream.cancel();
      const image: string = "data:image/png;base64," + response.getB64image(); // possible preprocessing of image here.
      setFrame(image);
    });
  }, [play]);

  return (
    <div>
      <h1>
        Play Video:{" "}
        <button onClick={() => setPlay(!play)}>
          {play ? "Pause" : "Play"}
        </button>
      </h1>
      <div>
        <img src={frame} />
      </div>
    </div>
  );
};

export default VidDisplay;
