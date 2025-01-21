"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEditorData } from "@/redux-store/slice/editorSlice";
import DOMPurify from "dompurify";
import { useQuill } from "react-quilljs";

import "quill/dist/quill.snow.css";
import axios from "axios";
import { upload_image_api } from "@/utils/api_url";
import { RootState } from "@/redux-store/redux_store";

interface ISTemplate {
  name: string;
  content: string;
}

const TextEditor: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<ISTemplate | null>(
    null
  );
  const [showTemplate, setShowTemplate] = useState<boolean>(false);
  const [showCode, setShowCode] = useState<boolean>(false);

  const editorContent = useSelector((state: RootState) => state.editor.content);
  const token = useSelector((state: RootState) => state.user.token);
  const dispatch = useDispatch();

  const [isEditorInitialized, setIsEditorInitialized] = useState(false);

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

  const imageUploadHandler = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (!input.files) return;



   
      const file = input.files[0];
      const form_data = new FormData();
      console.log(file)
      form_data.append("image", file);
      form_data.append("file_name", "editor_image");

      try {
        const { data } = await axios.post(upload_image_api, form_data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        const range = quillRef.current.getEditor().getSelection();
        quillRef.current
          .getEditor()
          .insertEmbed(range.index, "image", data.responce.url);
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    };
  };

  const { quill, quillRef } = useQuill({
    placeholder: "Add your content...",
    modules: {
      toolbar: {
        container: [
          [{ font: [] }, { size: [] }], 
          ["bold", "italic", "underline", "strike"], 
          [{ color: [] }, { background: [] }], 
          [{ script: "sub" }, { script: "super" }], 
          [{ align: [] }], 
          ["blockquote", "code-block"],  
          [{ list: "ordered" }, { list: "bullet" }], 
          [{ indent: "-1" }, { indent: "+1" }], 
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: imageUploadHandler, 
        },
      },
    },
  });
  useEffect(() => {
    if (quill && !isEditorInitialized) {
      quill.clipboard.dangerouslyPasteHTML(editorContent || "");
      quill.on("text-change", () => {
        const sanitizedContent = DOMPurify.sanitize(quill.root.innerHTML);
        dispatch(setEditorData(sanitizedContent));
      });
      setIsEditorInitialized(true);
    }
  }, [quill, dispatch, editorContent, isEditorInitialized]);

  const handleTemplateChange = (value: string) => {
    const selected = templates.find((t) => t.name === value) || null;
    setSelectedTemplate(selected);
    if (selected && quill) {
      quill.clipboard.dangerouslyPasteHTML(selected.content);
      dispatch(setEditorData(selected.content));
    }
  };

  console.log(editorContent);

  return (
    <>
      <div className="my-3">
        <div className="relative max-w-[200px]">
          <button
            onClick={() => setShowTemplate(!showTemplate)}
            className="border rounded-md px-5 py-2 focus:outline-none focus:ring-1 text-secondary focus:ring-primary text-sm font-medium"
            type="button"
          >
            {selectedTemplate ? selectedTemplate.name : "Select Template"}
          </button>
          {showTemplate && (
            <div className="absolute top-12 z-20 left-0 bg-white border-[1px] border-gray-500 text-secondary rounded-md p-2 select-none">
              {templates.map((template, index) => (
                <button
                  onClick={() => {
                    handleTemplateChange(template.name);
                    setShowTemplate(false);
                  }}
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
      </div>

      <div className="text-editor pb-12">
        <div style={{ height: 300 }}>
          <div ref={quillRef} />
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => setShowCode(!showCode)}
          className="hover:underline py-1 focus:outline-none text-secondary text-sm font-medium"
          type="button"
        >
          {showCode ? "Hide Code" : "Show Code"}
        </button>
        {showCode && (
          <div className="my-3 border-[1px] border-gray-300 p-3 rounded-md">
            {editorContent}
          </div>
        )}
      </div>
    </>
  );
};

export default TextEditor;
