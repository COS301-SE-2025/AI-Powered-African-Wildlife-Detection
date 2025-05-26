import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal
} from 'react-native';
// Saving this for future Jean
/*"plugins": [
  [
    "react-native-maps",
    {
      "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
    }
  ]
]*/
const { width, height } = Dimensions.get('window');

const MapScreen = ({ route }) => {
  const navigation = useNavigation();
  const params = route?.params || {};
  const username = params.username || 'User';

  const [activeTab, setActiveTab] = useState('map');
  const [selectedScale, setSelectedScale] = useState('10km');
  const [showScaleDropdown, setShowScaleDropdown] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Animation values
  const detailsAnimation = useRef(new Animated.Value(0)).current;

  // Scale options
  const scaleOptions = ['1km', '5km', '10km', '25km', '50km'];

  // Sample map markers data
  // Will replace later
  const mapMarkers = [
    {
      id: '1',
      type: 'elephant_group',
      species: 'African Bush Elephant',
      latitude: -1.2921,
      longitude: 36.8219,
      count: 3,
      timestamp: '2h ago',
      description: 'Small herd grazing near water source',
      conservation: 'Vulnerable',
      color: '#4CAF50',
      position: { left: '25%', top: '35%' }
    },
    {
      id: '2',
      type: 'elephant_group',
      species: 'African Bush Elephant',
      latitude: -1.3011,
      longitude: 36.8565,
      count: 4,
      timestamp: '4h ago',
      description: 'Herd moving toward eastern plains',
      conservation: 'Vulnerable',
      color: '#4CAF50',
      position: { left: '30%', top: '50%' }
    },
    {
      id: '3',
      type: 'elephant_group',
      species: 'African Bush Elephant',
      latitude: -1.2741,
      longitude: 36.8243,
      count: 2,
      timestamp: '6h ago',
      description: 'Mother and juvenile spotted',
      conservation: 'Vulnerable',
      color: '#4CAF50',
      position: { left: '35%', top: '65%' }
    },
    {
      id: '4',
      type: 'warning',
      category: 'Alert Zone',
      latitude: -1.2851,
      longitude: 36.8300,
      timestamp: '1h ago',
      description: 'Increased human activity detected',
      urgency: 'Medium',
      color: '#FF5722',
      position: { left: '40%', top: '40%' }
    },
    {
      id: '5',
      type: 'camera',
      category: 'Camera Station',
      latitude: -1.2881,
      longitude: 36.8419,
      timestamp: 'Active',
      description: 'Wildlife monitoring station',
      status: 'Online',
      color: '#2196F3',
      position: { left: '65%', top: '30%' }
    }
  ];

  // Handle showing/hiding animal details
  useEffect(() => {
    if (showDetails) {
      Animated.timing(detailsAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(detailsAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [showDetails]);

  // Focus on marker
  const focusMarker = (marker) => {
    setSelectedAnimal(marker);
    setShowDetails(true);
  };

  // Navigation handlers
  const handleNavigation = (screen, tab) => {
    navigation.navigate(screen);
    setActiveTab(tab);
  };

  // Get the right icon for marker
  const getMarkerIcon = (type) => {
    switch (type) {
      case 'elephant_group': return 'elephant';
      case 'lion': return 'cat';
      case 'rhino': return 'rhino';
      case 'giraffe': return 'giraffe';
      case 'warning': return 'alert-circle';
      case 'camera': return 'camera';
      default: return 'paw';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#4c8c4a', '#1e3b1d']}
        style={styles.gradientContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../assets/EpiUseLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Wildlife Map</Text>
          </View>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowInfoModal(true)}
          >
            <MaterialIcons name="info-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Scale Selector */}
        <View style={styles.scaleContainer}>
          <TouchableOpacity
            style={styles.scaleSelector}
            onPress={() => setShowScaleDropdown(!showScaleDropdown)}
          >
            <Text style={styles.scaleText}>{selectedScale}</Text>
            <MaterialIcons
              name={showScaleDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={20}
              color="white"
            />
          </TouchableOpacity>

          {showScaleDropdown && (
            <View style={styles.scaleDropdown}>
              {scaleOptions.map((scale) => (
                <TouchableOpacity
                  key={scale}
                  style={styles.scaleOption}
                  onPress={() => {
                    setSelectedScale(scale);
                    setShowScaleDropdown(false);
                  }}
                >
                  <Text style={[
                    styles.scaleOptionText,
                    selectedScale === scale && styles.selectedScaleText
                  ]}>
                    {scale}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Map Container with Image */}
        <View style={styles.mapContainer}>
          {/* Map Demo Image */}
          <Image
            source={require('../assets/Map-Demo.jpg')}// For now just use this static image
            style={styles.mapImage}
            resizeMode="cover"
          />

          {/* Map Markers Overlay */}
          {mapMarkers.map((marker) => (
            <TouchableOpacity
              key={marker.id}
              style={[
                styles.mapMarker,
                {
                  left: marker.position.left,
                  top: marker.position.top,
                }
              ]}
              onPress={() => focusMarker(marker)}
            >
              {marker.type === 'elephant_group' ? (
                <View style={styles.elephantMarker}>
                  <MaterialCommunityIcons name="elephant" size={16} color="white" />
                  <Text style={styles.markerCount}>{marker.count}</Text>
                </View>
              ) : marker.type === 'warning' ? (
                <View style={[styles.alertMarker, { backgroundColor: marker.color }]}>
                  <MaterialIcons name="warning" size={16} color="white" />
                </View>
              ) : (
                <View style={[styles.cameraMarker, { backgroundColor: marker.color }]}>
                  <MaterialIcons name="camera-alt" size={16} color="white" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Animal Detail Panel */}
        {selectedAnimal && (
          <Animated.View style={[
            styles.animalDetailPanel,
            {
              transform: [
                {
                  translateY: detailsAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0]
                  })
                }
              ],
              opacity: detailsAnimation
            }
          ]}>
            <View style={styles.detailHandle}>
              <TouchableOpacity onPress={() => setShowDetails(!showDetails)}>
                <View style={styles.handleBar} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.detailContent}>
              <View style={styles.detailHeader}>
                <MaterialCommunityIcons
                  name={getMarkerIcon(selectedAnimal.type)}
                  size={24}
                  color={selectedAnimal.color}
                />
                <View style={styles.detailHeaderText}>
                  <Text style={styles.detailTitle}>
                    {selectedAnimal.type !== 'warning'
                      ? `${selectedAnimal.species || selectedAnimal.category} ${selectedAnimal.count ? `(${selectedAnimal.count})` : ''}`
                      : selectedAnimal.category}
                  </Text>
                  <Text style={styles.detailSubtitle}>
                    {selectedAnimal.timestamp} • {selectedAnimal.conservation || selectedAnimal.status || selectedAnimal.urgency}
                  </Text>
                </View>
              </View>

              <Text style={styles.detailDescription}>
                {selectedAnimal.description}
              </Text>

              <TouchableOpacity style={[styles.actionButton, { backgroundColor: selectedAnimal.color }]}>
                <Text style={styles.actionButtonText}>
                  {selectedAnimal.type === 'warning' ? 'View Alert Details' : 'Track Activity'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        )}

        {/* Info Modal */}
        <Modal
          visible={showInfoModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowInfoModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Map Information</Text>
                <TouchableOpacity onPress={() => setShowInfoModal(false)}>
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalText}>
                This interactive map shows real-time wildlife tracking data from the Maasai Mara ecosystem.
              </Text>
              <Text style={styles.modalText}>
                • Green markers: Elephant herds{'\n'}
                • Red markers: Alert zones{'\n'}
                • Blue markers: Camera stations
              </Text>
              <Text style={styles.modalText}>
                Tap on any marker to view detailed information about wildlife activity in that area.
              </Text>
            </View>
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
            style={styles.addButton}
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
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3b1d',
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 42,
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 8,
  },
  scaleContainer: {
    position: 'absolute',
    top: 130,
    left: 20,
    zIndex: 10,
  },
  scaleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  scaleText: {
    fontSize: 14,
    color: 'white',
    marginRight: 4,
    fontWeight: '500',
  },
  scaleDropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(30, 59, 29, 0.95)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  scaleOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  scaleOptionText: {
    fontSize: 14,
    color: 'white',
  },
  selectedScaleText: {
    color: '#ff6b00',
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    margin: 20,
    marginTop: 60,
    borderRadius: 15,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  mapMarker: {
    position: 'absolute',
    zIndex: 5,
  },
  elephantMarker: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  alertMarker: {
    borderRadius: 15,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cameraMarker: {
    borderRadius: 15,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  animalDetailPanel: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(30, 59, 29, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 5,
    elevation: 10,
    zIndex: 100,
  },
  detailHandle: {
    width: '100%',
    alignItems: 'center',
    padding: 10,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 2,
  },
  detailContent: {
    padding: 20,
    paddingTop: 0,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailHeaderText: {
    marginLeft: 10,
    flex: 1,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  detailSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  detailDescription: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
    marginBottom: 20,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    maxWidth: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  activeNavItem: {
    // Add any active state styling if needed
  },
  navText: {
    color: '#A0A0A0',
    fontSize: 12,
    marginTop: 2,
  },
  activeNavText: {
    color: 'white',
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff6b00',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    elevation: 5,
  },
});

export default MapScreen;