import { FileCard } from "../components/cloud/User/File/FileCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AUploadFileComponent } from "../components/Admin/File/AUploadFileComponent";


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

export function AUserStore(){
    const token = localStorage.getItem('access_token');
    const [files, setFiles] = useState<FileState>()
    const localUser = localStorage.getItem('user')
    const user = localUser ? JSON.parse(localUser) : null;
    let {userId} = useParams()
    const id:number | null = userId ? parseInt(userId, 10) : null
    const navigate = useNavigate();

    useEffect(() => {

        const fetchFiles = async () =>{
            const baseUrl = 'http://89.104.69.194:8000';
            if(id && token){
                const url = `${baseUrl}/cloud/admin/get_all_user_files/${id}`;
                try{
                    const response = await axios.get<FileResponse>(url, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + token
                        }
                    })
                    console.log(response.data);
                    if(response.data.files){
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

        if (userId && token) {
            fetchFiles();
        }
    }, []);

    return(
        <div>
            <AUploadFileComponent/>
            {files?.files ? files.files.map(file =>{
                return (
                <div>
                    <FileCard
                        userId={id ? id : null}
                        isStaff = {user.is_staff}
                        fileId = {file.id}
                        name = {file.name}
                        size={file.size} 
                        lastDownload={file.last_download ? file.last_download: null}
                        dateDownloading={file.date_downloading}
                        description= {file.description}
                    />
                </div>
                )}):
                (<h1>У пользователя нет файлов</h1>)
            }
        </div>
    )
}