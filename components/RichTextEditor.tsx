'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] border border-gray-300 rounded-lg bg-gray-50 animate-pulse" />,
});

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
  height = 300,
}: RichTextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['link', 'image'],
          ['blockquote', 'code-block'],
          ['clean'],
        ],
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'list',
    'align',
    'link',
    'image',
    'blockquote',
    'code-block',
  ];

  const editorHeight = height - 42;

  return (
    <div
      className="rich-text-editor"
      style={{
        height: `${height}px`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          height: `${editorHeight}px`,
          display: 'flex',
          flexDirection: 'column',
        }}
      />
      <style jsx global>{`
        .rich-text-editor {
          position: relative;
          z-index: 1;
        }
        .rich-text-editor .quill {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          background: #f9fafb;
          flex-shrink: 0;
          position: relative;
          z-index: 2;
        }
        .rich-text-editor .ql-toolbar .ql-picker-options {
          z-index: 100;
        }
        .rich-text-editor .ql-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          flex: 1;
          overflow: auto;
          position: relative;
          z-index: 1;
        }
        .rich-text-editor .ql-editor {
          min-height: 100%;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}
