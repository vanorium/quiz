import s from "./roomOption.module.css"

export default function RoomOption({size, ownerName, onClick}){
    return(
        <div onClick={onClick} className={`${s.room} hover`}>
            <div>{`${ownerName}'s room`}</div>
            <div>{`${size}`}</div>
        </div>
    )
} 