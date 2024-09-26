console.log(process.env.NEXT_PUBLIC_SOCKET_URL)
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL)