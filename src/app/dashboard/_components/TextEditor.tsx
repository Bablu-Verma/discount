"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

import Image from "@tiptap/extension-image";
import { useState } from "react";

const TiptapEditor = () => {
  const [editorContent, setEditorContent] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCode, setShowCode] = useState<boolean>(false);
  const editor = useEditor({
    extensions: [
      
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }), 
      FontFamily,
      Link.configure({
        openOnClick: true,
      }),
      Image.configure({
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: "<p>Hello, this is your editor!</p>",
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
  });

  if (!editor) return null;

  // Utility Functions
  const addTable = () =>
    editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run();
  const addRow = () => editor.chain().focus().addRowAfter().run();
  const addColumn = () => editor.chain().focus().addColumnAfter().run();
  const deleteRow = () => editor.chain().focus().deleteRow().run();
  const deleteColumn = () => editor.chain().focus().deleteColumn().run();
  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();
  const selectAll = () => editor.chain().focus().selectAll().run();

  const setFontFamily = (font: string) =>
    editor.chain().focus().setFontFamily(font).run();

  const setColor = (color: string) =>
    editor.chain().focus().setColor(color).run();
  const addLink = () => {
    const url = prompt("Enter URL");
    if (url)
      editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
  };
  const addImage = () => {
    const url = prompt("Enter image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };


  const setHighlight = (color: string) =>
    editor.chain().focus().toggleHighlight({ color }).run();



  return (
    <div
      className={
        isFullscreen
          ? "fixed w-[vw] overflow-y-auto p-8 h-full top-0 left-0 right-0 bottom-0 bg-white z-[9999]"
          : "border p-4 bg-white rounded-md shadow-md"
      }
    >
      <div className=" mb-4 p-2 editor_tool_bar sticky top-0 z-[99999] bg-white">
        {/* Toolbar */}
        <div className="mb-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={undo}
            className="bg-gray-400 text-white px-2 py-1 rounded"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={redo}
            className="bg-gray-400 text-white px-2 py-1 rounded"
          >
            Redo
          </button>
          <select
            onChange={(e) => {
              const level = Number(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6;
              editor.chain().focus().toggleHeading({ level }).run();
            }}
            className="border px-2 py-1 rounded"
          >
            <option value="">Heading</option>
            <option value="1">H1</option>
            <option value="2">H2</option>
            <option value="3">H3</option>
            <option value="4">H4</option>
            <option value="5">H5</option>
            <option value="6">H6</option>
          </select>
          <button
            type="button"
            onClick={selectAll}
            className="bg-gray-600 text-white px-2 py-1 rounded"
          >
            Select All
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Underline
          </button>

          <button
            type="button"
            onClick={addLink}
            className="bg-purple-500 text-white px-2 py-1 rounded"
          >
            Add Link
          </button>
          <button
            type="button"
            onClick={addImage}
            className="bg-purple-500 text-white px-2 py-1 rounded"
          >
            Add Image
          </button>

          {/* Font Family */}
          <select
            onChange={(e) => setFontFamily(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="">Font Family</option>
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
          </select>

          {/* Text Color */}
         <div className="flex flex-nowrap items-center gap-2">
         <label htmlFor="text_color">Text Color</label>
          <input
            type="color"
            id="text_color"
            onChange={(e) => setColor(e.target.value)}
            title="Text Color"
          />
         </div>

          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            className="bg-purple-500 text-white px-2 py-1 rounded"
          >
            {showCode ? "Hide" : "Show"} Code
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-purple-500 text-white px-2 py-1 rounded"
          >
            {isFullscreen ? "Small Screen" : "Full Screen"}
          </button>

          <div className="flex flex-nowrap items-center gap-2">
            <label htmlFor="bg_color">Background</label>
            <input
              type="color"
              id="bg_color"
              onChange={(e) => setHighlight(e.target.value)}
              title="Background Color"
            />
          </div>
           {/* List Buttons */}
           <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            Bullet List
          </button>
          <button
           type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            Numbered List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
             type="button"
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            Task List
          </button>
        </div>

        {/* Table Controls */}
        <div className=" space-x-2">
          <button
            type="button"
            onClick={addTable}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Insert Table
          </button>
          <button
            type="button"
            onClick={addRow}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            Add Row
          </button>
          <button
            type="button"
            onClick={addColumn}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            Add Column
          </button>
          <button
            type="button"
            onClick={deleteRow}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete Row
          </button>
          <button
            type="button"
            onClick={deleteColumn}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete Column
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="" />

      {showCode && (
        <div className="mt-4 p-2 border-t ">
          <h3 className="font-semibold">Editor Output (HTML):</h3>
          <div className="text-sm">{editorContent}</div>
        </div>
      )}
    </div>
  );
};

export default TiptapEditor;
