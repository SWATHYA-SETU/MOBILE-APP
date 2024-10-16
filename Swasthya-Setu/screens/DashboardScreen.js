import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../autocontext'; // Adjust the import path as needed
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

const GET_USER_DATA = gql`
  query GetUserData($firebase_uid: String!) {
    hospital_admins(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id username email full_name address contact_number hospital_id
    }
    medical_shop_admins(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id username email full_name address contact_number medical_shop_id
    }
    citizens(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id username email full_name date_of_birth address phone_number emergency_contact medical_history vaccination_record
    }
    volunteers(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id username email full_name date_of_birth address phone_number skills availability
    }
    admin_users(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id username email full_name role address
    }
  }
`;

const DashboardScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [showProfile, setShowProfile] = useState(false);

  const { loading, error, data } = useQuery(GET_USER_DATA, {
    variables: { firebase_uid: user?.uid },
    skip: !user,
  });

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
    }
  }, [user, navigation]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error.message} />;

  const userTypes = ['hospital_admins', 'medical_shop_admins', 'citizens', 'volunteers', 'admin_users'];
  let userData;
  let userRole;

  for (const type of userTypes) {
    if (data[type] && data[type].length > 0) {
      userData = data[type][0];
      userRole = type === 'admin_users' ? 'admin_user' : type.slice(0, -1);
      break;
    }
  }

  const getUserRoleDisplay = (role) => {
    switch (role) {
      case 'hospital_admin': return 'Hospital Administrator';
      case 'medical_shop_admin': return 'Medical Shop Administrator';
      case 'citizen': return 'Citizen';
      case 'volunteer': return 'Volunteer';
      case 'admin_user': return 'System Administrator';
      default: return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  const renderUserDetails = () => {
    if (!userData) return <Text style={styles.noDataText}>No user data available.</Text>;

    const excludeFields = ['id', 'firebase_uid', 'hospital_id', 'medical_shop_id'];

    return (
      <View style={styles.userDetails}>
        {Object.entries(userData).map(([key, value]) => {
          if (excludeFields.includes(key)) return null;
          return (
            <View key={key} style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
              </Text>
              <Text style={styles.detailValue}>{value !== null ? value.toString() : 'N/A'}</Text>
            </View>
          );
        })}
        {userRole === 'hospital_admin' && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Hospital Reg No:</Text>
            <Text style={styles.detailValue}>{userData.hospital_id || 'N/A'}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderDashboardContent = () => {
    switch (userRole) {
      case 'hospital_admin':
        return <HospitalAdminDashboard />;
      case 'medical_shop_admin':
        return <MedicalShopAdminDashboard />;
      case 'citizen':
        return <CitizenDashboard />;
      case 'volunteer':
        return <VolunteerDashboard />;
      case 'admin_user':
        return <AdminDashboard />;
      default:
        return <Text style={styles.noDataText}>No specific dashboard content available.</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4a148c', '#3f51b5']}
        style={styles.header}
      >
        <Text style={styles.headerText}>Welcome, {userData?.full_name}</Text>
        <TouchableOpacity onPress={() => setShowProfile(!showProfile)} style={styles.profileButton}>
          <Icon name={showProfile ? "arrow-drop-up" : "arrow-drop-down"} size={24} color="#fff" />
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {showProfile && (
          <View style={styles.profileSection}>
            <Text style={styles.profileTitle}>User Profile</Text>
            <Text style={styles.roleText}>{getUserRoleDisplay(userRole)}</Text>
            {renderUserDetails()}
          </View>
        )}

        <View style={styles.dashboardContent}>
          {renderDashboardContent()}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Blood Donation Management</Text>
          <BloodDonationManagement />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const LoadingScreen = () => (
  <View style={styles.centerContainer}>
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const ErrorScreen = ({ error }) => (
  <View style={styles.centerContainer}>
    <Text style={styles.errorText}>Error: {error}</Text>
  </View>
);

const HospitalAdminDashboard = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Hospital Management</Text>
    {/* Add hospital management components here */}
    <Text style={styles.placeholderText}>Hospital management features coming soon...</Text>
  </View>
);

const MedicalShopAdminDashboard = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Medical Shop Management</Text>
    {/* Add medical shop management components here */}
    <Text style={styles.placeholderText}>Medical shop management features coming soon...</Text>
  </View>
);

const CitizenDashboard = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Citizen Services</Text>
    {/* Add citizen-specific components here */}
    <Text style={styles.placeholderText}>Citizen services features coming soon...</Text>
  </View>
);

const VolunteerDashboard = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Volunteer Assignments</Text>
    {/* Add volunteer assignment components here */}
    <Text style={styles.placeholderText}>Volunteer assignment features coming soon...</Text>
  </View>
);

const AdminDashboard = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>System Administration</Text>
    {/* Add admin dashboard components here */}
    <Text style={styles.placeholderText}>System administration features coming soon...</Text>
  </View>
);

const BloodDonationManagement = () => (
  <View>
    {/* Add BloodDonation component or relevant information here */}
    <Text style={styles.placeholderText}>Blood donation management features coming soon...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    padding: 20,
    paddingTop: StatusBar.currentHeight + 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  profileButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4a148c',
  },
  roleText: {
    fontSize: 18,
    color: '#3f51b5',
    marginBottom: 15,
  },
  userDetails: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 5,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  detailValue: {
    color: '#666',
    flex: 2,
    textAlign: 'right',
  },
  dashboardContent: {
    padding: 10,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#4a148c',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#3f51b5',
  },
  errorText: {
    fontSize: 18,
    color: '#f44336',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  placeholderText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default DashboardScreen;