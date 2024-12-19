import axios from "axios";
import React, { useState } from "react";
import { User } from "../../../store/store"; 
import { useParams } from "react-router-dom";

interface UploadResponse {
  message: string;
}

export function AUploadFileComponent() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");

  const localUser = localStorage.getItem("user");
  const user: User = localUser? JSON.parse(localUser) : null;
  const token = localStorage.getItem("access_token");
  const {userId} = useParams();
  const id = userId ? parseInt(userId) : null;
  const [isUpload,setIsUpload] =useState(false)

  const handleIsUpload = () => {
    setIsUpload(!isUpload);
  }

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("description", description);
    if(user && token)
    try {
      const basUrl = 'http://79.174.94.152:8000'
      const url = `${basUrl}/cloud/admin/upload_file/${id}`
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
      if(response.status === 200){
        window.location.reload();
      }else{
        setError("File not upoad upload")
        throw new Error("File not upload");
      }
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
        <button className="form-button" type="submit">Загрузить файл</button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>}
    {!isUpload && <button className="button" type="submit" onClick={handleIsUpload}>Загрузить файл</button>}
    </div>
  );
}
