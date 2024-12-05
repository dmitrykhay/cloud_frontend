import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { store, SetFileLinkAction, RootState } from "../../../store/store";

interface Props {
  userId: number;
  fileId: number;
  name: string;
}

export function AGetLinkComponent({ userId, fileId, name }: Props) {
  const [error, setError] = useState<string>("");
  const fileLinks = useSelector((state: RootState) => state.fileLinks);
  const token = localStorage.getItem("access_token");

  const handleGetLink = async () => {
    if (token) {
      try {
        const baseUrl = "http://89.104.69.194:8000";
        const url = `${baseUrl}/cloud/admin/get_link/${userId}/${fileId}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        if (response.status === 200) {
          const fileLink = `${baseUrl}/cloud/get_by_link/${response.data.link}`;

          store.dispatch<SetFileLinkAction>({
            type: "SET_FILE_LINK",
            payload: { fileId, fileLink },
          });
        } else {
          setError("Failed to get file by link");
          throw new Error(`Failed to get file by link`);
        }
      } catch (error) {
        setError("Failed to get file link");
        console.error(error);
      }
    }
  };

  const isLinkExist = (fileId: number) => {
    if (!fileLinks) {
      return null;
    }
    const foundItem = fileLinks.find(fileLink => fileLink.fileId === fileId);
    return foundItem ? foundItem.fileLink : null;
  };

  return (
    <div>
      <button className="button-options" onClick={handleGetLink}>
        Получить ссылку
      </button>
      <p />
      {isLinkExist(fileId) !== null && (
        <div>
          <input
            placeholder="Ссылка"
            className="link-field"
            type="text"
            value={isLinkExist(fileId) || ''}
            readOnly
          />
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
