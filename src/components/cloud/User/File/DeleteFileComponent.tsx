import { store } from "../../../../store/store"
import axios from "axios";
import React, { useState } from "react";

interface DeleteResponse {
  message: string;
}

interface Props {
  fileId: number;
  userId: number;
}

export function DeleteFileComponent({ userId, fileId }: Props) {
  const [error, setError] = useState<string>("");

  const handleDelete = async (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Unauthorized");
      return;
    }

    try {
        const baseUrl = 'http://79.174.94.152:8000'
        const url = `${baseUrl}/cloud/delete_file/${userId}/${fileId}`
        const response = await axios.delete<DeleteResponse>(
            url,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log(response.data.message);
        
        // Отправляем действие DELETE_FILE для удаления файла из хранилища Redux
        store.dispatch({ type: 'DELETE_FILE', payload: fileId });
        window.location.reload();
    } catch (error) {
        setError("File deletion failed");
        console.error(error);
    }
  }
  return (
    <div className="file-options">
      <button className='button-options' onClick={handleDelete}>Удалить файл</button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

