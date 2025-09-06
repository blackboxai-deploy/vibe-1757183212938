'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function HomePage() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      title: "AI Navigation Assistant",
      description: "Real-time obstacle detection with voice guidance",
      impact: "Navigate safely anywhere, anytime"
    },
    {
      title: "Smart Text Reader", 
      description: "Instant OCR in multiple languages",
      impact: "Read signs, documents, and labels instantly"
    },
    {
      title: "Offline Capable",
      description: "Works without internet connection",
      impact: "Reliable assistance in any location"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Voice announcements for accessibility
  const announceFeature = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceCommand = () => {
    announceFeature("Welcome to ARGUS Glass. Say navigate for obstacle detection, or read text for OCR mode.");
  };

  return (
    <div className={`min-h-screen ${isHighContrast ? 'bg-black text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      {/* Accessibility Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          onClick={() => setIsHighContrast(!isHighContrast)}
          variant={isHighContrast ? "default" : "secondary"}
          size="lg"
          className="font-bold"
        >
          {isHighContrast ? "Normal" : "High Contrast"}
        </Button>
        <Button
          onClick={handleVoiceCommand}
          size="lg"
          className="font-bold bg-green-600 hover:bg-green-700"
        >
          🎤 Voice Help
        </Button>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="mb-6">
            <Badge variant="secondary" className="text-lg px-4 py-2 mb-4">
              Humanitarian Technology for SDG 3 & 10
            </Badge>
          </div>
          
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
            ARGUS Glass
          </h1>
          
          <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
            AI-Powered Offline Navigation and Text-Reading Assistant for Visually Impaired Individuals
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'} p-6`}>
              <CardHeader>
                <CardTitle className={`text-3xl font-bold ${isHighContrast ? 'text-green-400' : 'text-green-600'}`}>
                  90%+
                </CardTitle>
                <CardDescription className={isHighContrast ? 'text-gray-300' : 'text-gray-600'}>
                  Cost Savings vs Traditional Devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className={`${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                  ₹500 vs ₹50,000-₹400,000 traditional assistive devices
                </p>
              </CardContent>
            </Card>

            <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'} p-6`}>
              <CardHeader>
                <CardTitle className={`text-3xl font-bold ${isHighContrast ? 'text-blue-400' : 'text-blue-600'}`}>
                  2.2B
                </CardTitle>
                <CardDescription className={isHighContrast ? 'text-gray-300' : 'text-gray-600'}>
                  People Worldwide with Vision Impairment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className={`${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                  Including 43 million who are completely blind
                </p>
              </CardContent>
            </Card>

            <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'} p-6`}>
              <CardHeader>
                <CardTitle className={`text-3xl font-bold ${isHighContrast ? 'text-purple-400' : 'text-purple-600'}`}>
                  100%
                </CardTitle>
                <CardDescription className={isHighContrast ? 'text-gray-300' : 'text-gray-600'}>
                  Offline Functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className={`${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                  Works anywhere, no internet required
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dynamic Feature Showcase */}
        <div className="mb-12">
          <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'} p-8 text-center transition-all duration-500`}>
            <CardHeader>
              <CardTitle className={`text-2xl mb-4 ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                {features[currentFeature].title}
              </CardTitle>
              <CardDescription className={`text-lg ${isHighContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                {features[currentFeature].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className={`text-xl font-semibold ${isHighContrast ? 'text-blue-400' : 'text-blue-600'}`}>
                {features[currentFeature].impact}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Buttons */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Link href="/navigate">
            <Button 
              size="lg" 
              className={`w-full h-32 text-2xl font-bold ${isHighContrast ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} transition-all duration-200 transform hover:scale-105`}
            >
              🧭 Start Navigation Mode
              <br />
              <span className="text-base opacity-90">AI Obstacle Detection</span>
            </Button>
          </Link>

          <Link href="/read-text">
            <Button 
              size="lg" 
              className={`w-full h-32 text-2xl font-bold ${isHighContrast ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'} transition-all duration-200 transform hover:scale-105`}
            >
              📖 Read Text Mode
              <br />
              <span className="text-base opacity-90">OCR & Voice Reading</span>
            </Button>
          </Link>
        </div>

        {/* Secondary Navigation */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/settings">
            <Button 
              variant="outline" 
              size="lg" 
              className={`w-full h-20 text-lg font-semibold ${isHighContrast ? 'border-gray-600 text-white hover:bg-gray-700' : ''}`}
            >
              ⚙️ Settings & Accessibility
            </Button>
          </Link>

          <Link href="/about">
            <Button 
              variant="outline" 
              size="lg" 
              className={`w-full h-20 text-lg font-semibold ${isHighContrast ? 'border-gray-600 text-white hover:bg-gray-700' : ''}`}
            >
              ℹ️ About ARGUS Glass
            </Button>
          </Link>

          <Button 
            variant="outline" 
            size="lg" 
            className={`w-full h-20 text-lg font-semibold ${isHighContrast ? 'border-gray-600 text-white hover:bg-gray-700' : ''}`}
            onClick={() => announceFeature("Help: Use navigation mode for obstacle detection, or text mode for reading signs and documents. Voice commands available throughout the app.")}
          >
            🆘 Help & Tutorial
          </Button>
        </div>

        {/* Humanitarian Impact */}
        <section className="mt-16 text-center">
          <h2 className={`text-3xl font-bold mb-6 ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
            Advancing UN Sustainable Development Goals
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'} p-6`}>
              <CardHeader>
                <CardTitle className={`text-xl mb-4 ${isHighContrast ? 'text-orange-400' : 'text-orange-600'}`}>
                  SDG 3: Good Health and Well-being
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                  Promoting independent mobility and safety for visually impaired individuals, reducing injury risk and improving quality of life.
                </p>
              </CardContent>
            </Card>

            <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'} p-6`}>
              <CardHeader>
                <CardTitle className={`text-xl mb-4 ${isHighContrast ? 'text-red-400' : 'text-red-600'}`}>
                  SDG 10: Reduced Inequalities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                  Democratizing access to assistive technology by making it affordable and accessible to 90% more people in developing countries.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </section>
    </div>
  );
}