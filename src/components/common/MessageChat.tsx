import { useAuth } from "@/hooks";
import { ChatMessage } from "@/models";
import { Avatar, User } from "@nextui-org/react";
import moment from "moment";
import { useMemo } from "react";
import male from "../../assets/images/doctor/male_doctor.png";
import female from "../../assets/images/doctor/female_doctor.png";
export interface IMessageChatProps {
  chatMessage: ChatMessage;
  type?: "staff" | undefined;
}

export default function MessageChat({ chatMessage, type }: IMessageChatProps) {
  const { profile } = useAuth();
  const isme = useMemo(() => {
    if (type == "staff") {
      return chatMessage.role == "staff" && profile?.Role?.keyType == "doctor";
    } else if (chatMessage.role == "user" && !profile?.Role) return true;
    return false;
  }, [profile, chatMessage]);
  return (
    <>
      {!isme ? (
        <>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Avatar
                // name="ss"
                name={`${
                  chatMessage.role == "staff"
                    ? chatMessage?.ChatRoom?.Staff?.fullName
                    : chatMessage?.ChatRoom?.User?.fullName
                }`}
              />
            </div>
            <div className="flex items-end gap-4">
              <div className="p-4 pt-2 bg-[#ebf3fe] rounded-[28px] rounded-tl-none">
                <div className="font-bold text-[#1b3c74]">
                  {chatMessage.role == "staff"
                    ? chatMessage?.ChatRoom?.Staff?.fullName
                    : chatMessage?.ChatRoom?.User?.fullName}
                </div>
                <div>{chatMessage.message}</div>
              </div>
              <div className="text-[#a2a2ba]">
                {moment(chatMessage.createdAt).format("L")}
                <span>, </span>
                {moment(chatMessage.createdAt).format("LT")}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-end">
            <div className="flex items-start gap-3 max-w-[80%] ">
              <div className="flex items-end gap-4">
                <div className="text-[#565660]">
                  <div className="text-[#a2a2ba]">
                    {moment(chatMessage.createdAt).format("L")}
                    <span>, </span>
                    {moment(chatMessage.createdAt).format("LT")}
                  </div>
                </div>
                <div className="p-4 pt-2 bg-[#ebf3fe] rounded-[28px] rounded-tr-none">
                  <div className="font-bold text-[#1b3c74]">
                    {chatMessage.role == "staff"
                      ? chatMessage?.ChatRoom?.Staff?.fullName
                      : chatMessage?.ChatRoom?.User?.fullName}
                  </div>
                  {chatMessage.message}
                </div>
              </div>
              <div className="flex-shrink-0">
                {chatMessage.role == "staff" ? (
                  <Avatar
                    // name="ss"
                    src={
                      chatMessage?.ChatRoom?.Staff.gender == "male"
                        ? male.src
                        : female.src
                    }
                  />
                ) : (
                  <Avatar
                    // name="ss"
                    name={`${
                      chatMessage.role == "staff"
                        ? chatMessage?.ChatRoom?.Staff?.fullName
                        : chatMessage?.ChatRoom?.User?.fullName
                    }`}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
