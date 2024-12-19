import { FileCard } from "../components/cloud/User/File/FileCard";
import { useEffect, useState } from "react";
import {store} from "../store/store";
import axios from "axios";
import { useNavigate, useParams,} from "react-router-dom";
import { UploadFileComponent } from "../components/cloud/User/File/UploadFileComponent";


interface FileResponse{
    status:number
    message: string;
    files?:[File]
}

interface File{
    id: number;
    name: string;
    size: number;
    description: string;
    date_downloading: Date;
    last_download: Date | undefined;
    link:string,
    userId: number;
}

export interface FileState{
    files: File[] | null;
    status: number
}

export interface FileStoreState{
    userId: number;
}

export function FileStore(){
    const token = localStorage.getItem('access_token');
    const {userId} = useParams()
    const localUser = localStorage.getItem('user')
    const user = localUser ? JSON.parse(localUser) : null;
    const id = userId ? +userId : null
    const [files, setFiles] = useState<FileState>()

    const navigate = useNavigate();

   console.log(userId,id);
    useEffect(() => {

        const fetchFiles = async () =>{
            const baseUrl = 'http://79.174.94.152:8000';
            if(id && token){
                const url = `${baseUrl}/cloud/get_all/${id}`;
                console.log(token);
                try{
                    const response = await axios.get<FileResponse>(url, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + token
                        }
                    })
                    console.log(response.data);
                    if(response.data.files){
                        store.dispatch({type:"SET_FILES", payload: response.data.files})
                        setFiles({...files, files:response.data.files, status:response.status})
                    }
                    else if(response.status === 403){
                        navigate('/authorization');
                    }
                }catch(error){
                    console.log(error);
                }
            }
        };

        if (id && token) {
            fetchFiles();
        }
    },[]);

    return(
        <div>
            <UploadFileComponent/>
            {files?.files && id? files.files.map(file =>{
                return (
                <div>
                    <FileCard
                        userId={id}
                        isStaff={user.isStaff}
                        fileId = {file.id}
                        name = {file.name}
                        size={file.size} 
                        lastDownload={file.last_download ? file.last_download: null}
                        dateDownloading={file.date_downloading}
                        description= {file.description}
                    />
                </div>
                )}):
            (<h1>У вас нет файлов</h1>)
            }
        </div>
    )
}
