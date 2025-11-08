
import React, { useRef, useCallback } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageChange: (file: File | null, preview: string | null) => void;
  imagePreview: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, imagePreview }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if(file.size > 4 * 1024 * 1024) { // 4MB limit
          alert("File is too large. Please select an image under 4MB.");
          return;
      }
      const previewUrl = URL.createObjectURL(file);
      onImageChange(file, previewUrl);
    } else {
      onImageChange(null, null);
    }
  };
  
  const handleRemoveImage = () => {
    onImageChange(null, null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const onUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {imagePreview ? (
        <div className="w-full text-center relative group">
          <img src={imagePreview} alt="Selected preview" className="w-full max-h-96 object-contain rounded-lg shadow-md mx-auto" />
           <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center rounded-lg">
             <button
              onClick={handleRemoveImage}
              className="opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
            >
              Remove Image
            </button>
           </div>
        </div>
      ) : (
        <div
          onClick={onUploadClick}
          className="w-full h-64 border-4 border-dashed border-base-300 hover:border-brand-secondary rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 bg-base-100/50"
        >
          <UploadIcon className="w-16 h-16 text-base-300 group-hover:text-brand-secondary mb-2" />
          <p className="text-text-primary text-xl font-semibold">Click to upload an image</p>
          <p className="text-text-secondary">PNG, JPG, or WEBP (Max 4MB)</p>
        </div>
      )}
    </div>
  );
};
