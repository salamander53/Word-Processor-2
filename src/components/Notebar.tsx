import React, { useEffect, useState } from 'react';
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
  const [summary, setSummary] = React.useState('');
  const [note, setNote] = React.useState('');
  const toggleSummary = () => setIsSummaryOpen(!isSummaryOpen);
  const toggleNotes = () => setIsNotesOpen(!isNotesOpen);

  useEffect(() => {
    setNote(currentFolder?.note);
    setSummary(currentFolder?.summary);
  }, [currentFolder]);

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
  // console.log(currentFolder);
  return (
    <div
      className={`fixed right-0 bg-gray-50 border-l shadow-lg transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
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
          onClick={() => setView('snapshot')}
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
                <span className="ms-1 text-sm">Summary</span>
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
                    className="w-100 h-100 border-0 text-sm"
                    style={{
                      resize: 'none', // Tắt resize mặc định của textarea
                      overflow: 'auto',
                      outline: 'none',
                    }}
                    placeholder={'Type summary here...'}
                    onChange={handleSummaryChange}
                    value={currentFolder?.summary || ''}
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
                <span className="ms-1 text-sm">Note</span>
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
                    className="w-100 h-100 border-0 text-sm"
                    style={{
                      resize: 'none',
                      overflow: 'auto',
                      outline: 'none',
                    }}
                    placeholder={'Type note here...'}
                    onChange={handleNoteChange} // Gọi hàm khi thay đổi nội dung
                    value={currentFolder?.note || ''}
                  />
                </ResizableBox>
              )}
            </div>
          </div>
        </>
      ) : view === 'snapshot' ? (
        // <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md w-full max-w-2xl p-1">
          {/* Name Label */}
          <h2 className="text-sm  text-gray-900 mb-4 align-item-center">
            Fyodor Pavlovitch
          </h2>

          {/* Snapshots Row */}
          <div className="flex items-center gap-2 mb-2 justify-between">
            <span className="text-xs text-gray-600">Snapshots</span>
            <div>
              <button className=" hover:bg-gray-100 rounded-full">
                <i className="bi bi-plus text-gray-600" />
              </button>
              <button className=" hover:bg-gray-100 rounded-full">
                <i className="bi bi-dash text-gray-600" />
              </button>
            </div>
          </div>

          {/* Actions Row */}
          <div className="flex items-center gap-2  mb-6 justify-between">
            <div>
              <button className="btn btn-sm shadow text-xs text-gray-700 hover:bg-gray-100 rounded-md">
                Compare
              </button>
              <button className="m-2 hover:bg-gray-100 rounded-full">
                <i className="bi bi-three-dots text-gray-600" />
              </button>
            </div>

            <button className="btn btn-sm shadow gap-2  text-xs text-gray-700 hover:bg-gray-100 rounded-md">
              <i className="text-gray-600 bi bi-history w-4 h-4" />
              Roll Back
            </button>
          </div>

          {/* Table */}
          <div className="mb-6">
            <table className="table">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className=" py-2 text-left text-xs font-medium text-gray-600">
                    Date
                  </th>
                  <th className=" py-2 text-left text-xs font-medium text-gray-600">
                    Title
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className=" py-2 text-xs text-gray-600">
                    Jul 4, 2022 at 14:04
                  </td>
                  <td className=" py-2 text-xs text-gray-900">First draft</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Text Area */}
          <div className="prose max-w-none">
            <p className="text-gray-700 text-xs leading-relaxed">
              Alexey Fyodorovitch Karamazov was the third son of Fyodor
              Pavlovitch Karamazov, a land owner well known in our district in
              his own day, and still years ago, and which I shall speak of in
              its proper place. For the present I will only say that this
              "landowner"—for so we used to call him, although he hardly spent a
              day of his life on his own estate—was a strange type, yet one
              pretty frequently to be met with, a type abject and vicious and at
              the same time senseless. But he was one of those senseless persons
              who are very well capable...
            </p>
          </div>
        </div>
      ) : (
        // </div>
        <></>
      )}
    </div>
  );
};
