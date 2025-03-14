"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.GEMINI_API_KEY;
const PORT = Number(process.env.PORT) || 8080;
const wss = new ws_1.WebSocketServer({ port: PORT, host: "0.0.0.0" });
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyAUOMKTtMI6zeHTnoK9xj0WGK6JUSgxIC4");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
let allSockets = [];
const mailid = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        function idexist() {
            for (let i = 0; i < mailid.length; i++) {
                if (parsedMessage.mailid === mailid[i]) {
                    socket.send("email id already exists");
                    return false;
                }
            }
            return true;
        }
        if (parsedMessage.mailid && idexist()) {
            mailid.push(parsedMessage.mailid);
        }
        function apirun() {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield model.generateContent(parsedMessage.payload.message);
                socket.send(result.response.text());
            });
        }
        apirun();
    });
});
