'use client';

import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Check if content contains HTML that Quill doesn't support (tables, iframes, etc.)
const hasUnsupportedHtml = (html: string): boolean => {
  if (!html) return false;
  return /<table|<iframe|<video|<audio|<canvas|<svg/i.test(html);
};

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
  // Auto-detect if content has tables/unsupported HTML and default to Source mode
  const [isSourceMode, setIsSourceMode] = useState(() => hasUnsupportedHtml(value));
  const [showWarningToast, setShowWarningToast] = useState(false);
  const lastValueRef = useRef(value);
  const hasAutoSwitched = useRef(false);

  // Check if current content has unsupported HTML
  const contentHasUnsupportedHtml = hasUnsupportedHtml(value);

  // Auto-switch to Source mode if content contains tables (on initial load or when value changes externally)
  useEffect(() => {
    if (!hasAutoSwitched.current && hasUnsupportedHtml(value) && !isSourceMode) {
      setIsSourceMode(true);
      hasAutoSwitched.current = true;
    }
  }, [value, isSourceMode]);

  // Handle toggle with warning toast for unsupported HTML
  const handleToggleMode = () => {
    if (isSourceMode && contentHasUnsupportedHtml) {
      // Show warning toast instead of confirm dialog
      setShowWarningToast(true);
      return;
    }
    setIsSourceMode(!isSourceMode);
  };

  // Confirm switch to WYSIWYG (from toast)
  const confirmSwitchToWysiwyg = () => {
    setShowWarningToast(false);
    setIsSourceMode(false);
  };

  // Cancel switch (from toast)
  const cancelSwitch = () => {
    setShowWarningToast(false);
  };

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

  // Toast component rendered via portal to body
  const WarningToast = showWarningToast && typeof document !== 'undefined' ? createPortal(
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99999,
        animation: 'toastFadeIn 0.3s ease-out',
      }}
    >
      <div style={{
        backgroundColor: '#fffbeb',
        border: '2px solid #f59e0b',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        padding: '16px 20px',
        maxWidth: '420px',
        minWidth: '320px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <p style={{
              fontWeight: 600,
              color: '#92400e',
              marginBottom: '8px',
              fontSize: '15px',
            }}>
              Nội dung có chứa TABLE/IFRAME/VIDEO
            </p>
            <p style={{
              fontSize: '13px',
              color: '#b45309',
              marginBottom: '16px',
              lineHeight: 1.5,
            }}>
              WYSIWYG editor không hỗ trợ các thẻ này. Nếu chuyển sang WYSIWYG, chúng sẽ bị XÓA hoặc chuyển thành text.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={confirmSwitchToWysiwyg}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  backgroundColor: '#d97706',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Vẫn chuyển
              </button>
              <button
                type="button"
                onClick={cancelSwitch}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Hủy
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={cancelSwitch}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              color: '#d97706',
              cursor: 'pointer',
              padding: '0',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      </div>
      <style>{`
        @keyframes toastFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  ) : null;

  return (
    <div
      className="rich-text-editor"
      style={{
        height: `${height}px`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Warning Toast via Portal */}
      {WarningToast}

      {/* Toggle Button */}
      <div className="flex justify-end mb-1">
        <button
          type="button"
          onClick={handleToggleMode}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            isSourceMode
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isSourceMode ? '📝 WYSIWYG' : '</> Source HTML'}
        </button>
        {isSourceMode && contentHasUnsupportedHtml && (
          <span className="ml-2 text-xs text-amber-600 flex items-center">
            ⚠️ Chứa TABLE/HTML đặc biệt
          </span>
        )}
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
