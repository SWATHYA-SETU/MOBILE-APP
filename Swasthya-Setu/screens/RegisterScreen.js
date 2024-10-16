import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, Modal, Dimensions } from 'react-native';
import { useMutation, gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust the import path as needed
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Make sure to install this package

const INSERT_HOSPITAL_ADMIN = gql`
  mutation InsertHospitalAdmin($object: hospital_admins_insert_input!) {
    insert_hospital_admins_one(object: $object) {
      id
      username
      email
      firebase_uid
    }
  }
`;

const INSERT_MEDICAL_SHOP_ADMIN = gql`
  mutation InsertMedicalShopAdmin($object: medical_shop_admins_insert_input!) {
    insert_medical_shop_admins_one(object: $object) {
      id
      username
      email
      firebase_uid
    }
  }
`;

const INSERT_CITIZEN = gql`
  mutation InsertCitizen($object: citizens_insert_input!) {
    insert_citizens_one(object: $object) {
      id
      username
      email
      firebase_uid
    }
  }
`;

const INSERT_VOLUNTEER = gql`
  mutation InsertVolunteer($object: volunteers_insert_input!) {
    insert_volunteers_one(object: $object) {
      id
      username
      email
      firebase_uid
    }
  }
`;

const INSERT_ADMIN_USER = gql`
  mutation InsertAdminUser($object: admin_users_insert_input!) {
    insert_admin_users_one(object: $object) {
      id
      username
      email
      firebase_uid
    }
  }
`;

const translations = {
  en: {
    title: 'Register',
    selectRole: 'Select Role',
    citizen: 'Citizen',
    volunteer: 'Volunteer',
    hospitalAdmin: 'Hospital Admin',
    medicalShopAdmin: 'Medical Shop Admin',
    adminUser: 'Admin User',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    dateOfBirth: 'Date of Birth (YYYY-MM-DD)',
    address: 'Address',
    phoneNumber: 'Phone Number',
    emergencyContact: 'Emergency Contact',
    vaccinationRecord: 'Vaccination Record',
    medicalHistory: 'Medical History',
    skills: 'Skills',
    availability: 'Availability',
    adminRole: 'Admin Role',
    register: 'Register',
    successTitle: 'Registration Successful',
    successMessage: "You've successfully registered as a Kitanu Warrior 🦠🛡️!",
    ok: 'OK',
  },
  hi: {
    title: 'पंजीकरण',
    selectRole: 'भूमिका चुनें',
    citizen: 'नागरिक',
    volunteer: 'स्वयंसेवक',
    hospitalAdmin: 'अस्पताल प्रशासक',
    medicalShopAdmin: 'मेडिकल शॉप प्रशासक',
    adminUser: 'प्रशासक उपयोगकर्ता',
    username: 'उपयोगकर्ता नाम',
    email: 'ईमेल',
    password: 'पासवर्ड',
    fullName: 'पूरा नाम',
    dateOfBirth: 'जन्म तिथि (YYYY-MM-DD)',
    address: 'पता',
    phoneNumber: 'फोन नंबर',
    emergencyContact: 'आपातकालीन संपर्क',
    vaccinationRecord: 'टीकाकरण रिकॉर्ड',
    medicalHistory: 'चिकित्सा इतिहास',
    skills: 'कौशल',
    availability: 'उपलब्धता',
    adminRole: 'प्रशासक भूमिका',
    register: 'पंजीकरण करें',
    successTitle: 'पंजीकरण सफल',
    successMessage: 'आप सफलतापूर्वक एक कीटाणु योद्धा के रूप में पंजीकृत हो गए हैं 🦠🛡️!',
    ok: 'ठीक है',
  }
};

const Register = () => {
  const navigation = useNavigation();
  const [language, setLanguage] = useState('en');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    username: '',
    password: '',
    email: '',
    fullName: '',
    dateOfBirth: '',
    address: '',
    phoneNumber: '',
    emergencyContact: '',
    medicalHistory: '',
    vaccinationRecord: '',
    skills: '',
    availability: '',
    adminRole: '',
  });

  const [insertHospitalAdmin] = useMutation(INSERT_HOSPITAL_ADMIN);
  const [insertMedicalShopAdmin] = useMutation(INSERT_MEDICAL_SHOP_ADMIN);
  const [insertCitizen] = useMutation(INSERT_CITIZEN);
  const [insertVolunteer] = useMutation(INSERT_VOLUNTEER);
  const [insertAdminUser] = useMutation(INSERT_ADMIN_USER);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const commonFields = {
        username: formData.username,
        email: formData.email,
        full_name: formData.fullName,
        address: formData.address,
        firebase_uid: user.uid,
      };

      let result;
      switch (formData.role) {
        case 'hospital_admin':
          result = await insertHospitalAdmin({
            variables: { 
              object: {
                ...commonFields,
                contact_number: formData.phoneNumber,
              }
            }
          });
          break;
        case 'medical_shop_admin':
          result = await insertMedicalShopAdmin({
            variables: { 
              object: {
                ...commonFields,
                contact_number: formData.phoneNumber,
              }
            }
          });
          break;
        case 'citizen':
          result = await insertCitizen({
            variables: { 
              object: {
                ...commonFields,
                date_of_birth: formData.dateOfBirth,
                phone_number: formData.phoneNumber,
                emergency_contact: formData.emergencyContact,
                medical_history: formData.medicalHistory,
                vaccination_record: formData.vaccinationRecord,
              }
            }
          });
          break;
        case 'volunteer':
          result = await insertVolunteer({
            variables: { 
              object: {
                ...commonFields,
                date_of_birth: formData.dateOfBirth,
                phone_number: formData.phoneNumber,
                skills: formData.skills,
                availability: formData.availability,
              }
            }
          });
          break;
        case 'admin_user':
          result = await insertAdminUser({
            variables: { 
              object: {
                ...commonFields,
                role: formData.adminRole,
              }
            }
          });
          break;
        default:
          throw new Error('Invalid role selected');
      }

      console.log('Registration successful:', result);
      Alert.alert('Success', 'Registration successful!');
      setTimeout(() => {
        navigation.navigate('Login', { registered: true });
      }, 2500);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      }
      if (error.networkError) {
        console.log(`[Network error]: ${error.networkError}`);
      }
      Alert.alert('Error', error.message);
    }
  };

  const renderRoleSpecificFields = () => {
    const t = translations[language];
    switch (formData.role) {
      case 'citizen':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder={t.emergencyContact}
              value={formData.emergencyContact}
              onChangeText={(text) => handleChange('emergencyContact', text)}
            />
            <TextInput
              style={styles.input}
              placeholder={t.vaccinationRecord}
              value={formData.vaccinationRecord}
              onChangeText={(text) => handleChange('vaccinationRecord', text)}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder={t.medicalHistory}
              value={formData.medicalHistory}
              onChangeText={(text) => handleChange('medicalHistory', text)}
              multiline
            />
          </>
        );
      case 'volunteer':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder={t.skills}
              value={formData.skills}
              onChangeText={(text) => handleChange('skills', text)}
            />
            <TextInput
              style={styles.input}
              placeholder={t.availability}
              value={formData.availability}
              onChangeText={(text) => handleChange('availability', text)}
            />
          </>
        );
      case 'admin_user':
        return (
          <TextInput
            style={styles.input}
            placeholder={t.adminRole}
            value={formData.adminRole}
            onChangeText={(text) => handleChange('adminRole', text)}
          />
        );
      default:
        return null;
    }
  };

  const t = translations[language];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.languagePickerContainer}>
          <Picker
            selectedValue={language}
            style={styles.languagePicker}
            onValueChange={(itemValue) => setLanguage(itemValue)}
            mode="dropdown"
          >
            <Picker.Item label="🇺🇸 English" value="en" />
            <Picker.Item label="🇮🇳 हिंदी" value="hi" />
          </Picker>
        </View>
      <View style={styles.form}>
        <Text style={styles.title}>{t.title}</Text>
        
        <Picker
          selectedValue={formData.role}
          onValueChange={(itemValue) => handleChange('role', itemValue)}
          style={styles.picker}
        >
          <Picker.Item label={t.selectRole} value="" />
          <Picker.Item label={t.citizen} value="citizen" />
          <Picker.Item label={t.volunteer} value="volunteer" />
          <Picker.Item label={t.hospitalAdmin} value="hospital_admin" />
          <Picker.Item label={t.medicalShopAdmin} value="medical_shop_admin" />
          <Picker.Item label={t.adminUser} value="admin_user" />
        </Picker>

        <TextInput
          style={styles.input}
          placeholder={t.username}
          value={formData.username}
          onChangeText={(text) => handleChange('username', text)}
        />

        <TextInput
          style={styles.input}
          placeholder={t.email}
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder={t.password}
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder={t.fullName}
          value={formData.fullName}
          onChangeText={(text) => handleChange('fullName', text)}
        />

        <TextInput
          style={styles.input}
          placeholder={t.dateOfBirth}
          value={formData.dateOfBirth}
          onChangeText={(text) => handleChange('dateOfBirth', text)}
        />

        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder={t.address}
          value={formData.address}
          onChangeText={(text) => handleChange('address', text)}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder={t.phoneNumber}
          value={formData.phoneNumber}
          onChangeText={(text) => handleChange('phoneNumber', text)}
          keyboardType="phone-pad"
        />

        {renderRoleSpecificFields()}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>{t.register}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Icon name="check-circle" size={60} color="#4CAF50" />
            <Text style={styles.modalTitle}>{t.successTitle}</Text>
            <Text style={styles.modalText}>{t.successMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('Login', { role: formData.role });
              }}
            >
              <Text style={styles.buttonText}>{t.ok}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  languagePickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  languagePicker: {
    height: 40,
    width: 150,
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
  picker: {
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
});

export default Register;