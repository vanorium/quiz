// const socket = io('localhost:8080')
console.log(process.env)
console.log(process.env.NEXT_PUBLIC_SOCKET_URL)
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL)

export default socket