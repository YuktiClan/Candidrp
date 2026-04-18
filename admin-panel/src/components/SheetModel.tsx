

export default function SheetModal({ url, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] h-[90%] rounded-lg overflow-hidden relative">
        
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
        >
          Close
        </button>

        <iframe
          src={url}
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
}