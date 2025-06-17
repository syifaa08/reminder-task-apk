
import React, { useEffect } from 'react';
import { BookCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // 3 detik

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-500 to-white flex flex-col items-center justify-center z-50">
      <div className="animate-fade-in">
        <div className="mb-6 p-4 bg-white rounded-full shadow-lg">
          <BookCheck className="w-16 h-16 text-blue-600" />
        </div>
        
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-2">Pengingat Tugas</h1>
          <p className="text-lg opacity-90">Membantu kamu tetap tepat waktu.</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
