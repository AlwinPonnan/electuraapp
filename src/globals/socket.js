import { io } from "socket.io-client";
import { serverUrl } from '../Services/Url'
import { getDecodedToken } from "../Services/User";

export const socket = io(serverUrl);

export const connectToServerSocket = () => {
    socket.connect();
};

export const onSocketConnect = (callBackFn) => {
    socket.on('connect', callBackFn)
    console.log('connection?')
    console.log(callBackFn)
}




export const forceReconnectToServerSocket = () => {
    socket.disconnect().connect();
};

export const disconnectToServerSocket = () => {
    socket.disconnect();
}

export const joinRoom = (roomId) => {
    socket.emit('joinRoom', { id: roomId });
}
export const leaveRoom = (roomId) => {
    socket.emit('leaveRoom', { id: roomId });
}

export const getSocketId = () => {
    return socket.id;
}

// export const listenToAnyEvent = (callBackFn) =>{
//     socket.onAny(callBackFn);
//     // socket.onAny((event) => {
//     //     console.log(`${event.name} was called with data: `, event.items);
//     // });
// }


export const listenToMessages = (callBackFn) => {

    socket.on('message', callBackFn)
    // socket.on('message', msg=>{
    //     alert(`new message ${msg.content}`)
    // })

}
export const sendMessage = async(roomId, message) => {
    let tokenObj=await getDecodedToken();
    socket.emit('message', { chatRoomId: roomId, message,sentBy:tokenObj?.userId,read:false });
}