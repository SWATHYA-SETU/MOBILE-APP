import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import RegisterScreen from './RegisterScreen';
import LoginScreen from './LoginScreen';

const Tab = createBottomTabNavigator();

const HomeContent = () => {
  return (
    <ScrollView style={styles.scrollView}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradientContainer}
      >
        <Text style={styles.headerText}>Welcome to Swasthya Setu</Text>
        <Text style={styles.subHeaderText}>Your Health Companion</Text>
      </LinearGradient>
      <View style={styles.contentContainer}>
        <Image
          source={require('../assets/city-health.png')}
          style={styles.image}
        />
        <Text style={styles.infoText}>
          Swasthya Setu connects you with healthcare services, emergency assistance, and valuable health information.
        </Text>
        <View style={styles.featuresContainer}>
          <FeatureItem icon="medkit" text="Find Nearby Hospitals" />
          <FeatureItem icon="fitness" text="Track Your Health" />
          <FeatureItem icon="calendar" text="Book Appointments" />
          <FeatureItem icon="information-circle" text="Health Tips" />
        </View>
      </View>
    </ScrollView>
  );
};

const FeatureItem = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Ionicons name={icon} size={24} color="#4c669f" />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Register') {
            iconName = focused ? 'person-add' : 'person-add-outline';
          } else if (route.name === 'Login') {
            iconName = focused ? 'log-in' : 'log-in-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4c669f',
        tabBarInactiveTintColor: '#b0b0b0',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.1,
          shadowRadius: 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeContent}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerStyle: {
            backgroundColor: '#4c669f',
          },
          headerTintColor: '#fff',
        }}
      />
      <Tab.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerStyle: {
            backgroundColor: '#4c669f',
          },
          headerTintColor: '#fff',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  gradientContainer: {
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 18,
    color: '#e0e0e0',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginVertical: 20,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  featureItem: {
    alignItems: 'center',
    width: '45%',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#333',
  },
});

export default HomeScreen;