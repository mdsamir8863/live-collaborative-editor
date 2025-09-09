"use client";

import { useRef } from "react";
import Editor from "../components/Editor";
import ChatSidebar from "../components/ChatSidebar";

export default function HomePage() {
  const editorRef = useRef(null);

  return (
    <div className="h-screen flex flex-col sm:flex-row">
      {/* Left: Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor ref={editorRef} />
      </div>

      {/* Right: Chat Sidebar */}
      <div className="sm:w-80 w-full h-[40%] sm:h-full border-t sm:border-t-0 sm:border-l">
        <ChatSidebar editorRef={editorRef} />
      </div>
    </div>
  );
}
