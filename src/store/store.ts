import { createStore } from 'redux';

export interface User {
    id: number;
    username: string;
    email: string;
    folder: number;
    is_staff: boolean;
    total_size: number;
    file_count: number;
}

export interface File {
    id: number;
    name: string;
    size: number;
    description: string;
    date_downloading: Date;
    last_download: Date | undefined;
    link: string;
    userId: number;
}

export interface RootState {
    files?: File[] | null;
    fileLinks?: { fileId: number; fileLink: string }[] | null; 
}

export interface DeleteFileLinkAction {
    type: 'DELETE_FILE_LINK';
    payload: number;
}


export interface UpdateFileAction {
    type: 'UPDATE_FILE';
    payload: { fileId: number; description?: string; filename?: string }; // Изменения, которые нужно внести в файл
}

export interface SetFileLinkAction {
    type: 'SET_FILE_LINK';
    payload: { fileId: number; fileLink: string }; 
}


type LogoutAction = {
    type: 'LOGOUT';
}

export interface DeleteFileAction {
    type: 'DELETE_FILE';
    payload: number; // ID файла для удаления
}

type SetFilesAction = {
    type: 'SET_FILES';
    payload: File[]; // действие для установки файлов в хранилище
}

type AppActions = DeleteFileLinkAction | LogoutAction | SetFilesAction | DeleteFileAction | UpdateFileAction | SetFileLinkAction;

const initialState: RootState = {
    files: null // инициализируем файлы как null
};

const reducer = (state = initialState, action: AppActions): RootState => {
    switch (action.type) {
    case 'DELETE_FILE_LINK':
        return {
            ...state,
            fileLinks: state.fileLinks ? state.fileLinks.filter(link => link.fileId !== action.payload) : null
        };
    case 'UPDATE_FILE':
        return {
            ...state,
            files: state.files ? state.files.map(file => {
                if (file.id === action.payload.fileId) {
                    return {
                        ...file,
                        description: action.payload.description !== undefined ? action.payload.description : file.description,
                        name: action.payload.filename !== undefined ? action.payload.filename : file.name
                    };
                }
                return file;
            }) : null
        };
        case 'DELETE_FILE':
            return {
                ...state,
                files: state.files ? state.files.filter(file => file.id !== action.payload) : null // Удаляем файл с заданным ID из списка файлов
            };
        
        case 'SET_FILE_LINK':
            return {
                ...state,
                fileLinks: state.fileLinks ? [...state.fileLinks, { fileId: action.payload.fileId, fileLink: action.payload.fileLink }] : [{ fileId: action.payload.fileId, fileLink: action.payload.fileLink }] 
            };
        
        case 'LOGOUT':
            return {
                ...state,
               
                files: null // очищаем файлы при выходе из системы
            };
        case 'SET_FILES':
            return {
                ...state,
                files: action.payload // устанавливаем файлы из действия SET_FILES
            };
        default:
            return state;
    }
};

export const store = createStore(reducer);
