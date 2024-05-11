"use client";

import { API_CHAT } from "@/api-services/constant-api";
import { socketApi } from "@/api-services/socket-api";
import { useAuth } from "@/hooks";
import { ChatRoom } from "@/models";
import { Avatar, useDisclosure, User } from "@nextui-org/react";
import { motion } from "framer-motion";
import male from "../../assets/images/doctor/male_doctor.png";
import female from "../../assets/images/doctor/female_doctor.png";
import { useEffect, useState } from "react";
import {
  IoMdArrowDropleftCircle,
  IoMdArrowDroprightCircle,
} from "react-icons/io";
import useSWR from "swr";
import ChatRoomMessageBox from "./ChatRoomMessageBox";
import socket from "@/api-services/socket/config";
import { useRouter, useSearchParams } from "next/navigation";

export default function TagUserChat() {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const { profile } = useAuth();
  const router = useRouter();

  const { isOpen, onClose, onOpen } = useDisclosure({
    id: "details",
  });

  const [staffIdChat, setStaffIdChat] = useState<ChatRoom | undefined>(
    undefined
  );

  const { data: resRoomChat, mutate } = useSWR<ChatRoom[]>(
    `${API_CHAT}/room?userId=${profile?.id || ""}`,
    {
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );

  function handleClickRoom(r: ChatRoom) {
    if (chatId)
      router.replace(`/user?tag=chat`, {
        scroll: false,
      });
    setStaffIdChat(r);
    socketApi.joinRoomChat({ chatRoomId: r.id });
  }

  useEffect(() => {
    if (chatId) {
      const r = resRoomChat?.find((r) => r.staffId == chatId);
      setStaffIdChat(r);
    }
  }, [chatId, resRoomChat]);

  return (
    <div className="flex justify-start gap-3 ">
      <motion.div
        initial={{ width: "280px" }}
        animate={
          !isOpen
            ? { width: "280px", minHeight: "200px" }
            : { width: "60px", minHeight: "60px" }
        }
        className=""
      >
        {!isOpen ? (
          <motion.div
            key={1}
            style={{ overflow: "hidden" }}
            transition={{ duration: 0.4 }}
            exit={{ opacity: 0 }}
            className="col-span-4 bg-white  pb-12 rounded-lg shadow-md "
          >
            <h3 className="p-[24px] text-[#1b3c74] pt-0 text-lg font-bold gap-2 flex items-center gfap-2 justify-between">
              Chat
              <span
                onClick={() => {
                  onOpen();
                }}
                className="py-4 cursor-pointer hover:opacity-80 "
              >
                <IoMdArrowDropleftCircle size={26} color="#1b3c74" />
              </span>
            </h3>

            <div className=" flex flex-col items-start ">
              {resRoomChat?.map((r: ChatRoom) => (
                <div
                  className={`${
                    staffIdChat?.id == r.id ? " bg-[#aec5e67a] " : ""
                  } w-full px-[24px] py-[10px] `}
                  key={r.id}
                  onClick={() => handleClickRoom(r)}
                >
                  <div className="flex items-start gap-4">
                    <Avatar
                      src={r.Staff.gender == "male" ? male.src : female.src}
                      className="flex-shrink-0"
                      isBordered
                      name={r.Staff.fullName}
                    />
                    <div>
                      <h4 className="font-medium text-[#1b3c74]">
                        {r.Staff.fullName}
                      </h4>
                      <p
                        className="text-[#3c4253
  ]"
                      >
                        {r.Staff.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            style={{ overflow: "hidden" }}
            transition={{ duration: 0.4 }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white shadow-lg rounded-lg flex items-center justify-center"
          >
            <span
              onClick={() => {
                onClose();
              }}
              className="py-4 cursor-pointer hover:opacity-80"
            >
              <IoMdArrowDroprightCircle size={26} />
            </span>
          </motion.div>
        )}
      </motion.div>
      <ChatRoomMessageBox chatRoom={staffIdChat} />
    </div>
  );
}
