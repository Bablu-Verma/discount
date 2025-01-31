"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEditorData } from "@/redux-store/slice/editorSlice";
import DOMPurify from "dompurify";
import JoditEditor from 'jodit-react';
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
  const editor = useRef(null);


  const [templates] = useState<ISTemplate[]>([
    { name: "Blog Template", content: "<div class='blog_template'>Add Blog</div>" },
    { name: "Campaign Template", content: "<div class='campaign_template'>Campaign Add</div>" },
    { name: "Category Template", content: "<div class='category_template'>Category Add</div>" },
  ]);

  const config = {
    zIndex: 0,
    readonly: false,
    activeButtonsInReadOnly: ['source', 'fullsize', 'print', 'about', 'dots'],
    toolbarButtonSize: "middle" as const, 
    theme: 'default',
    saveModeInCookie: false,
    spellcheck: true,
    editorCssClass: false,
    triggerChangeEvent: true,
    width: "100%",
    height: 400,
    direction: "ltr" as "ltr" | "rtl" | undefined,
    language: 'auto',
    debugLanguage: false,
    i18n: false as false, 
    tabIndex: -1,
    toolbar: true,
    enter: "p",
    defaultMode: 1,
    useSplitMode: false,
    colors: {
      greyscale:  ['#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF'],
      palette:    ['#980000', '#FF0000', '#FF9900', '#FFFF00', '#00F0F0', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF'],
      full: [
        '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
        '#DD7E6B', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD',
        '#CC4125', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0',
        '#A61C00', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79',
        '#85200C', '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#1155CC', '#0B5394', '#351C75', '#733554',
        '#5B0F00', '#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#1C4587', '#073763', '#20124D', '#4C1130'
      ]
    },
    colorPickerDefaultTab: 'background',
    imageDefaultWidth: 300,
    removeButtons: [],
    disablePlugins: [],
    extraButtons: [],
    sizeLG: 900,
    sizeMD: 700,
    sizeSM: 400,
    buttons: [
      'source', '|',
      'bold',
      'strikethrough',
      'underline',
      'italic', '|',
      'ul',
      'ol', '|',
      'outdent', 'indent',  '|',
      'font',
      'fontsize',
      'brush',
      'paragraph', '|',
      'image',
      'video',
      'table',
      'link', '|',
      'align', 'undo', 'redo', '|',
      'hr',
      'eraser',
      'copyformat', '|',
      'symbol',
      'fullsize',
      'print',
      'about'
    ],
    buttonsXS: [
      'bold',
      'image', '|',
      'brush',
      'paragraph', '|',
      'align', '|',
      'undo', 'redo', '|',
      'eraser',
      'dots'
    ],
    events: {},
    textIcons: false,
  };
  

  const imageUploadHandler = async () => {
    const formData = new FormData();
    const file = ''
    formData.append("image", file);
    formData.append("file_name", "editor_image");

    try {
      const { data } = await axios.post(upload_image_api, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // data.responce.url
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  useEffect(() => {
    const sanitizedContent = DOMPurify.sanitize('');
          dispatch(setEditorData(sanitizedContent));
  }, [ dispatch, editorContent]);

  const handleTemplateChange = (value: string) => {
    const selected = templates.find((t) => t.name === value) || null;
    setSelectedTemplate(selected);
    if (selected ) {
      dispatch(setEditorData(selected.content)); 
    }
  };


  const track_editor = (value:any)=>{

  }


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

      <div className="text-editor pb-16">
      <JoditEditor
      ref={editor}
      value={editorContent}
      config={config}
      onBlur={(e)=>track_editor(e)}
      onChange={(newContent) => {}}
    />
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
