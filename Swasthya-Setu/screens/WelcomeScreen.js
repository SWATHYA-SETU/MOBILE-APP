import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, Easing, Image } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: 1,
    title: 'Welcome to Swasthya-Setu',
    text: 'Your one-stop health manager. Stay updated with emergency alerts, track live epidemic stats, and monitor outbreaks in real-time.',
    image: require('../assets/doctor_welcome.png'),
  },
  {
    key: 2,
    title: 'Track Your City Health',
    text: 'Get real-time updates on city health, monitor vital statistics, view bed availability, and stay on top of the latest trends.',
    image: require('../assets/city-health.png'),
  },
  {
    key: 3,
    title: 'Welcome to Swasthya AI',
    text: 'Easily schedule, track medical visits, and access health records. AI-powered tools for better health management.',
    image: require('../assets/ai-health.png'),
  },
  {
    key: 4,
    title: 'Your Health, Our Priority',
    text: 'Advanced security measures ensure your data is always protected. Your privacy is our utmost concern.',
    image: require('../assets/security.png'),
  },
];

const WelcomeScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const textAnimY = useRef(new Animated.Value(50)).current;
  const textAnimX = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(1)).current;
  const leftConfettiRef = useRef();
  const rightConfettiRef = useRef();

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const slidesRef = useRef(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(textAnimY, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(textAnimX, {
          toValue: -10,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(textAnimX, {
          toValue: 10,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(textAnimX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(textScale, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(textScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [currentIndex]);

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      if (leftConfettiRef.current && rightConfettiRef.current) {
        leftConfettiRef.current.start();
        rightConfettiRef.current.start();
      }
      setTimeout(() => {
        navigation.navigate('Home');
      }, 2500); // Navigate after 5 seconds of confetti
    }
  };

  const renderItem = ({ item, index }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: [width * 0.1, 0, -width * 0.1],
    });

    const imageScale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
    });

    const imageRotate = scrollX.interpolate({
      inputRange,
      outputRange: ['-10deg', '0deg', '10deg'],
    });

    return (
      <Animated.View style={[styles.slide, { transform: [{ translateX }] }]}>
        <Animated.View
          style={[
            styles.imageContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: Animated.multiply(scaleAnim, imageScale) },
                { rotate: imageRotate },
              ],
            },
          ]}
        >
          <Image source={item.image} style={styles.image} />
        </Animated.View>
        <Animated.Text 
          style={[
            styles.title, 
            { 
              opacity: fadeAnim,
              transform: [
                { translateY: textAnimY },
                { translateX: textAnimX },
                { scale: textScale },
              ],
            }
          ]}
        >
          {item.title}
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.text, 
            { 
              opacity: fadeAnim,
              transform: [
                { translateY: Animated.multiply(textAnimY, 1.2) },
                { translateX: Animated.multiply(textAnimX, 0.8) },
                { scale: Animated.add(1, Animated.multiply(textScale, 0.1)) },
              ],
            }
          ]}
        >
          {item.text}
        </Animated.Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.key.toString()}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.4, 0.8],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              style={[styles.dot, { opacity, transform: [{ scale }] }]}
              key={index.toString()}
            />
          );
        })}
      </View>
      <TouchableOpacity style={styles.button} onPress={scrollTo}>
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
      <ConfettiCannon
        count={200}
        origin={{x: 0, y: 0}}
        autoStart={false}
        fadeOut={true}
        ref={leftConfettiRef}
      />
      <ConfettiCannon
        count={200}
        origin={{x: width, y: 0}}
        autoStart={false}
        fadeOut={true}
        ref={rightConfettiRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
  },
  slide: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 100,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#4169E1',
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#4169E1',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    position: 'absolute',
    bottom: 40,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;