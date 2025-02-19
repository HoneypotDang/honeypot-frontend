"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  chatService,
  presetQuestionType,
  presetQuestions,
  questionRelatedPages,
  questionTitles,
} from "@/services/chat";
import { Tooltip } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import { Message } from "@/services/chat";

export const CustomerServiceChat = observer(() => {
  const [inputMessage, setInputMessage] = useState("");
  const [isPresetExpanded, setIsPresetExpanded] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatService.messages, scrollToBottom]);

  const handelQuestionClick = (question: presetQuestionType) => {
    handleClearChat();
    chatService.agentMessage(question.answer);
  };

  const handleClearChat = () => {
    chatService.clearChat();
  };

  return (
    <div className="flex flex-col h-[100vh] sm:h-[600px] w-full sm:w-[450px] md:w-[550px] border rounded-lg shadow-lg bg-[#3E2A0F] text-[#F5E6D3]">
      <div className="bg-[#FFCD4D] text-[#3E2A0F] p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="text-xl font-bold">Grizzly Guide</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => chatService.setChatIsOpen(false)}
          className="hover:bg-[#FFE0A3] text-[#3E2A0F]"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close chat</span>
        </Button>
      </div>
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <div className="p-3">
          <Card
            className={`mb-4 bg-[#5D4B2C] border-[#FFCD4D] border transition-all duration-300 ${
              isPresetExpanded ? "max-h-[210px]" : "h-[48px]"
            } overflow-hidden`}
          >
            <CardHeader className="py-2 px-3 flex flex-row items-center justify-between space-y-0 border-b border-[#FFCD4D]">
              <CardTitle className="text-sm font-medium text-[#FFCD4D]">
                Common Questions
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 hover:bg-[#7A6236] text-[#FFCD4D]"
                onClick={() => setIsPresetExpanded(!isPresetExpanded)}
              >
                {isPresetExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {isPresetExpanded ? "Collapse" : "Expand"} common questions
                </span>
              </Button>
            </CardHeader>
            <CardContent
              className={`py-2 px-3 overflow-y-auto transition-all duration-300 ${
                isPresetExpanded ? "max-h-[162px]" : "max-h-0"
              }`}
            >
              {isPresetExpanded && (
                <div className="flex flex-col space-y-2">
                  {Object.entries(presetQuestions)
                    .sort((a, b) => {
                      const currentPath = window.location.pathname;
                      const currentPathQuestions =
                        chatService.findRelatedQuestionsByPath(currentPath);
                      if (currentPathQuestions) {
                        //if the question is in the current path, it should be at the top
                        return currentPathQuestions.includes(
                          a[0] as questionTitles
                        )
                          ? -1
                          : 1;
                      }
                      return 0;
                    })
                    .map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handelQuestionClick(question[1])}
                        className="justify-start bg-[#7A6236] text-[#F5E6D3] hover:bg-[#8F7A4F] border-[#FFCD4D] whitespace-normal text-left h-auto py-1.5 px-2 text-xs"
                      >
                        <div className="flex items-center justify-between w-full">
                          {question[1].quesiton}
                          {chatService
                            .findRelatedQuestionsByPath(
                              window.location.pathname
                            )
                            ?.includes(question[0] as questionTitles) && (
                            <Star
                              fill="currentColor"
                              className="h-4 w-4 z-10"
                            />
                          )}
                        </div>
                      </Button>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
          <div className="flex-grow overflow-y-auto">
            {chatService.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <div
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.sender === "user"
                      ? "bg-[#FFCD4D] text-[#3E2A0F]"
                      : "bg-[#5D4B2C] text-[#F5E6D3]"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      {/* <div className="p-4 border-t border-[#FFCD4D]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputMessage);
          }}
          className="flex items-center"
        >
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow mr-2 bg-[#5D4B2C] text-[#F5E6D3] border-[#FFCD4D] focus:ring-[#FFCD4D] focus:border-[#FFCD4D]"
          />
          <Button
            type="submit"
            size="icon"
            className="bg-[#FFCD4D] text-[#3E2A0F] hover:bg-[#FFE0A3]"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div> */}
    </div>
  );
});

export default CustomerServiceChat;
