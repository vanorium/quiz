export default function RoomOption({size, ownerName, onClick}){
    return(
        <div onClick={onClick} style={{justifyContent:"space-between"}} className={`option interactive`}>
            <div>{`${ownerName}'s room`}</div>
            <div>{`${size}`}</div>
        </div>
    )
} 