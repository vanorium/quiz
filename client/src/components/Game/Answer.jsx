export default function Answer({isBlocked, text, onClick}){
    return(
        <div onClick={onClick} style={{justifyContent:"center", height:"100%"}} className={`option ${!isBlocked ? 'interactive' : ''}`}>{text}</div>
    )
}