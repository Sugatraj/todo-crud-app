import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      const users = await AsyncStorage.getItem("@users");
      const parsedUsers = users ? JSON.parse(users) : [];

      const user = parsedUsers.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        await AsyncStorage.setItem("@currentUser", JSON.stringify(user));
        navigation.replace("Todo");
      } else {
        Alert.alert("Error", "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Login failed");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 justify-center">
        {/* Logo and Welcome Text */}
        <View className="items-center mb-8">
          <Image 
            source={require('../assets/images/mountain.jpg')} 
            className="h-32 w-32 rounded-full"
            style={{ width: 128, height: 128 }}
          />
          <Text className="text-2xl font-bold mt-4 text-gray-800">Welcome Back</Text>
          <Text className="text-gray-500 mt-2">Sign in to continue</Text>
        </View>

        {/* Login Form */}
        <View className="space-y-4">
          {/* Username Input */}
          <View>
            <Text className="text-gray-700 mb-2 ml-1">Username</Text>
            <TextInput
              className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-200"
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Password Input */}
          <View>
            <Text className="text-gray-700 mb-2 ml-1">Password</Text>
            <TextInput
              className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-200"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className="bg-blue-500 py-4 rounded-xl mt-4"
            onPress={handleLogin}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Login
            </Text>
          </TouchableOpacity>

          {/* Signup Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text className="text-blue-500 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
