import axios from "axios";
import React, { useState } from "react";
import { User } from "../../../../store/store";

interface UploadResponse {
  message: string;
}

export function UploadFileComponent() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isUpload,setIsUpload] = useState(false);

  const handleIsUpload = () =>{
    setIsUpload(!isUpload);
  }

  const localUser = localStorage.getItem("user");
  const user: User = localUser? JSON.parse(localUser) : null;
  const token = localStorage.getItem("access_token");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async () => {

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("description", description);
    if(user && token)
    try {
      const baseUrl = 'http://79.174.86.223:8000'
      const url = `${baseUrl}/cloud/upload_file/${user.id}`
      const response = await axios.post<UploadResponse>(
        url,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );
      handleIsUpload();
      window.location.reload();

    } catch (error) {
      setError("File upload failed");
      console.error(error);
    }
  };

  return (
    <div className="file-options">
    {isUpload && <div>
      <form className="modal-form" onSubmit={handleSubmit}>
        <input className="form-input" placeholder="Файл" type="file" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Описание"
          className="form-input"
          value={description}
          onChange={handleDescriptionChange}
        />
        <button className = "form-button" type="submit">Загрузить файл</button>
      </form>
      {error && <div className="error-message"></div>}
    </div>
  }
  {!isUpload && <button className="button" onClick={handleIsUpload}>Загрузить файл</button>}
  </div>
  );
}
