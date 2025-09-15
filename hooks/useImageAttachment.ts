import { useState, useEffect, useCallback } from 'react';

export function useImageAttachment() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleRemoveImage = useCallback(() => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImageFile(null);
    setImagePreviewUrl(null);
  }, [imagePreviewUrl]);

  const handleImageSelect = useCallback((file: File) => {
    handleRemoveImage();
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (file && acceptedTypes.includes(file.type)) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      console.error("Unsupported file type");
    }
  }, [handleRemoveImage]);
  
  const resetImage = useCallback(() => {
      handleRemoveImage();
  }, [handleRemoveImage]);

  return {
    imageFile,
    imagePreviewUrl,
    handleImageSelect,
    handleRemoveImage,
    resetImage,
  };
}