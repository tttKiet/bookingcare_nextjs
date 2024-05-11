"use client";

import { Avatar, Divider, Input, User } from "@nextui-org/react";
import { CiLocationArrow1 } from "react-icons/ci";
import MessageChat from "./MessageChat";
import { ChatMessage, ChatRoom } from "@/models";
import { useEffect, useRef, useState } from "react";
import { socketApi } from "@/api-services/socket-api";
import socket from "@/api-services/socket/config";
import { API_CHAT } from "@/api-services/constant-api";
import useSWR from "swr";
import male from "../../assets/images/doctor/male_doctor.png";
import female from "../../assets/images/doctor/female_doctor.png";
import { useAuth, useDisPlay } from "@/hooks";

export interface IChatRoomMessageBoxProps {
  chatRoom: ChatRoom | undefined;
}

export default function ChatRoomMessageBoxStaff({
  chatRoom,
}: IChatRoomMessageBoxProps) {
  const { profile } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<string>("");
  const { data: resRoomChatMessage, mutate: mutateMsg } = useSWR<ChatMessage[]>(
    `${API_CHAT}/room-message?chatRoomId=${chatRoom?.id || ""}`,
    {
      revalidateOnMount: true,
    }
  );

  const { data: resRoomChat, mutate } = useSWR<ChatRoom[]>(
    `${API_CHAT}/room?staffId=${profile?.id || ""}`,
    {
      revalidateOnMount: true,
    }
  );

  function handleChatMessage() {
    if (value && chatRoom?.id)
      socketApi.chatMessage({
        chatRoomId: chatRoom?.id,
        message: value,
        role: "staff",
      });
    mutateMsg();
    // `${API_CHAT}/room-message?chatRoomId=${chatRoom?.id || ""}`,
    // true
    setValue("");
  }

  useEffect(() => {
    socket.on("chat_message_created", (msg: ChatMessage) => {
      mutateMsg();
      mutate();
    });
  }, [socket, resRoomChatMessage]);

  useEffect(() => {
    if (
      messagesEndRef &&
      messagesEndRef.current &&
      messagesEndRef.current?.scrollHeight
    ) {
      const currentRef = messagesEndRef.current;
      if (currentRef) {
        currentRef.scrollTop = currentRef.scrollHeight;
      }
    }
  }, [resRoomChatMessage]);

  return (
    <div className="mb-6 flex-1">
      {chatRoom ? (
        <div className="text-left">
          <div className="flex items-start gap-4">
            <Avatar isBordered name={chatRoom?.User.fullName} />
            <div>
              <h4 className="font-medium text-[#1b3c74]">
                {chatRoom.User.fullName}
              </h4>
              <p
                className="text-[#3c4253
  ]"
              >
                {chatRoom.User.email}
              </p>
            </div>
          </div>
          <Divider className="my-3"></Divider>

          <div
            ref={messagesEndRef}
            style={{
              scrollBehavior: "smooth",
            }}
            className="mt-6 flex flex-col-reverse gap-6 [46vh] h-[46vh] overflow-y-auto pr-4 
            
        "
          >
            {resRoomChatMessage?.map((msg) => (
              <MessageChat type="staff" chatMessage={msg} />
            ))}
          </div>

          <div className="mt-8">
            <Input
              value={value}
              onKeyDown={(e) => {
                console.log("e", e.code);
                if (e.code == "Enter") {
                  handleChatMessage();
                }
              }}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Viết tin nhắn"
              classNames={{
                innerWrapper: "pl-4",
              }}
              endContent={
                <span
                  onClick={handleChatMessage}
                  className="cursor-pointer p-3 hover:opacity-80 transition-all"
                >
                  <CiLocationArrow1 size={20} />
                </span>
              }
            ></Input>
          </div>
        </div>
      ) : (
        <div className="my-5 text-center font-medium">Hãy chọn người nhắn.</div>
      )}
    </div>
  );
}
