'use client';

import { useState, useRef, useCallback } from 'react';

interface CameraState {
  isActive: boolean;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
}

interface CameraCapabilities {
  video: boolean;
  audio: boolean;
  facingMode?: 'user' | 'environment';
}

export function useCamera() {
  const [state, setState] = useState<CameraState>({
    isActive: false,
    isLoading: false,
    error: null,
    hasPermission: false
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check camera permissions
  const checkPermissions = useCallback(async (): Promise<boolean> => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setState(prev => ({ ...prev, error: 'Camera not supported on this device' }));
        return false;
      }

      // Check if we already have permission
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        if (permission.state === 'granted') {
          setState(prev => ({ ...prev, hasPermission: true }));
          return true;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking camera permissions:', error);
      setState(prev => ({ ...prev, error: 'Unable to check camera permissions' }));
      return false;
    }
  }, []);

  // Start camera with optimal settings for accessibility
  const startCamera = useCallback(async (capabilities: CameraCapabilities = { video: true, audio: false }): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const hasPermission = await checkPermissions();
      if (!hasPermission) return false;

      // Request camera with back camera preference for better object detection
      const constraints: MediaStreamConstraints = {
        video: capabilities.video ? {
          facingMode: capabilities.facingMode || 'environment', // Back camera for navigation
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 15 }
        } : false,
        audio: capabilities.audio || false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setState(prev => ({
        ...prev,
        isActive: true,
        isLoading: false,
        hasPermission: true,
        error: null
      }));

      return true;
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      
      let errorMessage = 'Unable to access camera';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access in your browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      }

      setState(prev => ({
        ...prev,
        isActive: false,
        isLoading: false,
        error: errorMessage
      }));

      return false;
    }
  }, [checkPermissions]);

  // Stop camera and cleanup
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setState(prev => ({
      ...prev,
      isActive: false,
      isLoading: false,
      error: null
    }));
  }, []);

  // Capture current frame as image
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current || !state.isActive) {
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 image
    return canvas.toDataURL('image/jpeg', 0.8);
  }, [state.isActive]);

  // Switch between front/back camera
  const switchCamera = useCallback(async () => {
    if (!state.isActive) return false;

    const currentFacingMode = streamRef.current?.getVideoTracks()[0]?.getSettings()?.facingMode;
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';

    stopCamera();
    return await startCamera({ video: true, facingMode: newFacingMode });
  }, [state.isActive, stopCamera, startCamera]);

  // Get camera capabilities
  const getCameraCapabilities = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      return {
        hasMultipleCameras: videoDevices.length > 1,
        cameras: videoDevices.map(device => ({
          id: device.deviceId,
          label: device.label || `Camera ${device.deviceId.slice(0, 8)}`
        }))
      };
    } catch (error) {
      console.error('Error getting camera capabilities:', error);
      return { hasMultipleCameras: false, cameras: [] };
    }
  }, []);

  return {
    // State
    ...state,
    
    // Refs for video and canvas elements
    videoRef,
    canvasRef,
    
    // Methods
    startCamera,
    stopCamera,
    captureFrame,
    switchCamera,
    checkPermissions,
    getCameraCapabilities
  };
}