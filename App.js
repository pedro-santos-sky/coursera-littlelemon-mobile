// import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Onboarding } from './screens/Onboarding';
import Profile from './screens/Profile';
import SplashScreen from './screens/SplashScreen';
import Home from './screens/Home';
import { AuthContext } from './context/AuthContext';
import { useMemo, useReducer, useEffect,  } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator()

export default function App({navigation}) {

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "onboarded":
          return {
            ...prevState,
            isLoading: false,
            isOnboarded: action.isOnboarded
          };
          //for a complete implementation of this authentication flow with cases of
          //user tokens, sign in & out see https://reactnavigation.org/docs/auth-flow/
      }
    },
    {
      isLoading: true,
      isOnboarded: false,
    }
  )

  useEffect(() => {
    (async () => {
      let profileData = [];
      try {
        const getProfileData = await AsyncStorage.getItem("profile")
        if (getProfileData !== null) {
          profileData = getProfileData
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (Object.keys(profileData).length != 0) {
          dispatch({type: 'onboarded', isOnboarded: true})
        } else {
          dispatch({type: 'onboarded', isOnboarded: false})
        }
      }
    }) ()
  }, [])

  const authContext = useMemo(
    () => ({
      onboarded: async data => {
        try {
          const serializedData = JSON.stringify(data)
          await AsyncStorage.setItem('profile', serializedData)
        } catch (e) {
          console.error(e)
        }

        dispatch({type: 'onboarded', isOnboarded: true})
      },
      update: async data => {
        try {
          const serializedData = JSON.stringify(data)
          await AsyncStorage.setItem('profile', serializedData)
        } catch (e) {
          console.error(e)
        }

        Alert.alert("👍", 'Update successfull')
      },
      logout: async () => {
        try {
          await AsyncStorage.clear()
        } catch (e) {
          console.error(e)
        }

        dispatch({type: 'onboarded', isOnboarded: false})
      }
    }),
    []
  )

  if (state.isLoading) {

    return <SplashScreen />
  }

  return (
      <AuthContext.Provider value={authContext}>
        <StatusBar style='dark'/>
        <NavigationContainer>
          <Stack.Navigator>
            { state.isOnboarded ? (
              <>
               <Stack.Screen name='Home' component={Home} />
               <Stack.Screen name='Profile' component={Profile} />
              </>
            ) : (
                <Stack.Screen name='Onboarding'  component={Onboarding} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
  );
}


