import "./global.css";
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Menu from './screens/Menu';
import Cart from './screens/Cart';
import Profile from './screens/Profile';
import SplashScreen from './components/SplashScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ onLogOut }: { onLogOut: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F4CE14',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#eee' },
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Menu" component={Menu} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="Profile">
        {(props) => <Profile {...props} onLogOut={onLogOut} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem('onboardingCompleted');
      setIsOnboardingCompleted(value === '1');
      setIsLoading(false);
    };
    checkOnboarding();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isOnboardingCompleted ? (
          <Stack.Screen name="Main">
            {() => (
              <MainTabs onLogOut={() => setIsOnboardingCompleted(false)} />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Onboarding">
            {(props) => (
              <Onboarding
                {...props}
                onComplete={() => setIsOnboardingCompleted(true)}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
