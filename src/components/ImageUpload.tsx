import React, { useState } from "react";
import { uploadPicture } from "../api";

const ImageUploader: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show a preview
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image first!");

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);

    try {
      const response = await uploadPicture(formData);
      setUploadedUrl(response.data.imageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload an Image</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && <img src={preview} alt="Preview" />}

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {uploadedUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
            <img src={uploadedUrl} alt="Uploaded" />
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
