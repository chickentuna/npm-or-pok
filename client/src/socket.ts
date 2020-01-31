import io from 'socket.io-client'

const socket = io('ws://:3001', {
  transports: ['websocket']
})

socket.on('connect', (...args) => {
  console.log('connect', ...args)
})

socket.on('disconnect', () => {
  console.log('disconnect')
})

export default socket
