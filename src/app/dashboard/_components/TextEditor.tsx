"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEditorData } from "@/redux-store/slice/editorSlice";
import DOMPurify from "dompurify";
import axios from "axios";
import { upload_image_api } from "@/utils/api_url";
import { RootState } from "@/redux-store/redux_store";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

import Quill from "quill";



interface ISTemplate {
  name: string;
  content: string;
}

const TextEditor: React.FC = () => {
  const [showTemplate, setShowTemplate] = useState<boolean>(false);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorContent = useSelector((state: RootState) => state.editor.content);
  const token = useSelector((state: RootState) => state.user.token);
  const dispatch = useDispatch();
  const [initialchange, setInitialchange] = useState(true);

  const modules = {
    toolbar: "#toolbar",
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true,
    },
    table: true,
  };

  const theme = "snow";
  const placeholder = "Enter your content";

  const { quill, quillRef } = useQuill({
    theme,
    modules,
    placeholder,
  });

  const [templates] = useState<ISTemplate[]>([
    {
      name: "Blog Template",
      content: "<div class='blog_template'>Add Blog</div>",
    },
    {
      name: "Campaign Template",
      content: "<div class='campaign_template'>Campaign Add</div>",
    },
    {
      name: "Category Template",
      content: "<div class='category_template'>Category Add</div>",
    },
  ]);

 

  useEffect(() => {
    if (quill) {
      const toolbar = quill.getModule("toolbar") as any;


       


      // Select All
      const selectAllButton = document.querySelector(".ql-select-all");
      if (selectAllButton) {
        selectAllButton.addEventListener("click", () => {
          quill.setSelection(0, quill.getLength());
        });
      }

      // Undo/Redo Handlers
      const undoButton = document.querySelector(".undo__tool");
      if (undoButton) {
        undoButton.addEventListener("click", () => {
          quill.history.undo();
        });
      }

      const redoButton = document.querySelector(".redo__tool");
      if (redoButton) {
        redoButton.addEventListener("click", () => {
          quill.history.redo();
        });
      }

      // Horizontal Line Handler
      const dividerButton = document.querySelector(".ql-divider");
      if (dividerButton) {
        dividerButton.addEventListener("click", () => {
          const range = quill.getSelection();
          if (range) {
            quill.clipboard.dangerouslyPasteHTML(range.index + 1, "<hr class='border-t border-gray-400'>");
          }
        });
      }

      // Image Upload
      toolbar.addHandler("image", () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
          if (input.files && input.files[0]) {
            const file = input.files[0];
            const imageUrl = await imageUploadHandler(file);
            const range = quill.getSelection();
            if (range) {
              quill.insertEmbed(range.index, "image", imageUrl);
            } else {
              quill.insertEmbed(quill.getLength(), "image", imageUrl);
            }
          }
        };
      });

      // Text Change Handler
      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        const sanitizedHtml = DOMPurify.sanitize(html);
        dispatch(setEditorData(sanitizedHtml));
      });

      if (editorContent && initialchange) {
        quill.clipboard.dangerouslyPasteHTML(editorContent);
        setInitialchange(false);
      }
    }
  }, [quill, dispatch, editorContent, initialchange]);

  const imageUploadHandler = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("file_name", "editor_image");
    try {
      const { data } = await axios.post(upload_image_api, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      return data.responce.url;
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleTemplateChange = (value: string) => {
    const selected = templates.find((t) => t.name === value) || null;
    if (selected && quill) {
      quill.clipboard.dangerouslyPasteHTML(selected.content);
      dispatch(setEditorData(selected.content));
      setShowTemplate(false);
    }
  };

  return (
    <>
      <div
        className={
          isFullscreen
            ? "fixed top-0 z-[9999] h-[100vh] left-0 w-[100vw] bg-white"
            : "text-editor relative h-[450px] mb-12"
        }
      >
        <div className="relative max-w-[200px]">
          {showTemplate && (
            <div className="absolute top-20 z-20 left-4 bg-white border-[1px] border-gray-500 text-secondary rounded-md p-2 select-none">
              {templates.map((template, index) => (
                <button
                  onClick={() => handleTemplateChange(template.name)}
                  className="text-sm text-gray-700 py-1 hover:pl-2 duration-100"
                  type="button"
                  key={index}
                >
                  {template.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div id="toolbar">
          {/* Toolbar buttons */}
          <select className="ql-font">
            <option value="sans-serif">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
          </select>

          <select className="ql-size">
            <option value="small">Small</option>
            <option selected>Normal</option>
            <option value="large">Large</option>
            <option value="huge">Huge</option>
          </select>

          <select className="ql-header">
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
            <option value="5">Heading 5</option>
            <option value="6">Heading 6</option>
            <option value="">Normal</option>
          </select>

          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className="ql-strike" />

          <select className="ql-color" />
          <select className="ql-background" />

          <select className="ql-align">
            <option selected />
            <option value="center" />
            <option value="right" />
            <option value="justify" />
          </select>

          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />

          <button className="ql-indent" value="-1" />
          <button className="ql-indent" value="+1" />

          <button className="ql-link" />
          <button className="ql-image" />

          <button className="ql-clean" />

          <button className="ql-select-all" title="Select All">
            <i className="fa-regular fa-object-ungroup text-sm" />
          </button>

          <button type="button"  className="flex items-center justify-center mr-2 ql-divider" title="Insert Horizontal Line">
            <i className="fa-solid fa-minus text-sm" />
          </button>

          <button
            type="button"
            title={showTemplate ? "Hide Template" : "Open Template"}
            style={{ display: "flex" }}
            className="flex items-center justify-center mr-2"
            onClick={() => setShowTemplate(!showTemplate)}
          >
            <i className="fa-regular fa-file-lines text-sm" />
          </button>

          <button
            title={showCode ? "Hide Code" : "Show Code"}
            type="button"
            style={{ display: "flex" }}
            className="flex items-center justify-center mr-2"
            onClick={() => setShowCode(!showCode)}
          >
            <i className="fa-solid fa-code text-sm"></i>
          </button>

          <button
            type="button"
            style={{ display: "flex" }}
            className="flex items-center justify-center mr-2"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Small Screen" : "Full Screen"}
          >
            {isFullscreen ? (
              <i className="fa-solid fa-compress text-sm" />
            ) : (
              <i className="fa-solid fa-expand text-sm" />
            )}
          </button>

          <button
            type="button"
            title="Undo"
            style={{ display: "flex" }}
            className="flex items-center justify-center mr-1 undo__tool"
          >
            <i className="fa-solid fa-rotate-left text-sm"></i>
          </button>
          <button
            type="button"
            title="Redo"
            style={{ display: "flex" }}
            className="flex items-center justify-center mr-2 redo__tool"
          >
            <i className="fa-solid fa-rotate-right text-sm"></i>
          </button>
        </div>

        <div
          ref={quillRef}
          style={{ height: isFullscreen ? "calc(100vh - 50px)" : "400px" }}
        />
      </div>

      {showCode && (
        <div className="my-4 border-[1px] border-gray-300 p-3 rounded-md">
          {editorContent}
        </div>
      )}
    </>
  );
};

export default TextEditor;