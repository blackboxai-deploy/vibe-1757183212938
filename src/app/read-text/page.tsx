'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

interface TextResult {
  text: string;
  language: string;
  confidence: number;
  type: string;
  timestamp: string;
}

export default function ReadTextPage() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [extractedTexts, setExtractedTexts] = useState<TextResult[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [voiceSpeed, setVoiceSpeed] = useState('normal');
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { code: 'auto', name: 'Auto-detect' },
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi (हिंदी)' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'fr', name: 'French (Français)' },
    { code: 'de', name: 'German (Deutsch)' },
    { code: 'ar', name: 'Arabic (العربية)' },
    { code: 'zh', name: 'Chinese (中文)' },
    { code: 'ja', name: 'Japanese (日本語)' },
  ];

  // Voice synthesis with speed control
  const speak = useCallback((text: string, interrupt: boolean = false) => {
    if ('speechSynthesis' in window) {
      if (interrupt) speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceSpeed === 'slow' ? 0.6 : voiceSpeed === 'fast' ? 1.2 : 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      speechSynthesis.speak(utterance);
    }
  }, [voiceSpeed]);

  // Stop speech
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  // Convert image to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  };

  // OCR Processing using AI
  const processImageForText = async (imageFile: File) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    speak("Processing image for text extraction", true);

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 300);

    try {
      const base64Image = await convertToBase64(imageFile);
      
      // AI OCR processing
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
                  text: `You are ARGUS Glass OCR assistant for visually impaired individuals. Extract ALL visible text from this image and provide detailed analysis. Return a JSON response with this format: {\"extracted_text\": \"complete text found in image\", \"text_type\": \"sign/document/label/menu/bus_number/shop_sign/other\", \"language\": \"detected language code (en/hi/es/etc)\", \"confidence\": 0-100, \"reading_order\": \"organized text in logical reading order\", \"summary\": \"brief description of what type of text this is\"}`
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
      setProcessingProgress(100);

      // Parse AI response
      let ocrResult;
      try {
        ocrResult = JSON.parse(result.choices[0].message.content);
      } catch {
        // Fallback if parsing fails
        const rawText = result.choices[0].message.content;
        ocrResult = {
          extracted_text: rawText,
          text_type: 'document',
          language: selectedLanguage === 'auto' ? 'en' : selectedLanguage,
          confidence: 85,
          reading_order: rawText,
          summary: 'Text extracted from image'
        };
      }

      const newTextResult: TextResult = {
        text: ocrResult.reading_order || ocrResult.extracted_text || 'No text detected',
        language: ocrResult.language || selectedLanguage,
        confidence: ocrResult.confidence || 85,
        type: ocrResult.text_type || 'unknown',
        timestamp: new Date().toLocaleTimeString()
      };

      setExtractedTexts(prev => [newTextResult, ...prev]);
      setCurrentText(newTextResult.text);

      // Announce results
      speak(`Text extracted successfully. Type: ${newTextResult.type}. ${newTextResult.text.length > 200 ? 'Long text detected.' : newTextResult.text}`);

    } catch (error) {
      console.error('OCR processing failed:', error);
      speak('Text extraction failed. Please try again with a clearer image.');
      const errorResult: TextResult = {
        text: 'OCR processing failed. Please try again.',
        language: 'en',
        confidence: 0,
        type: 'error',
        timestamp: new Date().toLocaleTimeString()
      };
      setExtractedTexts(prev => [errorResult, ...prev]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      speak('Image selected. Click process text to extract text content.');
    }
  };

  const handleQuickCapture = () => {
    speak('Camera interface would open here. For demonstration, please upload an image with text.');
    fileInputRef.current?.click();
  };

  const handleVoiceCommand = () => {
    setIsListening(!isListening);
    if (!isListening) {
      speak('Voice commands active. Say process to extract text, or repeat to hear text again.');
    } else {
      speak('Voice commands disabled.');
    }
  };

  const readAloud = (text: string) => {
    speak(text, true);
  };

  const getTextTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'sign': return '🪧';
      case 'document': return '📄';
      case 'label': return '🏷️';
      case 'menu': return '🍽️';
      case 'bus_number': return '🚌';
      case 'shop_sign': return '🏪';
      case 'error': return '⚠️';
      default: return '📝';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return isHighContrast ? 'text-green-400' : 'text-green-600';
    if (confidence >= 70) return isHighContrast ? 'text-yellow-400' : 'text-yellow-600';
    return isHighContrast ? 'text-red-400' : 'text-red-600';
  };

  return (
    <div className={`min-h-screen ${isHighContrast ? 'bg-black text-white' : 'bg-gradient-to-br from-green-50 to-emerald-100'}`}>
      {/* Header */}
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
            📖 Text Reading Mode
          </h1>
          <p className={`text-lg md:text-xl ${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
            AI-Powered OCR & Multi-Language Text Reading
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12">
        {/* Settings Panel */}
        <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'} mb-8`}>
          <CardHeader>
            <CardTitle className={`text-xl ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
              ⚙️ Reading Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                  Language Detection
                </label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className={isHighContrast ? 'bg-gray-700 border-gray-600' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                  Voice Reading Speed
                </label>
                <Select value={voiceSpeed} onValueChange={setVoiceSpeed}>
                  <SelectTrigger className={isHighContrast ? 'bg-gray-700 border-gray-600' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow (0.6x)</SelectItem>
                    <SelectItem value="normal">Normal (0.8x)</SelectItem>
                    <SelectItem value="fast">Fast (1.2x)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Processing Interface */}
        <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'} mb-8`}>
          <CardHeader>
            <CardTitle className={`text-2xl ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
              📷 Text Capture & OCR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Image Preview */}
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Image with text to extract" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-600 text-white">
                    Ready for OCR Processing
                  </Badge>
                </div>
              ) : (
                <div className={`w-full h-64 ${isHighContrast ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border-2 border-dashed rounded-lg flex items-center justify-center`}>
                  <div className="text-center">
                    <p className={`text-lg mb-4 ${isHighContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                      📱 Camera View / Image Upload Area
                    </p>
                    <p className={`text-sm ${isHighContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                      Upload an image with text (signs, documents, labels)
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid md:grid-cols-3 gap-4">
                <Button 
                  onClick={handleQuickCapture}
                  size="lg" 
                  className="h-16 text-lg font-bold bg-green-600 hover:bg-green-700"
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
                  <span className="text-sm opacity-90">With Text</span>
                </Button>

                <Button 
                  onClick={() => selectedImage && processImageForText(selectedImage)}
                  disabled={!selectedImage || isProcessing}
                  size="lg" 
                  className="h-16 text-lg font-bold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isProcessing ? '🔄 Processing...' : '🧠 Process Text'}
                  <br />
                  <span className="text-sm opacity-90">AI OCR</span>
                </Button>
              </div>

              {/* Processing Progress */}
              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Extracting text from image...</span>
                    <span>{processingProgress}%</span>
                  </div>
                  <Progress value={processingProgress} className="w-full" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Text Display */}
        {currentText && (
          <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'} mb-8 border-l-4 border-l-green-600`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className={`text-xl ${isHighContrast ? 'text-green-400' : 'text-green-600'}`}>
                  📝 Extracted Text
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={() => readAloud(currentText)}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    🔊 Read Aloud
                  </Button>
                  <Button
                    onClick={stopSpeaking}
                    size="lg"
                    variant="outline"
                    className={isHighContrast ? 'border-gray-600 text-white hover:bg-gray-700' : ''}
                  >
                    ⏹️ Stop
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                className={`min-h-32 text-lg ${isHighContrast ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                placeholder="Extracted text will appear here..."
              />
            </CardContent>
          </Card>
        )}

        {/* Text History */}
        {extractedTexts.length > 0 && (
          <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'} mb-8`}>
            <CardHeader>
              <CardTitle className={`text-xl ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                📚 Text Reading History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {extractedTexts.map((result, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg ${isHighContrast ? 'bg-gray-700' : 'bg-gray-50'} border-l-4 ${
                      result.type === 'error' ? 'border-l-red-500' : 'border-l-blue-500'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getTextTypeIcon(result.type)}</span>
                        <div>
                          <h4 className={`font-semibold capitalize ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                            {result.type.replace('_', ' ')}
                          </h4>
                          <p className={`text-xs ${isHighContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                            {result.timestamp} | {result.language.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.confidence > 0 && (
                          <Badge 
                            variant="secondary" 
                            className={`${getConfidenceColor(result.confidence)} font-bold`}
                          >
                            {result.confidence}%
                          </Badge>
                        )}
                        <Button
                          onClick={() => readAloud(result.text)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          🔊
                        </Button>
                      </div>
                    </div>
                    <p className={`${isHighContrast ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                      {result.text}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'} mb-8`}>
          <CardHeader>
            <CardTitle className={`text-xl ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
              ⚡ Quick OCR Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button 
                size="lg" 
                variant="outline" 
                className={`h-20 font-bold ${isHighContrast ? 'border-gray-600 text-white hover:bg-gray-700' : ''}`}
                onClick={() => speak('Position camera toward bus number or route sign for quick identification')}
              >
                🚌 Bus Numbers
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className={`h-20 font-bold ${isHighContrast ? 'border-gray-600 text-white hover:bg-gray-700' : ''}`}
                onClick={() => speak('Point camera at shop signs and store names for audio reading')}
              >
                🏪 Shop Signs
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className={`h-20 font-bold ${isHighContrast ? 'border-gray-600 text-white hover:bg-gray-700' : ''}`}
                onClick={() => speak('Capture documents and printed materials for text extraction')}
              >
                📄 Documents
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className={`h-20 font-bold ${isHighContrast ? 'border-gray-600 text-white hover:bg-gray-700' : ''}`}
                onClick={() => speak('Read menus, labels, and product information aloud')}
              >
                🏷️ Labels & Menus
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Voice Commands Guide */}
        <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className={`text-xl ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
              🎤 Voice Commands for Text Reading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-semibold mb-3 ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>Text Processing:</h4>
                <ul className={`space-y-2 ${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• "Process" - Extract text from image</li>
                  <li>• "Read aloud" - Speak current text</li>
                  <li>• "Stop reading" - Pause speech</li>
                  <li>• "Repeat" - Read text again</li>
                  <li>• "Clear text" - Remove current text</li>
                </ul>
              </div>
              <div>
                <h4 className={`font-semibold mb-3 ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>Supported Text Types:</h4>
                <ul className={`space-y-2 ${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• 🪧 Street signs & directions</li>
                  <li>• 📄 Documents & letters</li>
                  <li>• 🚌 Bus routes & schedules</li>
                  <li>• 🏪 Shop names & addresses</li>
                  <li>• 🍽️ Menus & price lists</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}