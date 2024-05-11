import { Booking, LoginPayLoad, PatientProfile, Review, User } from "@/models";
import axios from "../axios";
import { ResData } from "@/types";
import {
  API_ACCOUNT_USER,
  API_BOOKING,
  API_PATIENT_PROFILE,
  API_REVIEW_DOCTOR,
  API_USER_CHANGE_PASS,
} from "./constant-api";
import socket from "./socket/config";

export const socketApi = {
  async joinRoom({ staffId, userId }: { staffId: string; userId: string }) {
    socket.emit("join_room", { staffId, userId });
  },
  async joinRoomChat({ chatRoomId }: { chatRoomId: string }) {
    socket.emit("join_room_chat", { chatRoomId });
  },

  async chatMessage({
    chatRoomId,
    message,
    role,
  }: {
    chatRoomId: string;
    message: string;
    role: string;
  }) {
    console.log("send", { chatRoomId, message, role });
    socket.emit("chat_message", { chatRoomId, message, role });
  },
};
