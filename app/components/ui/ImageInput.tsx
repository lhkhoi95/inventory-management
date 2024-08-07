import React from "react";
import { CircleButton } from "./Buttons";
import { cameraIcon, uploadIcon } from "./Icons";

interface ImageUploadProps {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setShowCamera: (show: boolean) => void;
  label: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  handleFileChange,
  setShowCamera,
  label,
}) => {
  return (
    <label>
      <span className="my-4 text-left">{label}</span>
      <div className="mt-4 flex items-center justify-center gap-8 text-xs text-stone-300">
        <div className="flex flex-col items-center justify-center gap-1 align-middle">
          {/* Upload Button */}
          <CircleButton type="button">
            <input
              type="file"
              accept="image/*"
              name="image"
              id="image-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor="image-upload">{uploadIcon}</label>
          </CircleButton>
          <span>Upload</span>
        </div>

        {/* Camera Button only for desktop */}
        <div className="hidden flex-col items-center justify-center gap-1 align-middle lg:flex">
          <CircleButton type="button" onClick={() => setShowCamera(true)}>
            {cameraIcon}
          </CircleButton>
          <span>Camera</span>
        </div>
      </div>
    </label>
  );
};

export default ImageUpload;
