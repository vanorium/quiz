export default function Answer({ isSelected, isBlocked, text, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{ justifyContent: "center" }}
            className={`option ${!isBlocked ? "interactive" : ""} ${
                isSelected ? "selected" : ""
            }`}
        >
            {text}
        </div>
    );
}
