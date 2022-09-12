import { io } from 'socket.io-client';

//https://serene-gorge-90320.herokuapp.com/
//http://localhost:5000
const socket = io('http://localhost:5000');
  socket.on('conectado',()=>{
      const salaID = window.location.href.split('sala=')[1];
      socket.emit('entrar sala',salaID)
  });

export default socket;