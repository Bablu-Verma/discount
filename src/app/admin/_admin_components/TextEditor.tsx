import React, { useRef } from "react";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import { setEditorData } from "@/redux-store/slice/editorSlice";

const TextEditor: React.FC = () => {
  const [show_editor, setShow_editor] = React.useState<boolean>(false);
  const editor = useRef<any>(null);

  const editorContent = useSelector((state: any) => state.editor.content);

  const dispatch = useDispatch();

  const config = {
    readonly: false,
    height: 500,
    placeholder: "Start typing...",
  };

  const handleChange = (newContent: string) => {
    dispatch(setEditorData(newContent));
  };

  return (
    <>
      <div className="text-editor border-2 border-gray-200 min-h-[350px]">
        <JoditEditor
          config={config}
          ref={editor}
          value={editorContent}
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
        <div className="max-w-[100%] my-4 p-4 border-2 ">
          {editorContent}
        </div>
      )}
    </>
  );
};

export default TextEditor;
