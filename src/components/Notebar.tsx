import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  FileText,
  Bookmark,
  Edit2,
  Camera,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';
import { ResizableBox } from 'react-resizable';
interface NotebarProps {
  isOpen: boolean;
  currentFolder: any;
}

export const Notebar = ({ isOpen, currentFolder }: NotebarProps) => {
  const [view, setView] = useState<string>('note');
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const toggleSummary = () => setIsSummaryOpen(!isSummaryOpen);
  const toggleNotes = () => setIsNotesOpen(!isNotesOpen);

  return (
    <div
      className={`fixed right-0 bg-gray-50 border-l shadow-lg transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      style={{
        width: '200px',
        top: '40px',
        height: 'calc(100% - 40px)',
      }}
    >
      {/* Action Buttons */}
      <div className="flex justify-center items-center px-2 h-10 gap-2 border-b">
        <button
          className={`p-1.5 ${view === 'note' ? 'bg-gray-300' : 'hover:bg-gray-100'}`}
          onClick={() => setView('note')}
        >
          <i className={`bi bi-journal-text`} />
        </button>
        {/* <button className={`p-1.5 ${showTrash ? 'bg-gray-300' : 'hover:bg-gray-100'}`}>
          <i className={`bi bi-bookmark`} />
        </button>
        <button className={`p-1.5 ${showTrash ? 'bg-gray-300' : 'hover:bg-gray-100'}`}>
          <i className={`bi bi-tag`} />
        </button> */}
        <button
          className={`p-1.5 ${view === 'record' ? 'bg-gray-300' : 'hover:bg-gray-100'}`}
          onClick={() => setView('record')}
        >
          <i className={`bi bi-camera`} />
        </button>
        {/* <button className={`p-1.5 ${showTrash ? 'bg-gray-300' : 'hover:bg-gray-100'}`}>
          <i className={`bi bi-chat-left`} />
        </button> */}
      </div>

      {view === 'note' ? (
        <>
          <div>
            <div className="border-bottom">
              <button
                className="w-100 d-flex align-items-center justify-content-start bg-gray-50 border-1"
                onClick={toggleSummary}
              >
                <i
                  className={`bi ${isSummaryOpen ? 'bi-chevron-down' : 'bi-chevron-right'}`}
                />

                <span className="ms-1 text-sm">Tóm tắt</span>
              </button>
              {isSummaryOpen && (
                <ResizableBox
                  width={200}
                  height={200}
                  // draggableOpts="true"
                  minConstraints={[200, 100]}
                  maxConstraints={[200, 550]}
                >
                  <p className="text-xs">{currentFolder?.name}</p>
                </ResizableBox>
              )}
            </div>
          </div>
          <div>
            <div>
              <button
                className="w-100 d-flex align-items-center justify-content-start bg-gray-50 border-1"
                onClick={toggleNotes}
              >
                <i
                  className={`bi ${isNotesOpen ? 'bi-chevron-down' : 'bi-chevron-right'}`}
                />
                <span className="ms-1 text-sm">Ghi chú</span>
              </button>
              {isNotesOpen && (
                <div className="p-2">
                  <p className="text-xs">{currentFolder?.name}</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
