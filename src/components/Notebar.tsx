export const Notebar = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div
      className={`fixed right-0 bg-gray-50 border-l shadow-lg transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{
        width: '200px', // Chiều rộng
        top: '40px', // Căn dưới header (giả sử header cao 64px)
        height: 'calc(100% - 40px)', // Chiều cao toàn màn hình trừ chiều cao header
      }}
    >
      <div className="p-4">
        <h3>Notebar Content</h3>
        <p>Place your notes or additional features here.</p>
      </div>
    </div>
  );
};
