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
        "<h1>TBlog Template  </h1><p>Default content for Template 1.</p>",
    },
    {
      name: "Campaign Template",
      content:
        "<h2>Campaign Template </h2><p>Default content for Template 2.</p>",
    },
    {
      name: "Category Template",
      content:
        "<h2> Category Template  Heading</h2><p>Default content for Template 2.</p>",
    },
  ]);

  const dispatch = useDispatch();

  const config = {
    readonly: false,
    height: 500,
    placeholder: "Start typing...",
  };

  const handleContentChange = (newContent: string) => {
    const sanitizedContent = DOMPurify.sanitize(newContent);
    dispatch(setEditorData(sanitizedContent));
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
