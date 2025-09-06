'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

export default function AboutPage() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [activeSection, setActiveSection] = useState('mission');

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const costComparisonData = [
    { device: 'ARGUS Glass (Smartphone + App)', cost: 500, percentage: 0.1 },
    { device: 'Smart Cane with Sensors', cost: 50000, percentage: 12.5 },
    { device: 'OrCam MyEye Pro', cost: 200000, percentage: 50 },
    { device: 'Glidance Navigation Device', cost: 400000, percentage: 100 }
  ];

  const sdgImpacts = [
    {
      goal: 'SDG 3: Good Health and Well-being',
      color: 'green',
      impacts: [
        'Reduces injury risk from navigation hazards',
        'Promotes independent mobility and mental health',
        'Enables access to healthcare information',
        'Improves safety in urban environments'
      ]
    },
    {
      goal: 'SDG 10: Reduced Inequalities',
      color: 'red',
      impacts: [
        'Makes assistive technology affordable for 90% more people',
        'Eliminates cost barrier in developing countries',
        'Provides equal access to navigation assistance',
        'Democratizes advanced AI-powered tools'
      ]
    }
  ];

  const technicalFeatures = [
    {
      category: 'AI & Machine Learning',
      features: [
        'Claude Sonnet 4 for intelligent scene analysis',
        'Advanced computer vision for obstacle detection',
        'Multi-language OCR with 95%+ accuracy',
        'Context-aware navigation guidance'
      ]
    },
    {
      category: 'Accessibility Technology',
      features: [
        'TalkBack integration and screen reader support',
        'Voice commands with natural language processing',
        'Haptic feedback patterns for different obstacles',
        'High contrast modes and large touch targets'
      ]
    },
    {
      category: 'Offline Capabilities',
      features: [
        'Runs entirely without internet connection',
        'Local AI processing for privacy and speed',
        'Works in areas with poor network coverage',
        'No data usage or subscription fees'
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${isHighContrast ? 'bg-black text-white' : 'bg-gradient-to-br from-indigo-50 to-purple-100'}`}>
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
              onClick={() => speak('About ARGUS Glass: AI-powered offline navigation and text reading assistant for visually impaired individuals')}
              size="lg"
              className="font-bold bg-blue-600 hover:bg-blue-700"
            >
              🎤 Read About
            </Button>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
            About ARGUS Glass
          </h1>
          <p className={`text-lg md:text-xl ${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
            Empowering Independence Through AI-Powered Accessibility
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12">
        {/* Section Navigation */}
        <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'} mb-8`}>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { id: 'mission', label: '🎯 Mission & Vision', icon: '🎯' },
                { id: 'impact', label: '🌍 Global Impact', icon: '🌍' },
                { id: 'technology', label: '🤖 Technology', icon: '🤖' },
                { id: 'cost', label: '💰 Cost Analysis', icon: '💰' }
              ].map(section => (
                <Button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    speak(`${section.label} section`);
                  }}
                  variant={activeSection === section.id ? "default" : "outline"}
                  size="lg"
                  className={`h-20 text-lg font-bold ${
                    activeSection === section.id 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                      : isHighContrast 
                        ? 'border-gray-600 text-white hover:bg-gray-700' 
                        : ''
                  }`}
                >
                  {section.icon}
                  <br />
                  <span className="text-sm">{section.label.split(' ')[1]}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mission & Vision */}
        {activeSection === 'mission' && (
          <div className="space-y-6">
            <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'} border-l-4 border-l-blue-600`}>
              <CardHeader>
                <CardTitle className={`text-2xl ${isHighContrast ? 'text-blue-400' : 'text-blue-600'}`}>
                  🎯 Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-lg leading-relaxed mb-6 ${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                  ARGUS Glass transforms any standard Android smartphone into a comprehensive "smart vision" device through an 
                  AI-powered application that operates entirely offline. We believe that assistive technology should be accessible, 
                  affordable, and available to everyone who needs it.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className={`p-4 rounded-lg ${isHighContrast ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <h3 className={`text-xl font-semibold mb-3 ${isHighContrast ? 'text-blue-400' : 'text-blue-800'}`}>
                      Vision Statement
                    </h3>
                    <p className={`${isHighContrast ? 'text-gray-300' : 'text-blue-700'}`}>
                      A world where visual impairment doesn't limit independence, where advanced AI technology empowers 
                      every individual to navigate confidently and access information freely.
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${isHighContrast ? 'bg-gray-700' : 'bg-green-50'}`}>
                    <h3 className={`text-xl font-semibold mb-3 ${isHighContrast ? 'text-green-400' : 'text-green-800'}`}>
                      Core Values
                    </h3>
                    <ul className={`space-y-2 ${isHighContrast ? 'text-gray-300' : 'text-green-700'}`}>
                      <li>• <strong>Accessibility First:</strong> Designed for everyone</li>
                      <li>• <strong>Affordability:</strong> Technology without barriers</li>
                      <li>• <strong>Independence:</strong> Empowering self-reliance</li>
                      <li>• <strong>Privacy:</strong> Offline-first approach</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`text-2xl ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                  🚀 Project Origin & Inspiration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className={`text-center p-4 rounded-lg ${isHighContrast ? 'bg-gray-700' : 'bg-orange-50'}`}>
                    <div className={`text-3xl font-bold mb-2 ${isHighContrast ? 'text-orange-400' : 'text-orange-600'}`}>
                      2.2B
                    </div>
                    <h4 className={`font-semibold mb-2 ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                      People Affected
                    </h4>
                    <p className={`text-sm ${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                      Worldwide with vision impairment need accessible solutions
                    </p>
                  </div>
                  
                  <div className={`text-center p-4 rounded-lg ${isHighContrast ? 'bg-gray-700' : 'bg-red-50'}`}>
                    <div className={`text-3xl font-bold mb-2 ${isHighContrast ? 'text-red-400' : 'text-red-600'}`}>
                      90%
                    </div>
                    <h4 className={`font-semibold mb-2 ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                      Cannot Afford
                    </h4>
                    <p className={`text-sm ${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                      Traditional assistive devices in developing countries
                    </p>
                  </div>
                  
                  <div className={`text-center p-4 rounded-lg ${isHighContrast ? 'bg-gray-700' : 'bg-purple-50'}`}>
                    <div className={`text-3xl font-bold mb-2 ${isHighContrast ? 'text-purple-400' : 'text-purple-600'}`}>
                      80%
                    </div>
                    <h4 className={`font-semibold mb-2 ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                      Limited Connectivity
                    </h4>
                    <p className={`text-sm ${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                      Users in areas with poor internet access
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Global Impact */}
        {activeSection === 'impact' && (
          <div className="space-y-6">
            <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`text-2xl ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                  🌍 UN Sustainable Development Goals Alignment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sdgImpacts.map((sdg, index) => (
                    <div 
                      key={index}
                      className={`p-6 rounded-lg border-l-4 ${
                        sdg.color === 'green' 
                          ? `border-l-green-500 ${isHighContrast ? 'bg-gray-700' : 'bg-green-50'}` 
                          : `border-l-red-500 ${isHighContrast ? 'bg-gray-700' : 'bg-red-50'}`
                      }`}
                    >
                      <h3 className={`text-xl font-semibold mb-4 ${
                        isHighContrast 
                          ? sdg.color === 'green' ? 'text-green-400' : 'text-red-400'
                          : sdg.color === 'green' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {sdg.goal}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {sdg.impacts.map((impact, impactIndex) => (
                          <div key={impactIndex} className="flex items-start gap-3">
                            <span className={`mt-1 ${
                              isHighContrast 
                                ? sdg.color === 'green' ? 'text-green-400' : 'text-red-400'
                                : sdg.color === 'green' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              ✓
                            </span>
                            <p className={`${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                              {impact}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`text-2xl ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                  📈 Projected Impact Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { metric: 'Users Reached', value: '1M+', description: 'Potential users in first 3 years' },
                    { metric: 'Cost Reduction', value: '95%', description: 'Vs traditional devices' },
                    { metric: 'Independence Score', value: '8.5/10', description: 'User-reported independence rating' },
                    { metric: 'Safety Improvement', value: '75%', description: 'Reduction in navigation incidents' }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className={`text-center p-4 rounded-lg ${isHighContrast ? 'bg-gray-700' : 'bg-gray-50'}`}
                    >
                      <div className={`text-2xl font-bold mb-2 ${isHighContrast ? 'text-blue-400' : 'text-blue-600'}`}>
                        {item.value}
                      </div>
                      <h4 className={`font-semibold mb-2 ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                        {item.metric}
                      </h4>
                      <p className={`text-sm ${isHighContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Technology */}
        {activeSection === 'technology' && (
          <div className="space-y-6">
            {technicalFeatures.map((category, index) => (
              <Card key={index} className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'}`}>
                <CardHeader>
                  <CardTitle className={`text-2xl ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {category.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex}
                        className={`p-4 rounded-lg ${isHighContrast ? 'bg-gray-700' : 'bg-gray-50'} border-l-4 border-l-indigo-500`}
                      >
                        <p className={`font-medium ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'} border-l-4 border-l-purple-600`}>
              <CardHeader>
                <CardTitle className={`text-2xl ${isHighContrast ? 'text-purple-400' : 'text-purple-600'}`}>
                  🔧 Technical Architecture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${isHighContrast ? 'bg-gray-700' : 'bg-purple-50'}`}>
                    <h4 className={`font-semibold mb-2 ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                      AI Processing Pipeline:
                    </h4>
                    <p className={`text-sm ${isHighContrast ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                      Image Capture → AI Analysis → Context Understanding → Audio/Haptic Output
                    </p>
                    <div className="space-y-2">
                      <div>
                        <span className={`font-medium ${isHighContrast ? 'text-blue-400' : 'text-blue-600'}`}>
                          Scene Analysis:
                        </span>
                        <span className={`ml-2 ${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                          Claude Sonnet 4 for intelligent object detection and spatial reasoning
                        </span>
                      </div>
                      <div>
                        <span className={`font-medium ${isHighContrast ? 'text-green-400' : 'text-green-600'}`}>
                          OCR Processing:
                        </span>
                        <span className={`ml-2 ${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                          Advanced text recognition with 95%+ accuracy across multiple languages
                        </span>
                      </div>
                      <div>
                        <span className={`font-medium ${isHighContrast ? 'text-orange-400' : 'text-orange-600'}`}>
                          Voice Synthesis:
                        </span>
                        <span className={`ml-2 ${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                          Web Speech API with customizable speed and language support
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Cost Analysis */}
        {activeSection === 'cost' && (
          <div className="space-y-6">
            <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`text-2xl ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                  💰 Affordability Revolution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className={`p-4 rounded-lg ${isHighContrast ? 'bg-green-900' : 'bg-green-50'} border-l-4 border-l-green-500`}>
                    <h3 className={`text-xl font-semibold mb-2 ${isHighContrast ? 'text-green-400' : 'text-green-800'}`}>
                      Breaking the Cost Barrier
                    </h3>
                    <p className={`${isHighContrast ? 'text-gray-300' : 'text-green-700'}`}>
                      ARGUS Glass makes advanced assistive technology accessible to 90% more people by leveraging 
                      existing smartphone infrastructure and eliminating the need for expensive specialized hardware.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className={`text-lg font-semibold ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                      Cost Comparison with Traditional Solutions:
                    </h4>
                    {costComparisonData.map((item, index) => (
                      <div key={index} className={`p-4 rounded-lg ${isHighContrast ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-medium ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                            {item.device}
                          </span>
                          <div className="text-right">
                            <span className={`text-lg font-bold ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                              ₹{item.cost.toLocaleString()}
                            </span>
                            {index === 0 && (
                              <Badge className="ml-2 bg-green-600 text-white">
                                Most Affordable
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                        <p className={`text-xs mt-1 ${isHighContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.percentage === 0.1 ? '99.9% more affordable' : `${(item.cost / 500).toFixed(0)}x more expensive`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`${isHighContrast ? 'bg-gray-800 border-gray-600' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`text-2xl ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                  💡 Economic Impact Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className={`p-4 rounded-lg ${isHighContrast ? 'bg-blue-900' : 'bg-blue-50'}`}>
                    <h4 className={`font-semibold mb-3 ${isHighContrast ? 'text-blue-400' : 'text-blue-800'}`}>
                      Individual Savings
                    </h4>
                    <ul className={`space-y-2 ${isHighContrast ? 'text-gray-300' : 'text-blue-700'}`}>
                      <li>• Save ₹49,500+ vs smart canes</li>
                      <li>• Save ₹199,500+ vs OrCam devices</li>
                      <li>• Save ₹399,500+ vs Glidance systems</li>
                      <li>• No subscription or maintenance fees</li>
                      <li>• Works with existing smartphone</li>
                    </ul>
                  </div>

                  <div className={`p-4 rounded-lg ${isHighContrast ? 'bg-purple-900' : 'bg-purple-50'}`}>
                    <h4 className={`font-semibold mb-3 ${isHighContrast ? 'text-purple-400' : 'text-purple-800'}`}>
                      Societal Benefits
                    </h4>
                    <ul className={`space-y-2 ${isHighContrast ? 'text-gray-300' : 'text-purple-700'}`}>
                      <li>• Reduces healthcare costs from injuries</li>
                      <li>• Increases employment opportunities</li>
                      <li>• Decreases dependency on caregivers</li>
                      <li>• Improves quality of life metrics</li>
                      <li>• Enables educational access</li>
                    </ul>
                  </div>
                </div>

                <div className={`mt-6 p-4 rounded-lg ${isHighContrast ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
                  <h4 className={`text-lg font-semibold mb-2 ${isHighContrast ? 'text-white' : 'text-gray-900'}`}>
                    Return on Investment
                  </h4>
                  <p className={`text-sm ${isHighContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                    ARGUS Glass pays for itself within the first month of use through increased independence, 
                    reduced transportation costs, and improved safety outcomes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Call to Action */}
        <Card className={`${isHighContrast ? 'bg-indigo-900 border-indigo-700' : 'bg-indigo-50 border-indigo-200'} border-2 mt-12`}>
          <CardHeader>
            <CardTitle className={`text-2xl text-center ${isHighContrast ? 'text-indigo-300' : 'text-indigo-800'}`}>
              🚀 Join the Accessibility Revolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className={`text-lg ${isHighContrast ? 'text-gray-300' : 'text-indigo-700'}`}>
                Every person deserves the freedom to navigate independently and access information freely. 
                ARGUS Glass makes this vision a reality with affordable, AI-powered technology.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <Link href="/navigate">
                  <Button size="lg" className="w-full h-16 bg-indigo-600 hover:bg-indigo-700">
                    🧭 Try Navigation
                    <br />
                    <span className="text-sm opacity-90">Experience AI guidance</span>
                  </Button>
                </Link>
                <Link href="/read-text">
                  <Button size="lg" className="w-full h-16 bg-green-600 hover:bg-green-700">
                    📖 Try Text Reading
                    <br />
                    <span className="text-sm opacity-90">Test OCR capabilities</span>
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline"
                  className={`w-full h-16 font-bold ${isHighContrast ? 'border-indigo-600 text-indigo-300 hover:bg-indigo-800' : 'border-indigo-300 text-indigo-800 hover:bg-indigo-100'}`}
                  onClick={() => speak('Thank you for your interest in ARGUS Glass. Together, we can make assistive technology accessible to everyone.')}
                >
                  💙 Support Our Mission
                  <br />
                  <span className="text-sm opacity-90">Spread awareness</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}