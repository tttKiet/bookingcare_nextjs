"use client";

import { API_CHAT } from "@/api-services/constant-api";
import { socketApi } from "@/api-services/socket-api";
import { useAuth } from "@/hooks";
import { ChatRoom } from "@/models";
import { Avatar, useDisclosure, User } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  IoMdArrowDropleftCircle,
  IoMdArrowDroprightCircle,
} from "react-icons/io";
import useSWR from "swr";
import ChatRoomMessageBox from "./ChatRoomMessageBox";
import ChatRoomMessageBoxStaff from "./ChatRoomMessageBoxStaff";

export default function BoxChatStaff() {
  const { profile } = useAuth();

  const { isOpen, onClose, onOpen } = useDisclosure({
    id: "details",
  });

  const [staffIdChat, setStaffIdChat] = useState<ChatRoom | undefined>(
    undefined
  );

  const { data: resRoomChat, mutate } = useSWR<ChatRoom[]>(
    `${API_CHAT}/room?staffId=${profile?.id || ""}`,
    {
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );

  function handleClickRoom(r: ChatRoom) {
    setStaffIdChat(r);
    socketApi.joinRoomChat({ chatRoomId: r.id });
  }

  return (
    <div className="flex justify-start gap-6">
      <div className="col-span-4 box-white min-w-[300px]">
        <h3 className="p-[24px] pt-0  text-lg font-bold gap-2 flex items-center gfap-2 justify-between">
          Box chat
        </h3>

        <div className=" flex flex-col items-start justify-start">
          {resRoomChat?.map((r: ChatRoom) => (
            <div
              className={`${
                staffIdChat?.id == r.id ? " bg-[#aec5e67a] shadow" : ""
              } w-full px-[24px] py-[10px] text-left flex-shrink-0 rounded-lg `}
              key={r.id}
              onClick={() => handleClickRoom(r)}
            >
              <div className="flex items-start gap-4">
                <Avatar isBordered name={r.User.fullName} />
                <div>
                  <h4 className="font-medium text-[#1b3c74]">
                    {r.User.fullName}
                  </h4>
                  <p
                    className="text-[#3c4253
]"
                  >
                    {" "}
                    {r.User.email}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="box-white flex-1 ">
        <ChatRoomMessageBoxStaff chatRoom={staffIdChat} />
      </div>
    </div>
  );
}
