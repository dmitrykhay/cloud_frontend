import { Link } from "react-router-dom";
import { User } from "../../store/store";
import { formatBytes } from "../cloud/User/File/formatBytes";

interface UserCardProps{
    user: User;
}

export function UserCard({user}: UserCardProps){
    const totalSizeFormatted = formatBytes(user.total_size);

    return(
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Имя пользователя</th>
                <th>Папка</th>
                <th>Email</th>
                <th>Администратор</th>
                <th>Количество файлов</th>
                <th>Суммарный размер файлов</th>
                <th>Файлы</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.id    }</td>
                <td>{user.email}</td>
                <td>{`${user.is_staff}`}</td>
                <td>{user.file_count}</td>
                <td>{totalSizeFormatted}</td>
                <td><Link className="link-button" to={`store/${user.id}`}>Посмотреть файлы</Link></td>
            </tr>
            </tbody>
        </table>          
    )
}