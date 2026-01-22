'use client';

import { useMemo, useState, useRef, useCallback } from 'react';
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
  const [isSourceMode, setIsSourceMode] = useState(false);
  const lastValueRef = useRef(value);

  // Prevent infinite loop by only calling onChange when content actually changes
  const handleChange = useCallback((content: string) => {
    if (content !== lastValueRef.current) {
      lastValueRef.current = content;
      onChange(content);
    }
  }, [onChange]);

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
  const sourceHeight = height - 50;

  return (
    <div
      className="rich-text-editor"
      style={{
        height: `${height}px`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Toggle Button */}
      <div className="flex justify-end mb-1">
        <button
          type="button"
          onClick={() => setIsSourceMode(!isSourceMode)}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            isSourceMode
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isSourceMode ? '📝 WYSIWYG' : '</> Source HTML'}
        </button>
      </div>

      {isSourceMode ? (
        /* Source HTML Mode */
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          style={{ height: `${sourceHeight}px` }}
        />
      ) : (
        /* WYSIWYG Mode */
        <ReactQuill
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{
            height: `${editorHeight}px`,
            display: 'flex',
            flexDirection: 'column',
          }}
        />
      )}

      <style jsx global>{`
        .rich-text-editor {
          position: relative;
          z-index: 1;
        }
        .rich-text-editor .quill {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
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
          overflow: hidden;
          position: relative;
          z-index: 1;
          max-height: calc(100% - 42px);
        }
        .rich-text-editor .ql-editor {
          height: 100%;
          max-height: 100%;
          overflow-y: auto;
          min-height: 266px;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        /* Table styles in editor */
        .rich-text-editor .ql-editor table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        .rich-text-editor .ql-editor table td,
        .rich-text-editor .ql-editor table th {
          border: 1px solid #ccc;
          padding: 8px 12px;
          text-align: left;
        }
        .rich-text-editor .ql-editor table th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .rich-text-editor .ql-editor table tr:nth-child(even) {
          background-color: #fafafa;
        }
      `}</style>
    </div>
  );
}
