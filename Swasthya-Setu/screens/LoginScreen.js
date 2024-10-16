import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLazyQuery, gql } from '@apollo/client';
import { useNavigation, useRoute } from '@react-navigation/native';
import { 
  signInWithEmailAndPassword,
  GoogleAuthProvider, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { auth } from '../firebase'; // Adjust the import path as needed
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../autocontext'; // Adjust the import path as needed

const GET_USER_BY_FIREBASE_UID = gql`
  query GetUserByFirebaseUID($firebase_uid: String!) {
    hospital_admins(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id
      username
      email
      full_name
    }
    medical_shop_admins(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id
      username
      email
      full_name
    }
    citizens(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id
      username
      email
      full_name
    }
    volunteers(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id
      username
      email
      full_name
    }
    admin_users(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id
      username
      email
      full_name
      role
    }
  }
`;

const Login = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth(); // Use the auth context
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [getUserByFirebaseUID] = useLazyQuery(GET_USER_BY_FIREBASE_UID);

  useEffect(() => {
    if (route.params?.registered) {
      Alert.alert('Registration Successful', 'You can now log in with your credentials.');
    }
  }, [route.params?.registered]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (loginFunction, credentials) => {
    setError('');
    setLoading(true);
    try {
      const userCredential = await loginFunction(...credentials);
      const user = userCredential.user;

      const { data } = await getUserByFirebaseUID({
        variables: { firebase_uid: user.uid }
      });

      const userTypes = ['hospital_admins', 'medical_shop_admins', 'citizens', 'volunteers', 'admin_users'];
      let userData;
      let userRole;

      for (const type of userTypes) {
        if (data[type] && data[type].length > 0) {
          userData = data[type][0];
          userRole = type === 'admin_users' ? userData.role : type.slice(0, -1);
          break;
        }
      }

      if (userData) {
        console.log('Login successful:', { ...userData, role: userRole });
        navigation.navigate('Dashboard', { email: userData.email });
      } else {
        throw new Error('User not found in custom database');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPasswordLogin = async () => {
    handleLogin(signInWithEmailAndPassword, [auth, formData.email, formData.password]);
  };

  const handleGoogleLogin = () => {
    // Implement Google Sign-In for React Native
    // This typically involves using a library like @react-native-google-signin/google-signin
    Alert.alert('Google Sign-In', 'Google Sign-In is not implemented in this example.');
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, formData.email);
      Alert.alert('Password Reset', 'Password reset email sent. Please check your inbox.');
    } catch (err) {
      console.error('Error sending password reset email:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigation.navigate('Dashboard');
    }
  }, [user, navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Welcome Back</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          keyboardType="email-address"
        />
        
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Icon name={showPassword ? "eye-slash" : "eye"} size={20} color="gray" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleEmailPasswordLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Logging in...' : 'Login with Email'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          <Icon name="google" size={20} color="white" style={styles.googleIcon} />
          <Text style={styles.buttonText}>
            {loading ? 'Logging in...' : 'Login with Google'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.forgotPasswordButton]}
          onPress={handleForgotPassword}
          disabled={loading}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F0F8FF',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2196F3',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  googleButton: {
    backgroundColor: '#DB4437',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: 10,
  },
  forgotPasswordButton: {
    backgroundColor: '#f0f0f0',
  },
  forgotPasswordText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Login;