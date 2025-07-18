import React, { useRef, useEffect } from "react";
import { EnhancedChatItem, Message } from "@/types/chat";
import { Message as MessageComponent } from "./Message";
import { Badge } from "@/components/ui/badge";
import { ModernChatInput } from "./ChatInput";

interface ChatWindowProps {
  chat: EnhancedChatItem;
  messages: Message[];
  onSendMessage: (
    content: string,
    imageUrl?: string,
    audioUrl?: string
  ) => void;
  currentUserId: string;
  onDeleteMessage?: (messageId: string) => void;
  loadingMoreMessages?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function ChatWindow({
  chat,
  messages,
  onSendMessage,
  currentUserId,
  onDeleteMessage,
  loadingMoreMessages,
  ...props
}: ChatWindowProps & {
  setPendingImageUrl?: (url: string) => void;
  setPendingAudioUrl?: (url: string) => void;
  isNewChat?: boolean;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(messages.length);
  const prevScrollHeight = useRef<number | null>(null);
  const MAX_SIZE_MB = 2;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (loadingMoreMessages) {
      if (messagesContainerRef.current) {
        prevScrollHeight.current = messagesContainerRef.current.scrollHeight;
      }
      prevMessagesLength.current = messages.length;
    }
  }, [loadingMoreMessages, messages.length]);

  useEffect(() => {
    if (!loadingMoreMessages && prevMessagesLength.current < messages.length) {
      if (messagesContainerRef.current && prevScrollHeight.current !== null) {
        const container = messagesContainerRef.current;
        const newScrollHeight = container.scrollHeight;
        container.scrollTop =
          newScrollHeight - (prevScrollHeight.current - container.scrollTop);
      }
      prevMessagesLength.current = messages.length;
      prevScrollHeight.current = null;
      return;
    }
    if (!loadingMoreMessages) {
      scrollToBottom();
    }
  }, [messages, loadingMoreMessages]);

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  if (Array.isArray(messages)) {
    messages.forEach((msg) => {
      const dateLabel = getDateLabel(msg.timestamp);
      if (
        !groupedMessages.length ||
        groupedMessages[groupedMessages.length - 1].date !== dateLabel
      ) {
        groupedMessages.push({ date: dateLabel, messages: [msg] });
      } else {
        groupedMessages[groupedMessages.length - 1].messages.push(msg);
      }
    });
  }

  function getDateLabel(dateString: string) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Handle file selection and validation
  const handleFileChange = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return;
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-primary-light)]/20 ">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center text-[var(--color-surface)] font-medium text-lg`}
          >
            {(chat.displayName?.charAt(0) || "?").toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[var(--color-primary-dark)] text-base">
              {chat.displayName}
            </span>
            {chat.role !== "USER" && (
              <Badge className="text-xs px-2 py-0.5 bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] rounded-md w-fit">
                {chat.role.charAt(0).toUpperCase() +
                  chat.role.slice(1).toLowerCase()}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex-1" />
      </div>
      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-[var(--color-surface)]"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center text-[var(--color-muted)]">
            <svg
              width="80"
              height="80"
              fill="none"
              viewBox="0 0 80 80"
              className="mx-auto mb-6"
            >
              <rect width="80" height="80" rx="16" fill="#EEF2FF" />
              <path
                d="M24 56V32a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v24l-8-4-8 4-8-4-8 4Z"
                fill="#6366F1"
              />
              <circle cx="32" cy="40" r="2" fill="#fff" />
              <circle cx="40" cy="40" r="2" fill="#fff" />
              <circle cx="48" cy="40" r="2" fill="#fff" />
            </svg>
            <h3 className="text-lg font-semibold mb-2 text-[var(--color-primary-dark)]">
              No messages yet
            </h3>
            <p className="mb-4 text-sm">
              Start the conversation! Say hello and break the ice.
            </p>
            <span className="inline-block px-4 py-2 bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] rounded-full text-xs font-medium">
              Type your first message below
            </span>
          </div>
        ) : (
          groupedMessages.map((group, idx) => (
            <div key={idx} className="space-y-4">
              <div className="text-center text-xs text-[var(--color-muted)] mb-2">
                {group.date}
              </div>
              {group.messages.map((msg) => (
                <MessageComponent
                  key={msg.id}
                  message={msg}
                  currentUserId={currentUserId}
                  chat={chat}
                  onDelete={
                    onDeleteMessage ? () => onDeleteMessage(msg.id) : undefined
                  }
                />
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Chat Input */}
      <ModernChatInput
        onSendMessage={onSendMessage}
        disabled={false}
        isNewChat={chat.type === "user"}
        setPendingImageUrl={props.setPendingImageUrl}
        setPendingAudioUrl={props.setPendingAudioUrl}
      />
    </div>
  );
}
