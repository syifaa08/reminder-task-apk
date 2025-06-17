
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, BookCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface OnboardingScreensProps {
  onComplete: (userName: string) => void;
}

const OnboardingScreens: React.FC<OnboardingScreensProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userName, setUserName] = useState('');

  const nextSlide = () => {
    if (currentSlide < 4) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleComplete = () => {
    onComplete(userName);
  };

  const slides = [
    // Slide 1: Logo dengan teks
    {
      id: 0,
      content: (
        <div className="text-center">
          <div className="mb-8 p-6 bg-blue-100 rounded-full mx-auto w-32 h-32 flex items-center justify-center">
            <BookCheck className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Reminder Tugas</h1>
          <p className="text-lg text-gray-600">Aplikasi pengingat tugas yang membantu kamu tetap produktif</p>
        </div>
      )
    },
    // Slide 2: Ilustrasi manfaat
    {
      id: 1,
      content: (
        <div className="text-center">
          <div className="mb-8 text-6xl">📝</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Kelola Tugasmu</h2>
          <p className="text-gray-600 leading-relaxed">
            Tambahkan tugas dengan mudah, atur deadline, dan dapatkan pengingat otomatis agar kamu tidak pernah terlewat.
          </p>
        </div>
      )
    },
    // Slide 3: Form input nama
    {
      id: 2,
      content: (
        <div className="text-center">
          <div className="mb-8 text-6xl">👋</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Halo!</h2>
          <p className="text-gray-600 mb-6">Siapa nama kamu?</p>
          <Input
            placeholder="Masukkan nama kamu"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="text-center text-lg"
          />
        </div>
      )
    },
    // Slide 4: Konfirmasi nama
    {
      id: 3,
      content: (
        <div className="text-center">
          <div className="mb-8 text-6xl">😊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Senang bertemu, {userName || 'Teman'}!</h2>
          <p className="text-gray-600">Mari mulai mengatur tugas-tugasmu dengan lebih baik.</p>
        </div>
      )
    },
    // Slide 5: Tombol masuk
    {
      id: 4,
      content: (
        <div className="text-center">
          <div className="mb-8 text-6xl">🚀</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Siap Memulai?</h2>
          <p className="text-gray-600 mb-8">Mari mulai perjalanan produktif kamu bersama Pengingat Tugas!</p>
          <Button 
            onClick={handleComplete}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Masuk ke Aplikasi
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 z-40">
      <div className="container mx-auto px-4 py-8 h-full flex flex-col max-w-md">
        {/* Progress Indicators */}
        <div className="flex justify-center mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full mx-1 transition-colors ${
                index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Slide Content */}
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-8">
              <div className="animate-fade-in">
                {slides[currentSlide].content}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="ghost"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={currentSlide === 0 ? 'invisible' : ''}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Kembali
          </Button>

          {currentSlide < 4 && (
            <Button
              onClick={nextSlide}
              disabled={currentSlide === 2 && !userName.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Lanjut
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreens;
