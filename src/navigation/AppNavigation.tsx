import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Text,
} from 'react-native';
import {
  BriefcaseMedical,
  HeartPlusIcon,
  HomeIcon,
  User,
} from 'lucide-react-native';
import notifee from '@notifee/react-native';

import {
  AllMedicineStackParamList,
  AuthStackParamList,
  DashboardStackParamList,
  MainStackParamList,
  MedicationProfileStack,
  ProfileStackParamList,
  UnAuthStackParamList,
} from 'src/navigation/types';
import LoginScreen from 'src/screens/LoginScreen';
import DashboardScreen from 'src/screens/DashboardScreen';
import Header from 'src/components/Header/Header';
import AllMedicinesScreen from 'src/screens/AllMedicinesScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { fonts } from 'src/config/fonts';
import normalize from 'src/config/normalize';
import { colors } from 'src/config/colors';
import ProfileScreen from 'src/screens/ProfileScreen';
import MedicineDetailsScreen from 'src/screens/MedicineDetailsScreen';
import AddMedicineScreen from 'src/screens/AddMedicineScreen';
import { database } from 'src/Database/database';
import LoadingScreen from 'src/screens/LoadingScreen';
import MedicationProfilesScreen from 'src/screens/MedicationProfilesScreen';
import HealthProfileMedicationScreen from 'src/screens/HealthProfileMedicationScreen';
import EditMedicationScreen from 'src/screens/EditMedicationScreen';
import AddHealthProfileScreen from 'src/screens/AddHealthProfileScreen';
import { getNotificationPermission } from 'src/hooks/getNotificationPermission';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const AppNavigation = () => {
  const UnAuthStack = createNativeStackNavigator<UnAuthStackParamList>();
  const AuthStack = createBottomTabNavigator<AuthStackParamList>();
  const MainStack = createNativeStackNavigator<MainStackParamList>();
  const DashboardStack = createNativeStackNavigator<DashboardStackParamList>();
  const AllMedicineStack =
    createNativeStackNavigator<AllMedicineStackParamList>();
  const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
  const MedicineProfileStack =
    createNativeStackNavigator<MedicationProfileStack>();

  const insets = useSafeAreaInsets();

  const UnAuthStackScreens = () => (
    <UnAuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="LoginRegisterScreen"
    >
      <UnAuthStack.Screen name="LoginRegisterScreen" component={LoginScreen} />
    </UnAuthStack.Navigator>
  );

  const DashboardStackScreens = () => (
    <DashboardStack.Navigator
      initialRouteName="DashboardScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <DashboardStack.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        options={{
          headerShown: true,
          header: () => <Header title="My Medicines" />,
        }}
      />
      <DashboardStack.Screen
        name="MedicineDetailsScreen"
        component={MedicineDetailsScreen}
        options={{
          headerShown: true,
          header: () => <Header title="Medicine Details" showBackIcon={true} />,
        }}
      />
      <DashboardStack.Screen
        name="AddMedicineScreen"
        component={AddMedicineScreen}
        options={{
          headerShown: true,
          header: () => <Header title="Add Medicine" showBackIcon={true} />,
        }}
      />
    </DashboardStack.Navigator>
  );

  const AllMedicineStackScreens = () => (
    <AllMedicineStack.Navigator>
      <AllMedicineStack.Screen
        name="AllMedicinesScreen"
        component={AllMedicinesScreen}
        options={{
          headerShown: true,
          header: () => <Header title="All Medicines" />,
        }}
      />
      <AllMedicineStack.Screen
        name="MedicineDetailsScreen"
        component={MedicineDetailsScreen}
        options={{
          headerShown: true,
          header: () => <Header title="Medicine Details" showBackIcon={true} />,
        }}
      />
      <AllMedicineStack.Screen
        name="AddMedicineScreen"
        component={AddMedicineScreen}
        options={{
          headerShown: true,
          header: () => <Header title="Add Medicine" showBackIcon={true} />,
        }}
      />
    </AllMedicineStack.Navigator>
  );

  const ProfileStackScreens = () => (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: true,
          header: () => <Header title="Profile" showBackIcon={true} />,
        }}
      />
    </ProfileStack.Navigator>
  );

  const MedicineProfileStackScreens = () => (
    <MedicineProfileStack.Navigator initialRouteName="MedicationProfilesScreen">
      <MedicineProfileStack.Screen
        name="MedicationProfilesScreen"
        component={MedicationProfilesScreen}
        options={{
          headerShown: true,
          header: () => <Header title="My Health Profiles" />,
        }}
      />
      <MedicineProfileStack.Screen
        name="HealthProfileMedicationScreen"
        component={HealthProfileMedicationScreen}
        options={({ route }) => ({
          headerShown: true,
          header: () => (
            <Header
              title={`${route.params.medicationsData.medicationName} Meds`}
              showBackIcon={true}
            />
          ),
        })}
      />
      <MedicineProfileStack.Screen
        name="EditMedicationScreen"
        component={EditMedicationScreen}
        options={{
          headerShown: true,
          header: () => <Header title="Edit Medication" showBackIcon={true} />,
        }}
      />
      <MedicineProfileStack.Screen
        name="MedicineDetailsScreen"
        component={MedicineDetailsScreen}
        options={{
          headerShown: true,
          header: () => <Header title="Medicine Details" showBackIcon={true} />,
        }}
      />
      <MedicineProfileStack.Screen
        name="AddMedicineScreen"
        component={AddMedicineScreen}
        options={{
          headerShown: true,
          header: () => <Header title="Add Medicine" showBackIcon={true} />,
        }}
      />
      <MedicineProfileStack.Screen
        name="AddHealthProfileScreen"
        component={AddHealthProfileScreen}
        options={{
          headerShown: true,
          header: () => (
            <Header title="Add Health Profile" showBackIcon={true} />
          ),
        }}
      />
    </MedicineProfileStack.Navigator>
  );

  const AuthStackScreens = () => (
    <AuthStack.Navigator
      initialRouteName="DashboardStackScreens"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.pureWhite,
          height: normalize(55) + insets.bottom,
          paddingBottom: insets.bottom,
        },
      }}
    >
      <AuthStack.Screen
        name="DashboardStackScreens"
        component={DashboardStackScreens}
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  ...fonts.medium,
                  fontSize: normalize(12),
                  // color: focused ? colors.pureWhite : colors.primaryBlue,
                  color: colors.primaryBlue,
                }}
              >
                Home
              </Text>
            );
          },
          tabBarIcon: ({ focused }) => {
            return (
              <HomeIcon
                size={18}
                color={focused ? colors.primaryBlue : colors.pureBlack}
              />
            );
          },
        }}
      />
      <AuthStack.Screen
        name="AllMedicineStackScreens"
        component={AllMedicineStackScreens}
        options={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  ...fonts.medium,
                  fontSize: normalize(12),
                  // color: focused ? colors.pureWhite : colors.primaryBlue,
                  color: colors.primaryBlue,
                }}
              >
                All Medicines
              </Text>
            );
          },
          tabBarIcon: ({ focused }) => {
            return (
              <BriefcaseMedical
                size={18}
                color={focused ? colors.primaryBlue : colors.pureBlack}
              />
            );
          },
        }}
      />
      <AuthStack.Screen
        name="MedicationProfileStackScreens"
        component={MedicineProfileStackScreens}
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  ...fonts.medium,
                  fontSize: normalize(12),
                  // color: focused ? colors.pureWhite : colors.primaryBlue,
                  color: colors.primaryBlue,
                }}
                numberOfLines={1}
              >
                Health Profiles
              </Text>
            );
          },
          tabBarIcon: ({ focused }) => {
            return (
              <HeartPlusIcon
                size={18}
                color={focused ? colors.primaryBlue : colors.pureBlack}
              />
            );
          },
        }}
      />
      <AuthStack.Screen
        name="ProfileStackScreens"
        component={ProfileStackScreens}
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  ...fonts.medium,
                  fontSize: normalize(12),
                  // color: focused ? colors.pureWhite : colors.primaryBlue,
                  color: colors.primaryBlue,
                }}
              >
                Profile
              </Text>
            );
          },
          tabBarIcon: ({ focused }) => {
            return (
              <User
                size={18}
                color={focused ? colors.primaryBlue : colors.pureBlack}
              />
            );
          },
        }}
      />
    </AuthStack.Navigator>
  );

  type userTypes = 'AuthUser' | 'UnAuthUser' | 'LoadingScreen';

  const [userType, setUserType] = useState<userTypes>('LoadingScreen');

  useEffect(() => {
    const profileData = database.get('profile');
    profileData
      .query()
      .observe()
      .forEach(item => {
        if (item.length > 0) {
          setUserType('AuthUser');
        } else {
          setUserType('UnAuthUser');
        }
      });
  }, []);

  const requestPermssion = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (granted === 'granted') {
        console.log('granted');
        await batteryOptimizationMethod();
      } else {
        Alert.alert('Permission', 'Permission Needed to access Camera', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const batteryOptimizationMethod = async () => {
    const batteryOptimizationEnabled =
      await notifee.isBatteryOptimizationEnabled();
    if (batteryOptimizationEnabled) {
      Alert.alert(
        'Restrictions Detected',
        'To ensure notifications are delivered, please disable battery optimization for the app.',
        [
          // 3. launch intent to navigate the user to the appropriate screen
          {
            text: 'OK, open settings',
            onPress: async () =>
              await notifee.openBatteryOptimizationSettings(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: false },
      );
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      requestPermssion();
    } else {
      [batteryOptimizationMethod()];
    }
  }, []);

  return (
    <NavigationContainer>
      {userType === 'UnAuthUser' ? (
        <MainStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <MainStack.Screen
            name="UnAuthStackScreens"
            component={UnAuthStackScreens}
          />
        </MainStack.Navigator>
      ) : userType === 'AuthUser' ? (
        <MainStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <MainStack.Screen
            name="AuthStackScreens"
            component={AuthStackScreens}
          />
        </MainStack.Navigator>
      ) : (
        <MainStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <MainStack.Screen name="LoadingScreen" component={LoadingScreen} />
        </MainStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigation;
