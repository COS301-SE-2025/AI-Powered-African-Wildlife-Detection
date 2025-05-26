import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const FeedScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Friends');
  const [selectedPost, setSelectedPost] = useState(null);
  const [postDetailVisible, setPostDetailVisible] = useState(false);

  // Sample data for social wildlife feed
  const feedEntries = [
    { 
      id: '1',
      type: 'elephant',
      title: 'Elephant Bull Spotted',
      user: 'Ruan',
      userAvatar: require('../assets/Jean-Steyn-ProfilePic.jpg'), // Placeholder holder fix later Jean
      location: 'Kruger National Park',
      timestamp: '21/05/2025 8:45',
      image: require('../assets/Elephant.jpg'),
      mapImage: require('../assets/Map-Demo.jpg'), // Map view demo image.The same image is used for all entries because of the demo
      description: 'I spotted this large Elephant bull near Bateleur road this morning while on a game drive',
      likes: 24,
      comments: 8,
      isLiked: false
    },
    { 
      id: '2',
      type: 'lion',
      title: 'Pride of Lions',
      user: 'Ruben',
      userAvatar: require('../assets/Jean-Steyn-ProfilePic.jpg'), // Placeholder holder fix later Jean
      location: 'Mabula Nature Reserve',
      timestamp: '20/05/2025 17:45',
      image: require('../assets/Pride-Lions-Demo.jpg'),
      mapImage: require('../assets/Map-Demo.jpg'), // Map view demo image.The same image is used for all entries because of the demo
      description: 'Amazing pride of lions spotted resting under acacia trees. The cubs were playing while the adults kept watch.',
      likes: 18,
      comments: 5,
      isLiked: true
    },
    { 
      id: '3',
      type: 'rhino',
      title: 'White Rhinos Spotted',
      user: 'Raffie',
      userAvatar: require('../assets/Jean-Steyn-ProfilePic.jpg'), // Placeholder holder fix later Jean
      location: 'Dinokeng',
      timestamp: '21/05/2025 8:45',
      image: require('../assets/rhino-group.jpg'),
      mapImage: require('../assets/Map-Demo.jpg'), // Map view demo image.The same image is used for all entries because of the demo
      description: 'Two magnificent white rhinos grazing peacefully in the early morning light. Such incredible creatures!',
      likes: 31,
      comments: 12,
      isLiked: false
    },
    { 
      id: '4',
      type: 'antelope',
      title: 'Eland Spotted',
      user: 'Tom',
      userAvatar: require('../assets/Jean-Steyn-ProfilePic.jpg'), // Placeholder holder fix later Jean
      location: 'Rietvlei Nature Reserve',
      timestamp: '21/05/2025 8:45',
      image: require('../assets/Eland.jpg'),
      mapImage: require('../assets/Map-Demo.jpg'), // Map view demo image.The same image is used for all entries because of the demo
      description: 'Beautiful herd of eland antelope spotted during sunset. They were so graceful moving across the grassland.',
      likes: 15,
      comments: 3,
      isLiked: false
    },
  ];

  // Filter options
  const filterOptions = ['Friends', 'Following', 'Nearby', 'Popular'];

  // Animal type icons for the top filter bar
  const animalFilters = [
    { type: 'all', icon: 'pets', color: '#FF6B35' },
    { type: 'elephant', icon: 'pets', color: '#4CAF50' },
    { type: 'lion', icon: 'warning', color: '#FF9800' },
    { type: 'rhino', icon: 'track-changes', color: '#2196F3' },
    { type: 'antelope', icon: 'nature', color: '#9C27B0' },
    { type: 'bird', icon: 'flight', color: '#00BCD4' }
  ];

  const [selectedAnimalFilter, setSelectedAnimalFilter] = useState('all');

  // Filter entries based on search and filters
  // Add more demo data later future Jean
  const filteredEntries = feedEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        entry.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        entry.user.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedAnimalFilter === 'all') {
      return matchesSearch;
    } else {
      return entry.type === selectedAnimalFilter && matchesSearch;
    }
  });

  const toggleLike = (entryId) => {
    // This would make an API call
    console.log('Toggle like for entry:', entryId);
  };

  const renderFeedItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.feedCard}
      onPress={() => {
        setSelectedPost(item);
        setPostDetailVisible(true);
      }}
    >
      {/* User Header */}
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <View style={[
            styles.animalTypeIcon,
            { backgroundColor: 
              item.type === 'elephant' ? '#4CAF50' :
              item.type === 'lion' ? '#FF9800' :
              item.type === 'rhino' ? '#2196F3' :
              '#9C27B0'
            }
          ]}>
            <MaterialIcons 
              name={
                item.type === 'elephant' ? 'pets' :
                item.type === 'lion' ? 'warning' :
                item.type === 'rhino' ? 'track-changes' :
                'nature'
              } 
              size={20} 
              color="white" 
            />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.animalTitle}>{item.title}</Text>
            <Text style={styles.userName}>{item.user}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MaterialIcons name="more-vert" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Location and Time */}
      <View style={styles.locationInfo}>
        <MaterialIcons name="location-on" size={16} color="#FF6B35" />
        <Text style={styles.locationText}>{item.location}</Text>
        <Text style={styles.timestampText}>{item.timestamp}</Text>
      </View>

      {/* Image */}
      <Image source={item.image} style={styles.feedImage} />

      {/* Actions */}
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => toggleLike(item.id)}
        >
          <MaterialIcons 
            name={item.isLiked ? "favorite" : "favorite-border"} 
            size={24} 
            color={item.isLiked ? "#FF6B35" : "#666"} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="chat-bubble-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="share" size={24} color="#666" />
        </TouchableOpacity>
        <View style={styles.spacer} />
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="bookmark-border" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Like and comment counts */}
      <View style={styles.engagementInfo}>
        <Text style={styles.likesText}>{item.likes} likes</Text>
        {item.comments > 0 && (
          <Text style={styles.commentsText}>View all {item.comments} comments</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  // Detailed Post Modal
  const renderPostDetailModal = () => {
    if (!selectedPost) return null;
    
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={postDetailVisible}
        onRequestClose={() => setPostDetailVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar style="dark" />
          
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setPostDetailVisible(false)}
            >
              <MaterialIcons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreOptionsButton}>
              <MaterialIcons name="more-horiz" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Animal Type Header */}
            <View style={styles.modalAnimalHeader}>
              <View style={[
                styles.modalAnimalIcon,
                { backgroundColor: 
                  selectedPost.type === 'elephant' ? '#4CAF50' :
                  selectedPost.type === 'lion' ? '#FF9800' :
                  selectedPost.type === 'rhino' ? '#2196F3' :
                  '#9C27B0'
                }
              ]}>
                <MaterialIcons 
                  name={
                    selectedPost.type === 'elephant' ? 'pets' :
                    selectedPost.type === 'lion' ? 'warning' :
                    selectedPost.type === 'rhino' ? 'track-changes' :
                    'nature'
                  } 
                  size={24} 
                  color="white" 
                />
              </View>
              <Text style={styles.modalAnimalTitle}>{selectedPost.title}</Text>
            </View>

            {/* Main Image */}
            <Image source={selectedPost.image} style={styles.modalMainImage} />

            {/* Map View */}
            <View style={styles.mapSection}>
              <Image source={selectedPost.mapImage} style={styles.modalMapImage} />
              <View style={styles.mapOverlay}>
                <MaterialIcons name="location-on" size={20} color="white" />
              </View>
            </View>

            {/* User Info Section */}
            <View style={styles.modalUserSection}>
              <View style={styles.modalUserInfo}>
                <View style={styles.modalUserAvatar}>
                  <Text style={styles.avatarText}>{selectedPost.user.charAt(0)}</Text>
                </View>
                <View style={styles.modalUserDetails}>
                  <Text style={styles.modalUserName}>{selectedPost.user}</Text>
                  <Text style={styles.modalTimestamp}>{selectedPost.timestamp}</Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionText}>{selectedPost.description}</Text>
            </View>

            {/* Action Bar */}
            <View style={styles.modalActionBar}>
              <TouchableOpacity 
                style={styles.modalActionButton}
                onPress={() => toggleLike(selectedPost.id)}
              >
                <MaterialIcons 
                  name={selectedPost.isLiked ? "favorite" : "favorite-border"} 
                  size={28} 
                  color={selectedPost.isLiked ? "#FF6B35" : "#666"} 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalActionButton}>
                <MaterialIcons name="chat-bubble-outline" size={28} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalActionButton}>
                <MaterialIcons name="share" size={28} color="#666" />
              </TouchableOpacity>
              <View style={styles.spacer} />
              <TouchableOpacity style={styles.modalActionButton}>
                <MaterialIcons name="bookmark-border" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Engagement Stats */}
            <View style={styles.modalEngagementInfo}>
              <Text style={styles.modalLikesText}>{selectedPost.likes} likes</Text>
              {selectedPost.comments > 0 && (
                <Text style={styles.modalCommentsText}>View all {selectedPost.comments} comments</Text>
              )}
            </View>

            {/* Bottom Padding for scroll */}
            <View style={styles.modalBottomPadding} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
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
          <Text style={styles.headerTitle}>Feed</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Image 
              source={require('../assets/Jean-Steyn-ProfilePic.jpg')} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color="rgba(255,255,255,0.7)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Sightings"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Filter Dropdown and Icons */}
        <View style={styles.filtersContainer}>
          {/* Dropdown Filter */}
          <TouchableOpacity style={styles.dropdownFilter}>
            <Text style={styles.dropdownText}>{selectedFilter}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color="white" />
          </TouchableOpacity>

          {/* Menu and Filter Icons */}
          <View style={styles.filterIcons}>
            <TouchableOpacity style={styles.filterIconButton}>
              <MaterialIcons name="menu" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterIconButton}>
              <MaterialIcons name="filter-list" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Animal Type Filter */}
        <View style={styles.animalFilterContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={animalFilters}
            keyExtractor={(item) => item.type}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.animalFilterButton,
                  selectedAnimalFilter === item.type && { backgroundColor: item.color }
                ]}
                onPress={() => setSelectedAnimalFilter(item.type)}
              >
                <MaterialIcons 
                  name={item.icon} 
                  size={24} 
                  color={selectedAnimalFilter === item.type ? "white" : item.color} 
                />
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Feed List */}
        <FlatList
          data={filteredEntries}
          renderItem={renderFeedItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.feedContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="photo-camera" size={60} color="rgba(255,255,255,0.3)" />
              <Text style={styles.emptyText}>No sightings found</Text>
              <Text style={styles.emptySubText}>Try adjusting your search or filters</Text>
            </View>
          )}
        />

        {/* Post Detail Modal */}
        {renderPostDetailModal()}

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('MainScreen')}
          >
            <MaterialIcons name="home" size={24} color="#A0A0A0" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('MapScreen')}
          >
            <MaterialIcons name="map" size={24} color="#A0A0A0" />
            <Text style={styles.navText}>Map</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('DetectionScreen')}
          >
            <MaterialIcons name="camera-alt" size={32} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navItem, styles.activeNavItem]}
            onPress={() => navigation.navigate('FeedScreen')}
          >
            <MaterialIcons name="article" size={24} color="#FF6B35" />
            <Text style={[styles.navText, styles.activeNavText]}>Feed</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            <MaterialIcons name="person" size={24} color="#A0A0A0" />
            <Text style={styles.navText}>Profile</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: 'cover',
  },
  profilePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ccc',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    padding: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  dropdownFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    gap: 5,
  },
  dropdownText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  filterIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  filterIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalFilterContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  animalFilterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  feedContainer: {
    paddingBottom: 20,
  },
  feedCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  animalTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  animalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  moreButton: {
    padding: 5,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
    gap: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  timestampText: {
    fontSize: 12,
    color: '#999',
  },
  feedImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  actionButton: {
    marginRight: 15,
  },
  spacer: {
    flex: 1,
  },
  engagementInfo: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  likesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  commentsText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginTop: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  activeNavItem: {
    // Will add later if needed future Jean
    // Active state styling
  },
  navText: {
    color: '#A0A0A0',
    fontSize: 12,
    marginTop: 2,
  },
  activeNavText: {
    color: '#FF6B35',
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff6b00',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  moreOptionsButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
  },
  modalAnimalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  modalAnimalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  modalAnimalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  modalMainImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  mapSection: {
    position: 'relative',
  },
  modalMapImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  mapOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalUserSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#4CAF50',
  },
  modalUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalUserDetails: {
    flex: 1,
  },
  modalUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  modalTimestamp: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  descriptionSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  modalActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  modalActionButton: {
    marginRight: 20,
  },
  modalEngagementInfo: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  modalLikesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  modalCommentsText: {
    fontSize: 16,
    color: '#666',
  },
  modalBottomPadding: {
    height: 50,
  },
});

export default FeedScreen;