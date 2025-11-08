
import React from 'react';

interface RecognitionResult {
  plateNumber: string;
  found: boolean;
}

interface ResultDisplayProps {
  result: RecognitionResult;
  imagePreview: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="mt-6 p-6 bg-base-100/50 rounded-lg animate-fade-in">
        {result.found ? (
            <div className="text-center">
                <h2 className="text-xl font-semibold text-text-secondary mb-2">Detected Number Plate</h2>
                <div className="bg-gray-800 border-2 border-brand-accent p-4 rounded-lg inline-block shadow-lg">
                    <p 
                        className="text-4xl sm:text-5xl font-mono font-bold tracking-widest text-white"
                        style={{
                            textShadow: '0 0 5px #10b981, 0 0 10px #10b981, 0 0 15px #10b981'
                        }}
                    >
                        {result.plateNumber}
                    </p>
                </div>
            </div>
        ) : (
            <div className="text-center">
                <h2 className="text-xl font-semibold text-yellow-400 mb-2">No Plate Detected</h2>
                <p className="text-text-secondary">The AI could not confidently identify a number plate in the image. Try a clearer image or a different angle.</p>
            </div>
        )}
    </div>
  );
};
