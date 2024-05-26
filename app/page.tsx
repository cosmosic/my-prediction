"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import PredictModal from './components/PredictModal';  // Import the PredictModal component
import Modal from './components/Modal';

const Canvas = dynamic(() => import('./components/Canvas'), { ssr: false });

interface ImageDetails {
  filename: string;
  size: number;
  uploadTime: string;
  title?: string;
  description?: string;
}

interface Prediction {
  label: string;
  score: number;
  bbox: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  };
}

const Home = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [imageDetails, setImageDetails] = useState<ImageDetails | null>(null);
  const [predictionDetails, setPredictionDetails] = useState<ImageDetails | null>(null);
  const [showPredictions, setShowPredictions] = useState<boolean>(false);
  const [isPredictModalOpen, setIsPredictModalOpen] = useState<boolean>(false);  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);  // State for view modal visibility

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      setSelectedFile(file);
      setImgSrc(URL.createObjectURL(file));
      setImageDetails({
        filename: file.name,
        size: file.size,
        uploadTime: new Date().toLocaleString(),
      });
      setShowPredictions(false);
    }
  };

  const handlePredict = () => {
    if (!selectedFile) return;
    setIsPredictModalOpen(true);  // Open the modal
  };

  const handleView = () => {
    setIsModalOpen(true);  // Open the view modal
  };

  const handleSave = (title: string, description: string) => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgSrc = e.target?.result as string;
      setPredictions([]); // Clear previous predictions
      setImgSrc(imgSrc);
      setShowPredictions(true);

      // Simulate predictions
      const simulatedPredictions = [
        {
          label: 'orange',
          score: 0.97,
          bbox: {
            x1: 589,
            x2: 1443,
            y1: 92,
            y2: 927,
          },
        },
        {
          label: 'bowl',
          score: 0.29,
          bbox: {
            x1: -1,
            x2: 1617,
            y1: 25,
            y2: 1193,
          },
        },
        {
          label: 'person',
          score: 0.28,
          bbox: {
            x1: -3,
            x2: 801,
            y1: 1,
            y2: 204,
          },
        },
      ];

      setPredictions(simulatedPredictions);
      setPredictionDetails({
        filename: selectedFile.name,
        size: selectedFile.size,
        uploadTime: new Date().toLocaleString(),
        title,
        description,
      });
    };
    reader.readAsDataURL(selectedFile);
    setIsPredictModalOpen(false);
  };

  const handleCancel = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgSrc = e.target?.result as string;
      setPredictions([]); // Clear previous predictions
      setImgSrc(imgSrc);
      setShowPredictions(true);

      // Simulate predictions
      const simulatedPredictions = [
        {
          label: 'orange',
          score: 0.97,
          bbox: {
            x1: 589,
            x2: 1443,
            y1: 92,
            y2: 927,
          },
        },
        {
          label: 'bowl',
          score: 0.29,
          bbox: {
            x1: -1,
            x2: 1617,
            y1: 25,
            y2: 1193,
          },
        },
        {
          label: 'person',
          score: 0.28,
          bbox: {
            x1: -3,
            x2: 801,
            y1: 1,
            y2: 204,
          },
        },
      ];

      setPredictions(simulatedPredictions);
      setPredictionDetails({
        filename: selectedFile.name,
        size: selectedFile.size,
        uploadTime: new Date().toLocaleString(),
      });
    };
    reader.readAsDataURL(selectedFile);
    setIsPredictModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Object Detection</h1>
      <div className="flex gap-4">
        <div className="w-1/2">
          <input type="file" onChange={handleFileChange} className="mb-4" />
          {imageDetails && (
            <div className="mb-4">
              <p><strong>Thumbnail:</strong> {imageDetails.filename}</p>
              <p><strong>Filename:</strong> {imageDetails.filename}</p>
              <p><strong>Size:</strong> {(imageDetails.size / 1024).toFixed(2)} KB</p>
              <p><strong>Upload Time:</strong> {imageDetails.uploadTime}</p>
            </div>
          )}
          <button onClick={handlePredict} className="bg-blue-500 text-white py-2 px-4 rounded mb-4">
            Predict
          </button>
          {imgSrc && (
            <div className="border border-gray-300 p-2">
              <img src={imgSrc} alt="Uploaded" className="max-w-full h-auto" />
            </div>
          )}
        </div>
        <div className="w-1/2">
          <h1 className="text-2xl font-bold mb-4">Predicted Image</h1>
          {showPredictions && imgSrc && (
            <>
              {predictionDetails && (
                <div className="mb-4">
                  <p><strong>Thumbnail:</strong> {predictionDetails.filename}</p>
                  {predictionDetails.title && <p><strong>Title:</strong> {predictionDetails.title}</p>}
                  {predictionDetails.description && <p><strong>Description:</strong> {predictionDetails.description}</p>}
                  <p><strong>Prediction Time:</strong> {predictionDetails.uploadTime}</p>
                  <button onClick={handleView} className="bg-blue-500 text-white py-2 px-4 rounded m-2">
                    View
                  </button>
                </div>
              )}
              <Canvas imgSrc={imgSrc} predictions={predictions} />
            </>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-2 text-black">Uploaded Image with Predictions</h2>
        {imgSrc && <Canvas imgSrc={imgSrc} predictions={predictions} />}
      </Modal>

      <PredictModal
        isOpen={isPredictModalOpen}
        onClose={handleCancel}
        onSave={handleSave}
      />
    </div>
  );
};

export default Home;
