import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ResizableBox } from 'react-resizable';
interface NotebarProps {
  isOpen: boolean;
  currentFolder: any;
  onChange: (summary: string, note: string) => void;
}

export const Notebar = ({ isOpen, currentFolder, onChange }: NotebarProps) => {
  const [view, setView] = useState<string>('note');
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [isNotesOpen, setIsNotesOpen] = useState(true);
  const [summary, setSummary] = React.useState(currentFolder?.summary || '');
  const [note, setNote] = React.useState(currentFolder?.note || '');
  const toggleSummary = () => setIsSummaryOpen(!isSummaryOpen);
  const toggleNotes = () => setIsNotesOpen(!isNotesOpen);

  const handleSummaryChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newSummary = event.target.value;
    setSummary(newSummary);
    onChange(newSummary, note); // Gửi giá trị mới về ProjectPage
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = event.target.value;
    setNote(newNote);
    onChange(summary, newNote); // Gửi giá trị mới về ProjectPage
  };

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
            {/* Tóm tắt */}
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
                  width={200} // Chiều rộng cố định
                  height={200} // Chiều cao mặc định
                  minConstraints={[200, 100]} // Giới hạn chiều cao tối thiểu
                  maxConstraints={[200, 550]} // Giới hạn chiều cao tối đa
                  className="border p-2"
                >
                  <textarea
                    className="w-100 h-100 border-0 font-thin text-sm"
                    style={{
                      resize: 'none', // Tắt resize mặc định của textarea
                      overflow: 'auto',
                      outline: 'none',
                    }}
                    placeholder={
                      currentFolder?.name || 'Nhập văn bản tại đây...'
                    }
                    onChange={handleSummaryChange}
                    value={summary}
                  />
                </ResizableBox>
              )}
            </div>

            {/* Ghi chú */}
            <div className="mt-3">
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
                <ResizableBox
                  width={200} // Chiều rộng cố định
                  height={200} // Chiều cao mặc định
                  minConstraints={[200, 100]} // Giới hạn chiều cao tối thiểu
                  maxConstraints={[200, 550]} // Giới hạn chiều cao tối đa
                  className="border p-2"
                >
                  <textarea
                    className="w-100 h-100 border-0 font-thin text-sm"
                    style={{
                      resize: 'none',
                      overflow: 'auto',
                      outline: 'none',
                    }}
                    placeholder={
                      currentFolder?.name || 'Nhập ghi chú tại đây...'
                    }
                    onChange={handleNoteChange} // Gọi hàm khi thay đổi nội dung
                    value={note}
                  />
                </ResizableBox>
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
