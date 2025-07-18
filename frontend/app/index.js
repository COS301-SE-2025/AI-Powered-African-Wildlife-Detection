// index.js (Login/Authentication Screen)
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';


const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(true);
  
  const navigation = useNavigation();

  const handleAuthAction = () => {
    if (isRegistering) {
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      // Handle registration logic
      console.log('Registering:', { username, email, password });
      // For now, proceed with any credentials
      navigation.navigate('MainScreen', { username });
    } else {
      // Handle login logic
      console.log('Logging in:', { username, password, rememberMe });
      // For now, proceed with any credentials
      navigation.navigate('MainScreen', { username });
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/nature-background.mp4')}
        rate={1.0}
        volume={0}
        isMuted
        resizeMode="cover"
        shouldPlay
        isLooping
        style={styles.video}
      />
      
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.3)']}
        style={styles.gradient}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <View style={styles.authForm}>
          {/* Updated Title Section with Larger Logos */}
          <View style={styles.titleContainer}>
            <Image 
              source={require('../assets/EpiUseLogo.jpg')} 
              style={styles.logoImage} 
              resizeMode="contain"
            />
            <Text style={styles.authTitle}>{isRegistering ? 'Register' : 'Login'}</Text>
            <Image 
              source={require('../assets/BushBuddy.webp')} 
              style={styles.logoImage} 
              resizeMode="contain"
            />
          </View>

          {isRegistering && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <MaterialIcons name="email" size={20} color="white" style={styles.inputIcon} />
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <MaterialIcons name="person" size={20} color="white" style={styles.inputIcon} />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.7)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <MaterialIcons name="lock" size={20} color="white" style={styles.inputIcon} />
          </View>

          {isRegistering && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <MaterialIcons name="lock-outline" size={20} color="white" style={styles.inputIcon} />
            </View>
          )}

          <View style={styles.optionsRow}>
            {!isRegistering && (
              <>
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View style={styles.checkbox}>
                    {rememberMe && <View style={styles.checkboxInner} />}
                  </View>
                  <Text style={styles.checkboxLabel}>Remember me</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <TouchableOpacity 
            style={styles.authButton}
            onPress={handleAuthAction}
          >
            <Text style={styles.authButtonText}>
              {isRegistering ? 'Register' : 'Login'}
            </Text>
          </TouchableOpacity>

          <View style={styles.switchAuthContainer}>
            <Text style={styles.switchAuthText}>
              {isRegistering ? 'Already have an account? ' : 'Need an account? '}
            </Text>
            <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
              <Text style={styles.switchAuthLink}>
                {isRegistering ? 'Login' : 'Register'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={showModal}
          animationType="fade"
          transparent={false}
        >
          
        <View style={styles.modalContainer}>
          <ScrollView>
          <Text style={styles.modalTitle}>Welcome to Bush Buddy!</Text>

          <Image style={styles.modalImage} source={require("../assets/BushBuddy.webp")}></Image>

          <Text style={styles.modalTitle}>What is BushBuddy?</Text>
          <Text style={styles.modalText}>BushBuddy is an AI-powered African Wildlife Detection System</Text>

          <Text style={styles.modalTitle}>Vision</Text>
          <Text style={styles.modalText}>Our vision is an intuitive application for users to reliably identify African wild animals using an AI-powered image detection system</Text>

          <Text style={styles.modalTitle}>Mission</Text>
          <Text style={styles.modalText}>Our mission is for our platform to promote awareness, education and appreciation for South African wildlife. We seek to cultivate a community of users who are inspired to explore local nature reserves and contribute to conservation efforts</Text>


          <Text style={styles.modalTitle}>Contact Us</Text>
          <Text style={styles.modalLink} onPress={() => Linking.openURL('mailto:g24capstone@gmail.com')}>
            g24capstone@gmail.com
          </Text>

          <Text style={styles.modalTitle}>View our GitHub!</Text>
          <Text style={styles.modalLink} onPress={() => Linking.openURL('https://github.com/COS301-SE-2025/AI-Powered-African-Wildlife-Detection')}>
            AI-Powered-African-Wildlife-Detection
          </Text>

            </ScrollView>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setShowModal(false)}
          >
            <Text style={styles.modalButtonText}>Log In / Register</Text>
          </TouchableOpacity>
          
        </View>
        

      </Modal>
      
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  authForm: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'center',
  },
  logoImage: {
    width: 60,
    height: 60,
    marginHorizontal: 12,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    height: '100%',
    color: 'white',
    paddingRight: 10,
  },
  inputIcon: {
    marginLeft: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  checkboxLabel: {
    color: 'white',
    fontSize: 14,
  },
  forgotPasswordText: {
    color: 'white',
    fontSize: 14,
  },
  authButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  authButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchAuthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchAuthText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  switchAuthLink: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#395936',
  padding: 20,
},

modalTitle: {
  fontSize: 28,
  color: '#fff',
  marginBottom: 5,
  textAlign: 'center',
  marginTop: 40
},

modalButton: {
  backgroundColor: '#ff6b00',
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 25,
  marginBottom: 20,
  marginTop: 20
},

modalButtonText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
},

modalText: {
  fontSize: 18,
  color: '#fff',
  marginBottom: 5,
},
modalImage: {
  margin: "auto"
},
modalLink: {
  fontSize: 18,
  color: '#0000ff',
  marginBottom: 5,
  textDecorationLine: 'underline',
  textAlign: 'center',
},

});