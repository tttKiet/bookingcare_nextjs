"use client";

import { Divider, Input, Link, User } from "@nextui-org/react";
import { CiLocationArrow1 } from "react-icons/ci";
import MessageChat from "./MessageChat";
import { ChatMessage, ChatRoom } from "@/models";
import { useEffect, useRef, useState } from "react";
import { socketApi } from "@/api-services/socket-api";
import socket from "@/api-services/socket/config";
import { API_CHAT } from "@/api-services/constant-api";
import useSWR from "swr";
import { useAuth, useDisPlay } from "@/hooks";
import { profile } from "console";
import male from "../../assets/images/doctor/male_doctor.png";
import female from "../../assets/images/doctor/female_doctor.png";
export interface IChatRoomMessageBoxProps {
  chatRoom: ChatRoom | undefined;
}

export default function ChatRoomMessageBox({
  chatRoom,
}: IChatRoomMessageBoxProps) {
  const { profile } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<string>("");

  const { data: resRoomChatMessage, mutate: mutateMsg } = useSWR<ChatMessage[]>(
    `${API_CHAT}/room-message?chatRoomId=${chatRoom?.id || ""}`
  );

  const { data: resRoomChat, mutate } = useSWR<ChatRoom[]>(
    `${API_CHAT}/room?userId=${profile?.id || ""}`,
    {
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );

  function handleChatMessage() {
    if (value && chatRoom?.id)
      socketApi.chatMessage({
        chatRoomId: chatRoom?.id,
        message: value,
        role: "user",
      });
    mutateMsg();
    mutate();
    setValue("");
  }

  useEffect(() => {
    socket.on("chat_message_created", (msg: ChatMessage) => {
      mutateMsg();
      mutate();
    });
  }, [socket]);

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
    <div className="box-white mb-6 flex-1">
      {chatRoom ? (
        <div>
          <User
            name={
              <Link
                href={"/profile-doctor/" + chatRoom?.staffId}
                className="font-medium"
              >
                {chatRoom?.Staff?.fullName}
              </Link>
            }
            description={
              <div>
                {chatRoom?.Staff?.AcademicDegree?.name} |{" "}
                {chatRoom?.Staff?.Specialist?.name}
              </div>
            }
            avatarProps={{
              src: chatRoom?.Staff.gender == "male" ? male.src : female.src,
            }}
          />
          <Divider className="my-3"></Divider>

          <div
            ref={messagesEndRef}
            style={{
              scrollBehavior: "smooth",
            }}
            className="mt-6 flex flex-col-reverse gap-6 max-h-[46vh] h-[46vh] overflow-y-auto pr-4 
            
        "
          >
            {resRoomChatMessage?.map((msg) => (
              <MessageChat key={msg.id} chatMessage={msg} />
            ))}
            {resRoomChatMessage?.length == 0 && (
              <div className="my-5 text-center font-medium">
                Chưa có tin nhắn nào.
              </div>
            )}
          </div>

          <div className="mt-8">
            <Input
              value={value}
              onKeyDown={(e) => {
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
