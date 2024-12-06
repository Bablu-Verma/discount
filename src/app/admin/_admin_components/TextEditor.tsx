import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import 'draft-js/dist/Draft.css';

const TextEditor: React.FC = () => {
  
  const editorRef = useRef<Editor | null>(null); 

  const log = () => {
    if (editorRef.current) {
      // console.log(editorRef.current.getContent());
    }
  };

  return (
    <>
      <Editor
        apiKey="ejii3vx2wp3j6gk3z43r7la91tsrd09cn1g7yhua5zxm39j2"
        onInit={(_evt, editor) => {
          // editorRef.current = editor; 
        }}
        initialValue="<p>Welcome</p>"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
      <button onClick={log}>Log editor content</button>
    </>
  );
};

export default TextEditor;
