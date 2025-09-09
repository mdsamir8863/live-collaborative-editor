"use client";

import React, { forwardRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import { Bold } from "@tiptap/extension-bold";
import { Italic } from "@tiptap/extension-italic";
import { Underline } from "@tiptap/extension-underline";
import { Strike } from "@tiptap/extension-strike";
import { CodeBlock } from "@tiptap/extension-code-block";

import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Code as CodeIcon,
} from "lucide-react";

const Editor = forwardRef(({ initialContent }, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Strike,
      CodeBlock,
      Placeholder.configure({
        placeholder: "Start typing your content...", // now it disappears when typing
        showOnlyWhenEditable: true,
      }),
    ],
    content: initialContent || "",
    immediatelyRender: false,
  });

  const addMark = (mark) => editor?.chain().focus()[mark]().run();
  const addNode = (node) => editor?.chain().focus()[node]().run();

  return (
    <div className="border rounded-lg w-full max-w-4xl mx-auto bg-white shadow-md p-2 md:p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-3 justify-start">
        <button
          onClick={() => addMark("toggleBold")}
          className="p-2 border rounded hover:bg-gray-100 flex items-center justify-center"
          title="Bold"
        >
          <BoldIcon size={18} />
        </button>
        <button
          onClick={() => addMark("toggleItalic")}
          className="p-2 border rounded hover:bg-gray-100 flex items-center justify-center"
          title="Italic"
        >
          <ItalicIcon size={18} />
        </button>
        <button
          onClick={() => addMark("toggleUnderline")}
          className="p-2 border rounded hover:bg-gray-100 flex items-center justify-center"
          title="Underline"
        >
          <UnderlineIcon size={18} />
        </button>
        <button
          onClick={() => addMark("toggleStrike")}
          className="p-2 border rounded hover:bg-gray-100 flex items-center justify-center"
          title="Strike"
        >
          S
        </button>
        <button
          onClick={() => addNode("toggleCodeBlock")}
          className="p-2 border rounded hover:bg-gray-100 flex items-center justify-center"
          title="Code Block"
        >
          {"<>"}
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="border rounded-lg p-4 min-h-[50px] focus:outline-none bg-gray-50 shadow-inner text-gray-800 text-base md:text-lg transition-colors duration-200"
      />
    </div>
  );
});

export default Editor;
