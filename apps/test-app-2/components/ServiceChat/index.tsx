import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomerServiceChat from "./Chat";
import { chatService } from "@/services/chat";
import { observer } from "mobx-react-lite";

export const ChatWidget = observer(() => {
  return (
    <div className="z-50">
      {chatService.chatIsOpen ? (
        <div className="fixed bottom-0 right-0 w-full sm:w-[450px] md:w-[550px]">
          <CustomerServiceChat />
        </div>
      ) : (
        <Button
          onClick={() => chatService.setChatIsOpen(true)}
          size="icon"
          className="fixed bottom-1 right-1 w-12 h-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 bg-yellow-300"
        >
          <MessageCircle className="h-6 w-6 " />
          <span className="sr-only">QA</span>
        </Button>
      )}
    </div>
  );
});

export default ChatWidget;
