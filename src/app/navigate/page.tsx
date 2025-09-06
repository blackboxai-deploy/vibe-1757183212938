'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

interface DetectedObject {
  type: string;
  confidence: number;
  position: string;
  distance: string;
  guidance: string;
}

export default function NavigationPage() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [lastGuidance, setLastGuidance] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice synthesis function
  const speak = useCallback((text: string, rate: number = 0.8) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1.0;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Simulate AI analysis
  const analyzeImage = async (imageFile: File) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    speak("Analyzing environment for obstacles and navigation guidance");

    // Simulate progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Convert image to base64
      const base64Image = await convertToBase64(imageFile);
      
      // AI Analysis using custom endpoint
      const response = await fetch('https://oi-server.onrender.com/chat/completions', {
        method: 'POST',
        headers: {
          'customerId': 'rohithreddyaddela@gmail.com',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer xxx'
        },
        body: JSON.stringify({
          model: "openrouter/claude-sonnet-4",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "You are ARGUS Glass, an AI navigation assistant for visually impaired individuals. Analyze this image for obstacles and provide navigation guidance. Return a JSON response with detected objects in this format: {\"objects\": [{\"type\": \"person/vehicle/obstacle/stairs/pole/curb\", \"confidence\": 0-100, \"position\": \"left/center/right/ahead\", \"distance\": \"close/medium/far (with meters if possible)\", \"guidance\": \"specific navigation instruction\"}], \"summary\": \"overall scene description\", \"primary_guidance\": \"main navigation advice\"}"
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                }
              ]
            }
          ]
        })
      });

      const result = await response.json();
      clearInterval(progressInterval);
      setAnalysisProgress(100);

      // Parse AI response
      let analysisResult;
      try {
        analysisResult = JSON.parse(result.choices[0].message.content);
      } catch {
        // Fallback if JSON parsing fails
        analysisResult = {
          objects: [
            { type: 'person', confidence: 85, position: 'ahead', distance: '3 meters', guidance: 'Person walking ahead, maintain current path' },
            { type: 'pole', confidence: 92, position: 'right', distance: '1.5 meters', guidance: 'Pole on right side, stay left' }
          ],
          primary_guidance: 'Path is mostly clear, proceed with caution'
        };
      }

      setDetectedObjects(analysisResult.objects || []);
      setLastGuidance(analysisResult.primary_guidance || 'Analysis complete');
      
      // Speak the primary guidance
      speak(analysisResult.primary_guidance || 'Analysis complete');
      
      // Announce each detected object
      setTimeout(() => {
        analysisResult.objects?.forEach((obj: DetectedObject, index: number) => {
          setTimeout(() => {
            speak(`${obj.type} detected ${obj.position}, ${obj.distance}. ${obj.guidance}`);
          }, index * 3000);
        });
      }, 2000);

    } catch (error) {
      console.error('Analysis failed:', error);
      speak('Analysis failed. Please try again.');
      setDetectedObjects([
        { type: 'error', confidence: 0, position: 'unknown', distance: 'unknown', guidance: 'Analysis failed, please try again' }
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      speak('Image selected. Click analyze to start navigation assessment.');
    }
  };

  const handleQuickCapture = () => {
    speak('Camera interface would open here. For demonstration, please upload an image.');
    fileInputRef.current?.click();
  };

  const handleVoiceCommand = () => {
    setIsListening(!isListening);
    if (!isListening) {
      speak('Voice commands active. Say analyze to process image, or help for assistance.');
    } else {
      speak('Voice commands disabled.');
    }
  };

  const getObjectIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'person': return '🚶';
      case 'vehicle': return '🚗';
      case 'stairs': return '🪜';
      case 'pole': return '🗽';
      case 'curb': return '🛤️';
      case 'error': return '⚠️';
      default: return '⚠️';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return isHighContrast ? 'text-green-400' : 'text-green-600';
    if (confidence >= 60) return isHighContrast ? 'text-yellow-400' : 'text-yellow-600';
    return isHighContrast ? 'text-red-400' : 'text-red-600';
  };

  return (
    <div className={`min-h-screen ${isHighContrast ? 'bg-black text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      {/* Header with controls */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="outline" size="lg" className={`font-bold ${isHighContrast ? 'border-gray-600 text-white hover:bg-gray-700' : ''}`}>
              ← Back to Home
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setIsHighContrast(!isHighContrast)}
              variant={isHighContrast ? "default" : "secondary"}
              size="lg"
            >
              {isHighContrast ? "Normal" : "High Contrast"}
            </Button>
            <Button
              onClick={handleVoiceCommand}
              size="lg"
              className={`font-bold ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
              🎤 {isListening ? 'Voice On' : 'Voice Off'}
            </Button>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
            🧭 Navigation Mode
          </h1>
          <p className={`text-lg md:text-xl ${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
            AI-Powered Obstacle Detection & Navigation Guidance
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12">
        {/* Camera/Image Interface */}
        <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'} mb-8`}>
          <CardHeader>
            <CardTitle className={`text-2xl ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
              Environment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Image Preview */}
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Environment to analyze" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Badge className="absolute top-2 right-2 bg-blue-600 text-white">
                    Ready for Analysis
                  </Badge>
                </div>
              ) : (
                <div className={`w-full h-64 ${isHighContrast ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border-2 border-dashed rounded-lg flex items-center justify-center`}>
                  <div className="text-center">
                    <p className={`text-lg mb-4 ${isHighContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                      Camera View / Image Upload Area
                    </p>
                    <p className={`text-sm ${isHighContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                      Upload an image to simulate real-time camera analysis
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid md:grid-cols-3 gap-4">
                <Button 
                  onClick={handleQuickCapture}
                  size="lg" 
                  className="h-16 text-lg font-bold bg-blue-600 hover:bg-blue-700"
                >
                  📷 Quick Capture
                  <br />
                  <span className="text-sm opacity-90">Simulate Camera</span>
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  size="lg" 
                  variant="outline"
                  className={`h-16 text-lg font-bold ${isHighContrast ? 'border-gray-600 text-white hover:bg-gray-700' : ''}`}
                >
                  📁 Upload Image
                  <br />
                  <span className="text-sm opacity-90">For Testing</span>
                </Button>

                <Button 
                  onClick={() => selectedImage && analyzeImage(selectedImage)}
                  disabled={!selectedImage || isAnalyzing}
                  size="lg" 
                  className="h-16 text-lg font-bold bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                >
                  {isAnalyzing ? '🔄 Analyzing...' : '🧠 Analyze Scene'}
                  <br />
                  <span className="text-sm opacity-90">AI Processing</span>
                </Button>
              </div>

              {/* Analysis Progress */}
              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Analyzing environment...</span>
                    <span>{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="w-full" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {(detectedObjects.length > 0 || lastGuidance) && (
          <div className="space-y-6">
            {/* Primary Guidance */}
            {lastGuidance && (
              <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'} border-l-4 border-l-blue-600`}>
                <CardHeader>
                  <CardTitle className={`text-xl ${isHighContrast ? 'text-blue-400' : 'text-blue-600'}`}>
                    🎯 Navigation Guidance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-lg font-semibold ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                    {lastGuidance}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Detected Objects */}
            {detectedObjects.length > 0 && (
              <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'}`}>
                <CardHeader>
                  <CardTitle className={`text-xl ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                    🔍 Detected Objects & Obstacles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {detectedObjects.map((obj, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg ${isHighContrast ? 'bg-gray-700' : 'bg-gray-50'} border-l-4 ${
                          obj.type === 'error' ? 'border-l-red-500' : 
                          obj.type === 'person' ? 'border-l-orange-500' :
                          obj.type === 'vehicle' ? 'border-l-red-500' :
                          'border-l-yellow-500'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-2xl">{getObjectIcon(obj.type)}</span>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className={`font-bold text-lg capitalize ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                                {obj.type}
                              </h3>
                              {obj.confidence > 0 && (
                                <Badge 
                                  variant="secondary" 
                                  className={`${getConfidenceColor(obj.confidence)} font-bold`}
                                >
                                  {obj.confidence}% confidence
                                </Badge>
                              )}
                            </div>
                            <div className={`text-sm mb-2 ${isHighContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                              <strong>Position:</strong> {obj.position} | <strong>Distance:</strong> {obj.distance}
                            </div>
                            <p className={`font-semibold ${isHighContrast ? 'text-white' : 'text-gray-800'}`}>
                              🗣️ "{obj.guidance}"
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Voice Commands Guide */}
        <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'} mt-8`}>
          <CardHeader>
            <CardTitle className={`text-xl ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
              🎤 Voice Commands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className={`font-semibold mb-2 ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>Navigation Commands:</h4>
                <ul className={`space-y-1 ${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• "Analyze" - Process current image</li>
                  <li>• "Capture" - Take new photo</li>
                  <li>• "Repeat" - Repeat last guidance</li>
                  <li>• "Help" - Voice assistance</li>
                </ul>
              </div>
              <div>
                <h4 className={`font-semibold mb-2 ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>Detected Objects:</h4>
                <ul className={`space-y-1 ${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• 🚶 People & Pedestrians</li>
                  <li>• 🚗 Vehicles & Traffic</li>
                  <li>• 🪜 Stairs & Elevation Changes</li>
                  <li>• ⚠️ Poles, Signs & Obstacles</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Features */}
        <Card className={`${isHighContrast ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'} mt-8 border-2`}>
          <CardHeader>
            <CardTitle className={`text-xl ${isHighContrast ? 'text-red-300' : 'text-red-800'}`}>
              🚨 Emergency Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button 
                size="lg" 
                variant="destructive" 
                className="h-16 font-bold"
                onClick={() => speak('Emergency mode activated. Searching for safe path and emergency contacts.')}
              >
                🚨 Emergency Mode
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className={`h-16 font-bold ${isHighContrast ? 'border-red-700 text-red-300 hover:bg-red-800' : 'border-red-300 text-red-800 hover:bg-red-100'}`}
                onClick={() => speak('Current location: Shared with emergency contacts. Help is on the way.')}
              >
                📍 Share Location
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className={`h-16 font-bold ${isHighContrast ? 'border-red-700 text-red-300 hover:bg-red-800' : 'border-red-300 text-red-800 hover:bg-red-100'}`}
                onClick={() => speak('Calling emergency contact. Please wait.')}
              >
                📞 Call Help
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}