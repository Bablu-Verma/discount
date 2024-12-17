import React, { useEffect, useRef, useState, useCallback } from "react";
import JoditEditor from "jodit-react";
import { debounce } from "lodash";
import { setEditorData } from "@/redux-store/slice/editorSlice";
import { useDispatch, useSelector } from "react-redux";

const TextEditor: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [show_editor, setShow_editor] = useState<boolean>(false);
  const editor = useRef<any>(null);

  const editorContent = useSelector((state: any) => state.editor.content);

  const dispatch = useDispatch();
  const config = {
    readonly: false,
    height: 500,
    placeholder: "Start typing...",
  };


  const handleChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  useEffect(()=>{
    dispatch(setEditorData(content)); 
  },[content])

  return (
    <>
      <div className="text-editor border-2 border-red-300 min-h-[350px]">
        <JoditEditor
          config={config}
          ref={editor}
          value={content}
          onBlur={(newContent) => handleChange(newContent)}
        />
      </div>
      <button
        type="button"
        className="text-lg text-blue-600 hover:underline inline-block mt-4"
        onClick={() => setShow_editor(!show_editor)}
      >
        {show_editor ? "Hide Code" : "Show Code"}
      </button>

      {show_editor && (
        <div className="max-w-[100%] my-4 p-4 border-2 "> {editorContent} </div>
      )}
    </>
  );
};

export default TextEditor;
