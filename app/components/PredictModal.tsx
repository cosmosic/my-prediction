import React, { useState } from 'react';

interface PredictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
}

const PredictModal: React.FC<PredictModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    onSave(title, description);
    setTitle('');
    setDescription('');
  };

  const handleCancel = () => {
    onClose();
    setTitle('');
    setDescription('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg relative w-1/2">
        <button onClick={handleCancel} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Add Title and Description</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
        />
        <button onClick={handleSave} className="bg-blue-500 text-white py-2 px-4 rounded mr-2">
          Save
        </button>
        <button onClick={handleCancel} className="bg-gray-500 text-white py-2 px-4 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PredictModal;
