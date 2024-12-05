import axios from "axios";
import React, { useState } from "react";

interface DeleteResponse {
  message: string;
}

interface Props {
  fileId: number;
  userId: number;
}


export function ADeleteFileUserComponent({ userId, fileId }: Props){
    const [error, setError] = useState<string>("");

    const handleDelete = async (e:React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const token = localStorage.getItem("access_token");
  
      if (!token) {
        setError("Unauthorized");
        return;
      }
  
      try {
        const baseUrl = "http://79.174.86.223:8000";
        const url = `${baseUrl}/cloud/admin/delete_file/${userId}/${fileId}`;
          const response = await axios.delete<DeleteResponse>(
            url,
              {
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              }
          );
          console.log(response.data.message);
          window.location.reload();
      } catch (error) {
          setError("File deletion failed");
          console.error(error);
      }
    }
    return (
      <div className='file-options'>
        <button className='button-options' onClick={handleDelete}>Удалить файл</button>
        {error && <div className="error-message">{error}</div>}
      </div>
    );
}

