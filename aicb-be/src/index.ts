import { WebSocketServer, WebSocket } from "ws";
import dotenv from 'dotenv';
dotenv.config();
const apiKey = process.env.GEMINI_API_KEY;
const PORT = Number(process.env.PORT) || 8080;
const wss = new WebSocketServer({ port: PORT, host: "0.0.0.0" });
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyAUOMKTtMI6zeHTnoK9xj0WGK6JUSgxIC4");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


interface User {
    socket : WebSocket;
    room : String;
}


let allSockets: User[] = []

const mailid : string[] = []


wss.on("connection",(socket) => {


    
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message as unknown as string);
        function idexist(){
            for(let i=0;i<mailid.length;i++){
                if (parsedMessage.mailid === mailid[i]){
                    socket.send("email id already exists")
                    return false
                }
            }
            return true
        }

        if(parsedMessage.mailid && idexist()){
            mailid.push(parsedMessage.mailid)
        }
        

        async function apirun(){
            const result = await model.generateContent(parsedMessage.payload.message);
            socket.send(result.response.text())
        }
        apirun()
    })

})

