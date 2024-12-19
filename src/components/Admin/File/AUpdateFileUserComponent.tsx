import axios from "axios";
import React, { useState } from "react";
import { store } from "../../../store/store";

interface UpdateResponse {
  message: string;
}

interface Props {
  userId: number;
  fileId: number;
  name: string;
}

export function AUpdateFileUserComponent({ userId, fileId, name }: Props) {
  const [description, setDescription] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const [error, setError] = useState<string>("");
  const extensionOldFile = name.split(".",2); 
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Unauthorized");
      return;
    }

    try {
      const requestData: any = {}; // Объект для данных запроса

      if (description) {
        requestData.description = description;
      }

      if (filename) {
        const newType = filename.split('.')
        console.log(newType);

        if(newType.length === 1 && extensionOldFile){
          const newName = filename+'.'+extensionOldFile[1]
          requestData.filename = newName;
        }
        else{
          requestData.filename = filename;
        }      
      }

      const basUrl = 'http://79.174.94.152:8000'
      const url = `${basUrl}/cloud/admin/update_file/${userId}/${fileId}`

      const response = await axios.put<UpdateResponse>(
        url,
        requestData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json" 
            }
        }
    );
    if(response.status === 200){
      store.dispatch({ 
        type: 'UPDATE_FILE', 
        payload: { fileId: fileId, description, filename } 
      });
      window.location.reload();
    }

      console.log(response.data.message);
    } catch (error) {
      setError("File update failed");
      console.error(error);
    }
  };

  return (
    <div className='file-options'>
      <form className = "modal-form" onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Введите новое описание"
          className = "form-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Введите новое название файла"
          className = "form-input"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />
        <button className="form-button" type="submit">Обновить файл</button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
