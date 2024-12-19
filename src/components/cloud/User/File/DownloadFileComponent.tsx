import axios from "axios";
import { useState } from "react";

interface Props {
  userId: number;
  fileId: number;
  name: string;
}

export function DownloadFileComponent({ userId, fileId, name}: Props) {
  const [error, setError] = useState<string>("");
  const token = localStorage.getItem("access_token");

  const handleGetFile = async () => {
    try {
      if(token){
        const baseUrl = 'http://79.174.94.152:8000'
        const url = `${baseUrl}/cloud/get_file/${userId}/${fileId}`
        const response = await axios.get(
          url,
          {
            responseType: "blob",
            headers:{
              Authorization: "Bearer " + token
            }
          }
        );
        if(response.status === 200){
          const file = new Blob([response.data]);
          const fileURL = window.URL.createObjectURL(file);
          const link = document.createElement("a");
          link.href = fileURL;
          link.target = "_blank"; 
          link.setAttribute("download", name);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          console.log("File retrieved successfully");
        }
      else{
        throw new Error (response.data.message);
      }
      }
    } catch (error) {
      setError("Failed to retrieve file");
      console.error(error);
    }
  };

  return (
    <div className="file-options">
      <button className='button-options' onClick={handleGetFile}>Получить файл</button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
