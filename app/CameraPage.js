import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useRef, useState } from 'react';
import { Alert, Animated, Button, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CameraPage = () => {
  const navigation = useNavigation();
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [activeTab, setActiveTab] = useState('camera');
  const [lastPhoto, setLastPhoto] = useState(null);
  const [lastPhotoDetections, setLastPhotoDetections] = useState(null);
  const [photoDimensions, setPhotoDimensions] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [flashMode, setFlashMode] = useState('auto');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const cameraRef = useRef(null);
  const flashAnimation = useRef(new Animated.Value(0)).current;

  // Make sure this matches your server IP (Run ipconfig in CMD to find your local IP)
  const API_URL = 'http://192.168.1.101:5000';

  // Define bounding box colors (matching your Python script)
  const bbox_colors = [
    '#A47857', '#4494E4', '#5D61D1', '#B2B685', '#589F6A', 
    '#60CAE7', '#9F7CA8', '#A9A2F1', '#627696', '#ACB0B8'
  ];

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const toggleFlashMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFlashMode(current => {
      switch (current) {
        case 'auto':
          return 'on';
        case 'on':
          return 'off';
        case 'off':
          return 'auto';
        default:
          return 'auto';
      }
    });
  };

  const getFlashIcon = () => {
    switch (flashMode) {
      case 'on':
        return 'flash-on';
      case 'off':
        return 'flash-off';
      case 'auto':
      default:
        return 'flash-auto';
    }
  };

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Flash animation
        Animated.sequence([
          Animated.timing(flashAnimation, {
            toValue: 1,
            duration: 100,
            useNativeDriver: false,
          }),
          Animated.timing(flashAnimation, {
            toValue: 0,
            duration: 150,
            useNativeDriver: false,
          }),
        ]).start();

        console.log('Taking picture...');
        
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
          exif: false,
          flash: flashMode,
          format: 'jpeg',
        });

        console.log('Photo taken, URI:', photo.uri);
        setLastPhoto(photo.uri);
        
        // Store photo dimensions for bounding box scaling
        Image.getSize(photo.uri, (width, height) => {
          setPhotoDimensions({ width, height });
        });

        // Validate base64 data
        if (!photo.base64) {
          Alert.alert('Error', 'Failed to encode image');
          return;
        }

        console.log('Base64 data length:', photo.base64.length);
        console.log('Sending to API...');

        // Test API connection first
        try {
          const healthResponse = await fetch(`${API_URL}/health`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (!healthResponse.ok) {
            throw new Error(`Health check failed: ${healthResponse.status}`);
          }
          
          const healthData = await healthResponse.json();
          console.log('Health check:', healthData);
          
          if (!healthData.success || !healthData.model_loaded) {
            Alert.alert('Error', 'AI model not loaded on server');
            return;
          }
          
        } catch (healthError) {
          console.error('Health check failed:', healthError);
          Alert.alert('Connection Error', 'Cannot connect to AI server. Please check if the server is running.');
          return;
        }

        // Send image to Flask API
        const requestBody = {
          image: photo.base64
        };

        const response = await fetch(`${API_URL}/detect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        console.log('API response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error response:', errorText);
          throw new Error(`API request failed: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('Detection result:', result);

        // Handle API response
        if (!result.success || result.error) {
          Alert.alert('Detection Error', result.error || 'Unknown error occurred');
          return;
        }

        // Store detections for drawing bounding boxes
        setLastPhotoDetections(result.detections || []);

        // Display results
        if (result.count > 0) {
          const detectionText = result.detections
            .map(d => `${d.class} (${(d.confidence * 100).toFixed(1)}%)`)
            .join('\n');
          
          Alert.alert(
            'Wildlife Detected! 🦁',
            `Found ${result.count} animal(s):\n\n${detectionText}`,
            [{ text: 'OK', style: 'default' }]
          );
        } else {
          Alert.alert(
            'No Wildlife Detected',
            'No animals were detected in this image. Try getting closer or ensuring good lighting.',
            [{ text: 'OK', style: 'default' }]
          );
        }

      } catch (error) {
        console.error('Error during detection:', error);
        
        // Provide specific error messages
        let errorMessage = 'Detection failed. ';
        if (error.message.includes('Network request failed')) {
          errorMessage += 'Please check your internet connection and ensure the AI server is running.';
        } else if (error.message.includes('timeout')) {
          errorMessage += 'The request took too long. Please try again.';
        } else if (error.message.includes('JSON')) {
          errorMessage += 'Invalid response from server.';
        } else {
          errorMessage += error.message || 'Unknown error occurred.';
        }
        
        Alert.alert('Error', errorMessage);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  // NEW: Render bounding boxes using View components instead of SVG
  const renderBoundingBoxes = () => {
    if (!lastPhotoDetections || !photoDimensions) return null;

    // TODO: Add scaling calculations and box rendering
    console.log('Rendering bounding boxes:', lastPhotoDetections.length);
    
    return null; // Placeholder for now
  };

  // Test API connection function
  const testAPIConnection = async () => {
    try {
      const response = await fetch(`${API_URL}/test`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        Alert.alert('API Test', `Connection successful: ${data.message}`);
      } else {
        Alert.alert('API Test Failed', 'Server responded but with error');
      }
    } catch (error) {
      Alert.alert('API Test Failed', `Cannot connect to server: ${error.message}`);
    }
  };

  // Navigation handlers
  const handleNavigation = (screen, tab) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(screen);
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={testAPIConnection}>
          <MaterialIcons name="wifi" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Buddy Scanner</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Camera View */}
      <CameraView 
        style={styles.camera} 
        facing={facing} 
        ref={cameraRef}
        flash={flashMode}
      >
        <View style={styles.cameraOverlay}>
          {/* Flash Overlay */}
          <Animated.View 
            style={[
              styles.flashOverlay,
              {
                opacity: flashAnimation,
              }
            ]} 
            pointerEvents="none"
          />

          {/* Top Controls */}
          <View style={styles.topControls}>
            <TouchableOpacity 
              style={[styles.flashButton, { marginRight: 10 }]} 
              onPress={toggleFlashMode}
            >
              <MaterialIcons name={getFlashIcon()} size={24} color="white" />
              <Text style={styles.flashModeText}>
                {flashMode.charAt(0).toUpperCase() + flashMode.slice(1)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <MaterialIcons name="flip-camera-ios" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Bottom Controls */}
          <View style={styles.cameraControls}>
            <View style={styles.captureContainer}>
              {/* Last Photo Thumbnail */}
              <TouchableOpacity 
                style={styles.thumbnailContainer}
                onPress={() => {
                  if (lastPhoto) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowPhotoModal(true);
                  }
                }}
              >
                {lastPhoto ? (
                  <Image source={{ uri: lastPhoto }} style={styles.thumbnail} />
                ) : (
                  <View style={styles.emptyThumbnail}>
                    <MaterialIcons name="photo" size={20} color="#666" />
                  </View>
                )}
              </TouchableOpacity>

              {/* Capture Button */}
              <TouchableOpacity 
                style={[
                  styles.captureButton,
                  isCapturing && styles.captureButtonPressed
                ]} 
                onPress={takePicture}
                disabled={isCapturing}
              >
                <View style={[
                  styles.captureButtonInner,
                  isCapturing && styles.captureButtonInnerPressed
                ]}>
                  {isCapturing && (
                    <MaterialIcons name="hourglass-empty" size={24} color="#666" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Placeholder for right side balance */}
              <View style={styles.thumbnailContainer} />
            </View>
          </View>
        </View>
      </CameraView>

      {/* Photo Preview Modal */}
      <Modal
        visible={showPhotoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowPhotoModal(false)}
          >
            <View style={styles.photoContainer}>
              {lastPhoto && (
                <Image 
                  source={{ uri: lastPhoto }} 
                  style={styles.fullScreenPhoto}
                  resizeMode="contain"
                />
              )}
              
              {/* Close button */}
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowPhotoModal(false);
                }}
              >
                <MaterialIcons name="close" size={30} color="white" />
              </TouchableOpacity>

              {/* Action buttons */}
              <View style={styles.photoActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('Save', 'Photo would be saved to gallery');
                    setShowPhotoModal(false);
                  }}
                >
                  <MaterialIcons name="save-alt" size={24} color="white" />
                  <Text style={styles.actionText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('Share', 'Photo would be shared');
                    setShowPhotoModal(false);
                  }}
                >
                  <MaterialIcons name="share" size={24} color="white" />
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    Alert.alert(
                      'Delete Photo',
                      'Are you sure you want to delete this photo?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Delete', 
                          style: 'destructive',
                          onPress: () => {
                            setLastPhoto(null);
                            setLastPhotoDetections(null);
                            setPhotoDimensions(null);
                            setShowPhotoModal(false);
                          }
                        }
                      ]
                    );
                  }}
                >
                  <MaterialIcons name="delete" size={24} color="white" />
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'home' && styles.activeNavItem]} 
          onPress={() => handleNavigation('MainScreen', 'home')} 
        >
          <MaterialIcons name="home" size={24} color={activeTab === 'home' ? 'white' : '#A0A0A0'} />
          <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'map' && styles.activeNavItem]} 
          onPress={() => handleNavigation('MapScreen', 'map')}
        >
          <MaterialIcons name="map" size={24} color={activeTab === 'map' ? 'white' : '#A0A0A0'} />
          <Text style={[styles.navText, activeTab === 'map' && styles.activeNavText]}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.addButton, styles.activeNavItem]}
          onPress={() => alert('Camera functionality')}
        >
          <MaterialIcons name="camera-alt" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'reports' && styles.activeNavItem]} 
          onPress={() => handleNavigation('FeedScreen', 'reports')}
        >
          <MaterialIcons name="bar-chart" size={24} color={activeTab === 'reports' ? 'white' : '#A0A0A0'} />
          <Text style={[styles.navText, activeTab === 'reports' && styles.activeNavText]}>Feed</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'profile' && styles.activeNavItem]} 
          onPress={() => handleNavigation('ProfileScreen', 'profile')}
        >
          <MaterialIcons name="person" size={24} color={activeTab === 'profile' ? 'white' : '#A0A0A0'} />
          <Text style={[styles.navText, activeTab === 'profile' && styles.activeNavText]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 10,
  },
  topControls: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  flashModeText: {
    color: 'white',
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
  },
  thumbnailContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  emptyThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 4,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.1s ease',
  },
  captureButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  captureButtonInnerPressed: {
    backgroundColor: '#f0f0f0',
    transform: [{ scale: 0.9 }],
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenPhoto: {
    width: width,
    height: height * 0.8,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  photoActions: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.8,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 25,
    padding: 15,
    minWidth: 70,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#1a1a1a',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  
  // Bottom Navigation styles
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeNavItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  navText: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 4,
  },
  activeNavText: {
    color: 'white',
  },
  addButton: {
    backgroundColor: '#ff6b00',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default CameraPage;