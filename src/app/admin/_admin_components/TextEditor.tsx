import React, { useEffect, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import { setEditorData } from "@/redux-store/slice/editorSlice";
import DOMPurify from "dompurify";

interface ISTemplate {
  name: string;
  content: string;
}
const TextEditor: React.FC = () => {
  const editor = useRef<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ISTemplate | null>(
    null
  );
  const [showTemplate, setShowTemplate] = useState<boolean>(false);
  const [showCode, setShowCode] = useState<boolean>(false);
  const editorContent = useSelector((state: any) => state.editor.content);

  const [templates] = useState<ISTemplate[]>([
    {
      name: "Blog Template",
      content:
        "<div class='blog_template'>Add Blog</div>",
    },
    {
      name: "Campaign Template",
      content:
        "<div class='campaign_template'>Campaign Add</div>",
    },
    {
      name: "Category Template",
      content:
        "<div class='category_template'>Category Add</div>",
    },
  ]);

  const dispatch = useDispatch();

  const config = {
    
    readonly: false,
    height: 500,
    placeholder: "Start typing...",
  };

  const handleContentChange = (newContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(newContent, "text/html");
    doc.querySelectorAll("[style]").forEach((el) => el.removeAttribute("style"));
    const cleanedContent = DOMPurify.sanitize(doc.body.innerHTML);
    dispatch(setEditorData(cleanedContent));
  };

  const handleTemplateChange = (value: string) => {
    const selected = templates.find((t) => t.name === value) || null;
    setSelectedTemplate(selected);
    if (selected) {
      dispatch(setEditorData(selected.content));
    }
  };

  return (
    <>
      <div className="my-3 ">
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
                  className="text-sm text-gray-700 py-1 hover:pl-2 duration-100 "
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

      <div className="text-editor border-2 border-gray-200 min-h-[350px]">
        <JoditEditor
          ref={editor}
          config={config}
          value={editorContent}
          onBlur={(newContent) => handleContentChange(newContent)}
        />
      </div>

      <div className="mt-4">
        <button
          onClick={() => setShowCode(!showCode)}
          className="hover:underline py-1 focus:outline-none  text-secondary text-sm font-medium"
          type="button"
        >
          {showCode ? "Hide Code": "Show Code"}
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
