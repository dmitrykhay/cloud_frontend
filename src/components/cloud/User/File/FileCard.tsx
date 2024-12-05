import React, { useState } from 'react';
import { DeleteFileComponent } from './DeleteFileComponent';
import { DownloadFileComponent } from './DownloadFileComponent';
import { UpdateFileComponent } from './UdateFileComponent';
import { GenerateLinkComponent } from './GenerateLinkComponent';
import { AUpdateFileUserComponent } from '../../../Admin/File/AUpdateFileUserComponent';
import { ADeleteFileUserComponent } from '../../../Admin/File/ADeleteFileUserComponent';
import { ADownloadById } from '../../../Admin/File/ADownloadById';
import { AGetLinkComponent } from '../../../Admin/File/AGetLinkComponent';
import { formatBytes } from './formatBytes';

interface FileCardProps {
    userId: number | null;
    isStaff: boolean;
    fileId: number;
    name: string;
    size: number;
    description: string;
    dateDownloading: Date;
    lastDownload: Date | null;
}

export const FileCard: React.FC<FileCardProps> = ({userId,isStaff,fileId, name, size, description, dateDownloading, lastDownload }) => {
    const [isChange, setChanges] = useState(false);

    const sizeFormated = formatBytes(size)
    const buttonIsChange = (e:React.MouseEvent<HTMLButtonElement>) =>{
        e.preventDefault();
        setChanges(!isChange);
    }

    return (
        <div>
            {userId && (
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <th>Имя</th>
                                <td>{name}</td>
                            </tr>
                            <tr>
                                <th>Описание</th>
                                <td>{description}</td>
                            </tr>
                            <tr>
                                <th>Размер</th>
                                <td>{sizeFormated}</td>
                            </tr>
                            <tr>
                                <th>Дата загрузки</th>
                                <td>{dateDownloading.toString()}</td>
                            </tr>
                            <tr>
                                <th>Дата скачивания</th>
                                <td>{lastDownload ? lastDownload.toString() : 'не указана'}</td>
                            </tr>
                <tr>
                    <th>Опции</th>
                    <td rowSpan={2} >
                <div className='file-options'>
                    {!isChange  && 
                        <button className = 'button-options' onClick={buttonIsChange}>Изменить</button>
                    }
                    {isChange && !isStaff && <UpdateFileComponent fileId = {fileId} userId ={userId}/>}
                    {isChange && isStaff && <AUpdateFileUserComponent userId={userId} fileId={fileId} name ={name} />}
                    {!isStaff && <DeleteFileComponent fileId = {fileId} userId={userId}/>}
                    {isStaff && <ADeleteFileUserComponent fileId = {fileId} userId={userId}/>}
                    
                    {!isStaff &&<DownloadFileComponent fileId = {fileId} userId={userId} name={name}/>}
                    {isStaff &&<ADownloadById userId={userId} fileId={fileId} name = {name}/>}
                    
                    {!isStaff &&<GenerateLinkComponent userId={userId} fileId={fileId} name={name}/>}
                    {isStaff &&<AGetLinkComponent userId={userId} fileId={fileId} name = {name}/>}
                    
                </div>
                </td>
                </tr>
                </tbody>
            </table>
            </div>
        )}
        </div>
    );
};
