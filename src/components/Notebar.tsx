import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ResizableBox } from 'react-resizable';
import AxiosInstance from './AxiosInstance';
import { decompressHTML } from '../utils/compression';
interface NotebarProps {
  isOpen: boolean;
  currentFolder: any;
  onChange: (summary: string, note: string) => void;
  saveRevision: (title: string) => any;
  deleteRevision: (_id: string) => any;
  rollbackRevision: (content: string) => void;
}

export const Notebar = ({
  isOpen,
  currentFolder,
  onChange,
  saveRevision,
  deleteRevision,
  rollbackRevision,
}: NotebarProps) => {
  const [view, setView] = useState<string>('note');
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [isNotesOpen, setIsNotesOpen] = useState(true);
  const [summary, setSummary] = React.useState('');
  const [note, setNote] = React.useState('');
  const toggleSummary = () => setIsSummaryOpen(!isSummaryOpen);
  const toggleNotes = () => setIsNotesOpen(!isNotesOpen);
  const [revisions, setRevisions] = useState([]);
  const [currentRevision, setCurrentRevision] = useState<any>();
  const [newRevision, setNewRevision] = useState<{
    title: string;
    isEditing: boolean;
  }>({
    title: '',
    isEditing: false,
  });

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

  const loadRevision = async () => {
    try {
      const res = await AxiosInstance.get(`revisions/`, {
        params: { path: currentFolder?.path },
      });

      // Sắp xếp revisions theo thứ tự mới nhất lên đầu
      const sortedRevisions = res.data.sort((a, b) => {
        return new Date(b._id).getTime() - new Date(a._id).getTime(); // Sắp xếp theo _id (ObjectId)
        // Hoặc nếu có trường createdAt:
        // return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setRevisions(sortedRevisions); // Cập nhật state với dữ liệu đã sắp xếp
    } catch (error) {
      console.error('Error loading revisions:', error);
    }
  };

  useEffect(() => {
    loadRevision();
  }, [currentFolder]);
  // console.log(currentRevision);
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
              <button
                className="hover:bg-gray-100 rounded-full"
                onClick={() => {
                  setNewRevision({ title: '', isEditing: true }); // Hiển thị hàng nhập tiêu đề
                }}
              >
                <i className="bi bi-plus text-gray-600" />
              </button>
              <button
                className="hover:bg-gray-100 rounded-full"
                onClick={async () => {
                  try {
                    if (!currentRevision?._id) {
                      alert('Please select a revision to delete');
                      return;
                    }

                    await deleteRevision(currentRevision._id); // Xóa revision
                    await loadRevision(); // Tải lại danh sách revisions
                    setCurrentRevision(null); // Reset current revision sau khi xóa
                  } catch (error) {
                    console.error('Error deleting/loading revisions:', error);
                    alert('Failed to delete revision');
                  }
                }}
              >
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

            <button
              className="btn btn-sm shadow gap-2  text-xs text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => {
                rollbackRevision(currentRevision?.content);
              }}
            >
              <i className="text-gray-600 bi bi-history w-4 h-4" />
              Roll Back
            </button>
          </div>

          {/* Table */}
          <div className="">
            {/* Table Container */}
            <div className="max-h-36 overflow-y-auto">
              {/* Table */}
              <table className="table table-striped w-full">
                {/* Fixed Header */}
                <thead className="sticky top-0 table-secondary">
                  <tr>
                    <th className="py-2 text-left text-xs font-medium text-gray-600">
                      Date
                    </th>
                    <th className="py-2 text-left text-xs font-medium text-gray-600">
                      Title
                    </th>
                  </tr>
                </thead>
                {/* Scrollable Body */}
                <tbody>
                  {/* Hàng nhập tiêu đề mới */}
                  {newRevision.isEditing && (
                    <tr>
                      <td className="py-2 text-xs text-gray-600">
                        {new Date().toLocaleString()}{' '}
                        {/* Hiển thị thời gian hiện tại */}
                      </td>
                      <td className="py-2 text-xs text-gray-900">
                        <input
                          type="text"
                          className="w-full border p-1 text-xs"
                          placeholder="Enter revision title..."
                          value={newRevision.title}
                          onChange={(e) =>
                            setNewRevision({
                              ...newRevision,
                              title: e.target.value,
                            })
                          }
                          onKeyDown={async (e) => {
                            if (e.key === 'Enter') {
                              saveRevision(newRevision.title); // Lưu khi nhấn Enter
                              setNewRevision({ title: '', isEditing: false });
                              await loadRevision();
                            }
                          }}
                        />
                        {newRevision.isEditing && (
                          <button
                            className="ml-2 p-1 text-xs bg-blue-500 text-white rounded"
                            onClick={() => saveRevision(newRevision.title)}
                          >
                            Save
                          </button>
                        )}
                        {newRevision.isEditing && (
                          <button
                            className="ml-2 p-1 text-xs bg-gray-500 text-white rounded"
                            onClick={() =>
                              setNewRevision({ title: '', isEditing: false })
                            }
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  )}

                  {/* Các hàng revisions hiện có */}
                  {revisions.map((revision) => (
                    <tr
                      key={revision._id}
                      onClick={() => {
                        const decompressedContent = decompressHTML(
                          new Uint8Array(revision.content.data)
                        );
                        setCurrentRevision({
                          ...revision,
                          content: decompressedContent,
                        });
                      }}
                      className={`cursor-pointer hover:bg-gray-100 ${
                        currentRevision?._id === revision?._id
                          ? 'border-2 border-blue-300'
                          : ''
                      }`}
                    >
                      <td className="py-2 text-xs text-gray-600">
                        {new Date(revision._id).toLocaleString()}
                      </td>
                      <td className="py-2 text-xs text-gray-900">
                        {revision.title}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Text Area */}
          <div className="prose max-w-none max-h-96 overflow-y-auto">
            <p className="text-gray-700 text-xs leading-relaxed">
              {currentRevision?.content ? (
                <div
                  className=""
                  dangerouslySetInnerHTML={{
                    __html: currentRevision.content,
                  }}
                />
              ) : (
                'None'
              )}
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
