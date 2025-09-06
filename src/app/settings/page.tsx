'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: number;
  voiceSpeed: number;
  voiceVolume: number;
  hapticFeedback: boolean;
  voiceCommands: boolean;
  autoRead: boolean;
  language: string;
  emergencyContact: string;
  soundAlerts: boolean;
  screenReader: boolean;
}

interface NavigationSettings {
  obstacleDistance: number;
  guidanceFrequency: string;
  hazardAlerts: boolean;
  pathMemory: boolean;
  locationSharing: boolean;
}

interface OCRSettings {
  autoLanguageDetection: boolean;
  textConfidenceThreshold: number;
  readOnDetection: boolean;
  saveHistory: boolean;
  multiLanguageSupport: boolean;
}

export default function SettingsPage() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [activeTab, setActiveTab] = useState('accessibility');

  // Settings states
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    highContrast: false,
    fontSize: 16,
    voiceSpeed: 80,
    voiceVolume: 80,
    hapticFeedback: true,
    voiceCommands: true,
    autoRead: true,
    language: 'en',
    emergencyContact: '',
    soundAlerts: true,
    screenReader: true
  });

  const [navigationSettings, setNavigationSettings] = useState<NavigationSettings>({
    obstacleDistance: 3,
    guidanceFrequency: 'normal',
    hazardAlerts: true,
    pathMemory: true,
    locationSharing: false
  });

  const [ocrSettings, setOCRSettings] = useState<OCRSettings>({
    autoLanguageDetection: true,
    textConfidenceThreshold: 70,
    readOnDetection: true,
    saveHistory: true,
    multiLanguageSupport: true
  });

  // Voice synthesis for accessibility
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = accessibilitySettings.voiceSpeed / 100;
      utterance.volume = accessibilitySettings.voiceVolume / 100;
      speechSynthesis.speak(utterance);
    }
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('argus-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setAccessibilitySettings(prev => ({ ...prev, ...parsed.accessibility }));
      setNavigationSettings(prev => ({ ...prev, ...parsed.navigation }));
      setOCRSettings(prev => ({ ...prev, ...parsed.ocr }));
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    const settings = {
      accessibility: accessibilitySettings,
      navigation: navigationSettings,
      ocr: ocrSettings
    };
    localStorage.setItem('argus-settings', JSON.stringify(settings));
    speak('Settings saved successfully');
  };

  // Test voice settings
  const testVoice = () => {
    speak('This is a voice test. ARGUS Glass is ready to assist you with navigation and text reading.');
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi (हिंदी)' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'fr', name: 'French (Français)' },
    { code: 'de', name: 'German (Deutsch)' },
    { code: 'ar', name: 'Arabic (العربية)' },
    { code: 'zh', name: 'Chinese (中文)' },
    { code: 'ja', name: 'Japanese (日本語)' }
  ];

  const resetToDefaults = () => {
    setAccessibilitySettings({
      highContrast: false,
      fontSize: 16,
      voiceSpeed: 80,
      voiceVolume: 80,
      hapticFeedback: true,
      voiceCommands: true,
      autoRead: true,
      language: 'en',
      emergencyContact: '',
      soundAlerts: true,
      screenReader: true
    });
    setNavigationSettings({
      obstacleDistance: 3,
      guidanceFrequency: 'normal',
      hazardAlerts: true,
      pathMemory: true,
      locationSharing: false
    });
    setOCRSettings({
      autoLanguageDetection: true,
      textConfidenceThreshold: 70,
      readOnDetection: true,
      saveHistory: true,
      multiLanguageSupport: true
    });
    speak('Settings reset to default values');
  };

  const tabButtons = [
    { id: 'accessibility', label: '♿ Accessibility', icon: '♿' },
    { id: 'navigation', label: '🧭 Navigation', icon: '🧭' },
    { id: 'ocr', label: '📖 Text Reading', icon: '📖' },
    { id: 'emergency', label: '🚨 Emergency', icon: '🚨' }
  ];

  return (
    <div className={`min-h-screen ${isHighContrast ? 'bg-black text-white' : 'bg-gradient-to-br from-purple-50 to-pink-100'}`}>
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
              onClick={saveSettings}
              size="lg"
              className="font-bold bg-green-600 hover:bg-green-700"
            >
              💾 Save Settings
            </Button>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
            ⚙️ Settings & Accessibility
          </h1>
          <p className={`text-lg md:text-xl ${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
            Customize ARGUS Glass for Your Needs
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12">
        {/* Tab Navigation */}
        <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'} mb-8`}>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tabButtons.map(tab => (
                <Button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    speak(`${tab.label} settings`);
                  }}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  size="lg"
                  className={`h-20 text-lg font-bold ${
                    activeTab === tab.id 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : isHighContrast 
                        ? 'border-gray-600 text-white hover:bg-gray-700' 
                        : ''
                  }`}
                >
                  {tab.icon}
                  <br />
                  <span className="text-sm">{tab.label.split(' ')[1]}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Settings */}
        {activeTab === 'accessibility' && (
          <div className="space-y-6">
            <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`text-2xl ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                  ♿ Accessibility Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Visual Settings */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className={`text-lg font-semibold ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>Visual Settings</h3>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="high-contrast" className="text-base font-medium">
                        High Contrast Mode
                      </Label>
                      <Switch
                        id="high-contrast"
                        checked={accessibilitySettings.highContrast}
                        onCheckedChange={(checked) => {
                          setAccessibilitySettings(prev => ({ ...prev, highContrast: checked }));
                          setIsHighContrast(checked);
                          speak(checked ? 'High contrast enabled' : 'High contrast disabled');
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-medium">
                        Font Size: {accessibilitySettings.fontSize}px
                      </Label>
                      <Slider
                        value={[accessibilitySettings.fontSize]}
                        onValueChange={(value) => setAccessibilitySettings(prev => ({ ...prev, fontSize: value[0] }))}
                        min={12}
                        max={24}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className={`text-lg font-semibold ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>Audio Settings</h3>
                    
                    <div className="space-y-2">
                      <Label className="text-base font-medium">
                        Voice Speed: {accessibilitySettings.voiceSpeed}%
                      </Label>
                      <Slider
                        value={[accessibilitySettings.voiceSpeed]}
                        onValueChange={(value) => setAccessibilitySettings(prev => ({ ...prev, voiceSpeed: value[0] }))}
                        min={50}
                        max={150}
                        step={10}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-medium">
                        Voice Volume: {accessibilitySettings.voiceVolume}%
                      </Label>
                      <Slider
                        value={[accessibilitySettings.voiceVolume]}
                        onValueChange={(value) => setAccessibilitySettings(prev => ({ ...prev, voiceVolume: value[0] }))}
                        min={0}
                        max={100}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Language & Voice */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Primary Language</Label>
                    <Select
                      value={accessibilitySettings.language}
                      onValueChange={(value) => setAccessibilitySettings(prev => ({ ...prev, language: value }))}
                    >
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

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Voice Test</Label>
                    <Button onClick={testVoice} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                      🔊 Test Voice Settings
                    </Button>
                  </div>
                </div>

                {/* Interaction Settings */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className={`text-lg font-semibold ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>Interaction</h3>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="voice-commands" className="text-base font-medium">
                        Voice Commands
                      </Label>
                      <Switch
                        id="voice-commands"
                        checked={accessibilitySettings.voiceCommands}
                        onCheckedChange={(checked) => setAccessibilitySettings(prev => ({ ...prev, voiceCommands: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="haptic-feedback" className="text-base font-medium">
                        Haptic Feedback
                      </Label>
                      <Switch
                        id="haptic-feedback"
                        checked={accessibilitySettings.hapticFeedback}
                        onCheckedChange={(checked) => setAccessibilitySettings(prev => ({ ...prev, hapticFeedback: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-read" className="text-base font-medium">
                        Auto-Read Results
                      </Label>
                      <Switch
                        id="auto-read"
                        checked={accessibilitySettings.autoRead}
                        onCheckedChange={(checked) => setAccessibilitySettings(prev => ({ ...prev, autoRead: checked }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className={`text-lg font-semibold ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>Alerts</h3>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sound-alerts" className="text-base font-medium">
                        Sound Alerts
                      </Label>
                      <Switch
                        id="sound-alerts"
                        checked={accessibilitySettings.soundAlerts}
                        onCheckedChange={(checked) => setAccessibilitySettings(prev => ({ ...prev, soundAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="screen-reader" className="text-base font-medium">
                        Screen Reader Support
                      </Label>
                      <Switch
                        id="screen-reader"
                        checked={accessibilitySettings.screenReader}
                        onCheckedChange={(checked) => setAccessibilitySettings(prev => ({ ...prev, screenReader: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Settings */}
        {activeTab === 'navigation' && (
          <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'}`}>
            <CardHeader>
              <CardTitle className={`text-2xl ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                🧭 Navigation Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>Detection Settings</h3>
                  
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Obstacle Detection Distance: {navigationSettings.obstacleDistance} meters
                    </Label>
                    <Slider
                      value={[navigationSettings.obstacleDistance]}
                      onValueChange={(value) => setNavigationSettings(prev => ({ ...prev, obstacleDistance: value[0] }))}
                      min={1}
                      max={10}
                      step={0.5}
                      className="w-full"
                    />
                    <p className={`text-sm ${isHighContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                      How far ahead to detect obstacles
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">Guidance Frequency</Label>
                    <Select
                      value={navigationSettings.guidanceFrequency}
                      onValueChange={(value) => setNavigationSettings(prev => ({ ...prev, guidanceFrequency: value }))}
                    >
                      <SelectTrigger className={isHighContrast ? 'bg-gray-700 border-gray-600' : ''}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal (Important only)</SelectItem>
                        <SelectItem value="normal">Normal (Balanced)</SelectItem>
                        <SelectItem value="detailed">Detailed (All obstacles)</SelectItem>
                        <SelectItem value="continuous">Continuous (Real-time)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>Safety Features</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hazard-alerts" className="text-base font-medium">
                      Hazard Alerts
                    </Label>
                    <Switch
                      id="hazard-alerts"
                      checked={navigationSettings.hazardAlerts}
                      onCheckedChange={(checked) => setNavigationSettings(prev => ({ ...prev, hazardAlerts: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="path-memory" className="text-base font-medium">
                      Path Memory
                    </Label>
                    <Switch
                      id="path-memory"
                      checked={navigationSettings.pathMemory}
                      onCheckedChange={(checked) => setNavigationSettings(prev => ({ ...prev, pathMemory: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="location-sharing" className="text-base font-medium">
                      Emergency Location Sharing
                    </Label>
                    <Switch
                      id="location-sharing"
                      checked={navigationSettings.locationSharing}
                      onCheckedChange={(checked) => setNavigationSettings(prev => ({ ...prev, locationSharing: checked }))}
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Tips */}
              <div className={`p-4 rounded-lg ${isHighContrast ? 'bg-gray-700' : 'bg-blue-50'} border-l-4 border-l-blue-500`}>
                <h4 className={`font-semibold mb-2 ${isHighContrast ? 'text-blue-400' : 'text-blue-800'}`}>
                  Navigation Tips:
                </h4>
                <ul className={`space-y-1 text-sm ${isHighContrast ? 'text-gray-300' : 'text-blue-700'}`}>
                  <li>• Hold phone at chest level for best obstacle detection</li>
                  <li>• Use voice commands for hands-free operation</li>
                  <li>• Enable haptic feedback for silent navigation alerts</li>
                  <li>• Adjust detection distance based on walking speed</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* OCR Settings */}
        {activeTab === 'ocr' && (
          <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'}`}>
            <CardHeader>
              <CardTitle className={`text-2xl ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                📖 Text Reading Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>OCR Settings</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-language" className="text-base font-medium">
                      Auto Language Detection
                    </Label>
                    <Switch
                      id="auto-language"
                      checked={ocrSettings.autoLanguageDetection}
                      onCheckedChange={(checked) => setOCRSettings(prev => ({ ...prev, autoLanguageDetection: checked }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Text Confidence Threshold: {ocrSettings.textConfidenceThreshold}%
                    </Label>
                    <Slider
                      value={[ocrSettings.textConfidenceThreshold]}
                      onValueChange={(value) => setOCRSettings(prev => ({ ...prev, textConfidenceThreshold: value[0] }))}
                      min={50}
                      max={95}
                      step={5}
                      className="w-full"
                    />
                    <p className={`text-sm ${isHighContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                      Minimum confidence required to read text aloud
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="multi-language" className="text-base font-medium">
                      Multi-Language Support
                    </Label>
                    <Switch
                      id="multi-language"
                      checked={ocrSettings.multiLanguageSupport}
                      onCheckedChange={(checked) => setOCRSettings(prev => ({ ...prev, multiLanguageSupport: checked }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>Reading Behavior</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="read-on-detection" className="text-base font-medium">
                      Read Text on Detection
                    </Label>
                    <Switch
                      id="read-on-detection"
                      checked={ocrSettings.readOnDetection}
                      onCheckedChange={(checked) => setOCRSettings(prev => ({ ...prev, readOnDetection: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="save-history" className="text-base font-medium">
                      Save Reading History
                    </Label>
                    <Switch
                      id="save-history"
                      checked={ocrSettings.saveHistory}
                      onCheckedChange={(checked) => setOCRSettings(prev => ({ ...prev, saveHistory: checked }))}
                    />
                  </div>
                </div>
              </div>

              {/* Supported Languages */}
              <div className={`p-4 rounded-lg ${isHighContrast ? 'bg-gray-700' : 'bg-green-50'} border-l-4 border-l-green-500`}>
                <h4 className={`font-semibold mb-3 ${isHighContrast ? 'text-green-400' : 'text-green-800'}`}>
                  Supported Languages for OCR:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {languages.map(lang => (
                    <Badge key={lang.code} variant="secondary" className="justify-center">
                      {lang.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emergency Settings */}
        {activeTab === 'emergency' && (
          <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'}`}>
            <CardHeader>
              <CardTitle className={`text-2xl ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                🚨 Emergency Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency-contact" className="text-base font-medium">
                    Primary Emergency Contact
                  </Label>
                  <Input
                    id="emergency-contact"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={accessibilitySettings.emergencyContact}
                    onChange={(e) => setAccessibilitySettings(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    className={`text-lg h-12 ${isHighContrast ? 'bg-gray-700 border-gray-600' : ''}`}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => speak('Emergency contact would be called in a real emergency situation')}
                    size="lg"
                    variant="destructive"
                    className="h-16 text-lg font-bold"
                  >
                    📞 Test Emergency Call
                  </Button>
                  <Button
                    onClick={() => speak('Location would be shared with emergency contact and services')}
                    size="lg"
                    variant="outline"
                    className={`h-16 text-lg font-bold ${isHighContrast ? 'border-gray-600 text-white hover:bg-gray-700' : ''}`}
                  >
                    📍 Test Location Share
                  </Button>
                </div>

                <div className={`p-4 rounded-lg ${isHighContrast ? 'bg-red-900' : 'bg-red-50'} border-l-4 border-l-red-500`}>
                  <h4 className={`font-semibold mb-2 ${isHighContrast ? 'text-red-400' : 'text-red-800'}`}>
                    Emergency Features:
                  </h4>
                  <ul className={`space-y-1 text-sm ${isHighContrast ? 'text-gray-300' : 'text-red-700'}`}>
                    <li>• Triple-tap volume button for emergency activation</li>
                    <li>• Automatic location sharing with emergency contacts</li>
                    <li>• Voice guidance to nearest safe location</li>
                    <li>• Integration with local emergency services</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={saveSettings}
            size="lg"
            className="px-8 py-4 text-lg font-bold bg-green-600 hover:bg-green-700"
          >
            💾 Save All Settings
          </Button>
          <Button
            onClick={resetToDefaults}
            size="lg"
            variant="outline"
            className={`px-8 py-4 text-lg font-bold ${isHighContrast ? 'border-gray-600 text-white hover:bg-gray-700' : ''}`}
          >
            🔄 Reset to Defaults
          </Button>
        </div>
      </main>
    </div>
  );
}