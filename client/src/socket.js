// const socket = io('localhost:8080')
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL)

export default socket