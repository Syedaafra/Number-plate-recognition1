
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { recognizeNumberPlate } from './services/geminiService';
import { LicensePlateIcon } from './components/Icons';

// Define the structure for the recognition result
interface RecognitionResult {
  plateNumber: string;
  found: boolean;
}

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (file: File | null, preview: string | null) => {
    setImageFile(file);
    setImagePreview(preview);
    setResult(null);
    setError(null);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRecognize = useCallback(async () => {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64Image = await fileToBase64(imageFile);
      const recognitionResult = await recognizeNumberPlate(base64Image, imageFile.type);
      setResult(recognitionResult);
       if (!recognitionResult.found) {
        setError("Could not detect a number plate in the image.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during recognition. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="min-h-screen bg-base-100 text-text-primary flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <LicensePlateIcon className="w-12 h-12 text-brand-secondary" />
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-brand-secondary to-brand-accent text-transparent bg-clip-text">
              Number Plate Recognition
            </h1>
          </div>
          <p className="text-text-secondary text-lg">
            Upload an image to automatically detect and read vehicle license plates.
          </p>
        </header>

        <main className="bg-base-200 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6">
          <ImageUploader onImageChange={handleImageChange} imagePreview={imagePreview} />
          
          <div className="flex justify-center">
            <button
              onClick={handleRecognize}
              disabled={!imageFile || isLoading}
              className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-brand-primary text-white font-bold text-lg rounded-xl shadow-lg hover:bg-blue-700 disabled:bg-base-300 disabled:cursor-not-allowed transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-brand-secondary focus:ring-opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Recognizing...
                </>
              ) : (
                'Recognize Plate'
              )}
            </button>
          </div>

          {error && <div className="text-center p-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg">{error}</div>}
          
          {result && imagePreview && <ResultDisplay result={result} imagePreview={imagePreview} />}
        </main>
        
        <footer className="text-center mt-8 text-text-secondary text-sm">
            <p>Powered by Gemini AI</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
