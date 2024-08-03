import React, { useRef, useState, useCallback, useEffect } from "react";
import { Camera, CameraType } from "react-camera-pro";

interface CameraComponentProps {
  onCapture: (image: string) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const camera = useRef<CameraType>(null);
  const [image, setImage] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const capture = useCallback(() => {
    if (camera.current) {
      const imageSrc = camera.current.takePhoto();
      if (typeof imageSrc === "string") {
        setImage(imageSrc);
        onCapture(imageSrc);
      } else {
        // Handle ImageData object
        const canvas = document.createElement("canvas");
        canvas.width = imageSrc.width;
        canvas.height = imageSrc.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.putImageData(imageSrc, 0, 0);
          const dataUrl = canvas.toDataURL("image/jpeg");
          setImage(dataUrl);
          onCapture(dataUrl);
        }
      }
    }
  }, [onCapture]);

  const retake = useCallback(() => {
    setImage(null);
  }, []);

  const errorMessages = {
    noCameraAccessible:
      "No camera device accessible. Please connect your camera or try a different browser.",
    permissionDenied:
      "Permission denied. Please refresh and give camera permission.",
    switchCamera:
      "It is not possible to switch camera to different one because there is only one video device accessible.",
    canvas: "Canvas is not supported.",
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setHasPermission(true);
      })
      .catch(() => {
        setHasPermission(false);
      });
  }, []);

  return (
    <div className="mt-4 flex flex-col items-center">
      {image ? (
        <>
          <img src={image} alt="Captured" className="" />
          <div className="flex flex-row gap-2">
            <button
              onClick={retake}
              className="mt-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              Retake
            </button>
          </div>
        </>
      ) : (
        <>
          {hasPermission ? (
            <div className="relative flex h-72 w-full max-w-md items-center justify-center overflow-hidden rounded-lg bg-black">
              <Camera ref={camera} errorMessages={errorMessages} />
            </div>
          ) : (
            <p>Please grant camera permission to use this feature.</p>
          )}
          <button
            onClick={capture}
            className="mt-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Capture
          </button>
        </>
      )}
    </div>
  );
};

export default CameraComponent;
