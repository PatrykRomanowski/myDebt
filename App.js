import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Provider } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import store from "./storage";

import Chart from "./components/chart";
import Data from "./components/data";
import Stats from "./components/stats";

import colors from "./CONST/colors";

import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";

import { functionhandlerActions } from "./storage/hendlerFunction";

import { useEffect } from "react";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainScreen() {
  const dispatch = useDispatch();

  const refreshData = () => {
    console.log("XD");
    dispatch(functionhandlerActions.refreshData());
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: colors.secondary }, // Ustawienie koloru tła
        tabBarActiveTintColor: "white", // Kolor aktywnej ikony/tekstu
        tabBarInactiveTintColor: colors.primary, // Kolor nieaktywnej ikony/tekstu
      }}
    >
      <Tab.Screen
        name="Book"
        component={Chart}
        options={{
          headerShown: false,
          tabBarLabel: "CHARTS",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" color={color} size={size} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                refreshData();
                props.onPress();
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Stats"
        component={Stats}
        options={{
          headerShown: false,
          tabBarLabel: "STATS",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Book1"
        component={Data}
        options={{
          headerShown: false,
          tabBarLabel: "ADD DATA",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="file-tray-stacked-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const handleTabPress = () => {
  console.log("XD");
};

export default function App() {
  // const navigation = useNavigation();

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("tabPress", () => {
  //     console.log("Zakładka CHARTS została kliknięta");
  //     handleTabPress(); // Wywołaj funkcję po kliknięciu
  //   });
  //   return unsubscribe;
  // }, [navigation]);

  let [fontsLoaded, fontError] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              // backgroundColor: "#0A0A0B",
              backgroundColor: colors.secondary,
            },

            // headerRight: () => <SettingIcon />,
            headerTintColor: "white",
          }}
        >
          <Stack.Screen
            name="YOUR FINANSES"
            component={MainScreen}
            options={{
              headerShown: true,
              headerTitleStyle: {
                fontWeight: "600",
                fontFamily: "Inter_700Bold",
                fontSize: 18,
              },
              headerTitleAlign: "center",
            }}
          />
          {/* <Stack.Screen
          name="Select Theard1"
          component={Chart}
          options={{
            headerShown: true,
            headerTitleStyle: {
              fontWeight: "300",
              fontFamily: "Inter_400Regular",
              fontSize: 16,
              },
              headerTitleAlign: "center",
              }}
              /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
});
