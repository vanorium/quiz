export default function User({ name, score, isOwner }) {
    return (
        <div className={`option space-between`}>
            <div className='bar'>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5rem"
                    viewBox="0 0 20 20">
                        {isOwner && <path fill="white" d="M16.68 9.77c-1.34 1.34-3.3 1.67-4.95.99l-5.41 6.52c-.99.99-2.59.99-3.58 0s-.99-2.59 0-3.57l6.52-5.42c-.68-1.65-.35-3.61.99-4.95 1.28-1.28 3.12-1.62 4.72-1.06l-2.89 2.89 2.82 2.82 2.86-2.87c.53 1.58.18 3.39-1.08 4.65zM3.81 16.21c.4.39 1.04.39 1.43 0 .4-.4.4-1.04 0-1.43-.39-.4-1.03-.4-1.43 0-.39.39-.39 1.03 0 1.43z" />
                            || <>
                                <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" fill="white" />
                                <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="white" />
                            </>
                        }
                </svg>
                <div>{name}</div>
            </div>
            <div>{score}</div>
        </div>
    )
} 