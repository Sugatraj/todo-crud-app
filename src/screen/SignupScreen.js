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

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    try {
      if (!username || !password || !confirmPassword) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }

      const users = await AsyncStorage.getItem("@users");
      const parsedUsers = users ? JSON.parse(users) : [];

      const userExists = parsedUsers.some((user) => user.username === username);
      if (userExists) {
        Alert.alert("Error", "Username already taken");
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        username,
        password,
      };

      const updatedUsers = [...parsedUsers, newUser];
      await AsyncStorage.setItem("@users", JSON.stringify(updatedUsers));
      
      Alert.alert("Success", "Account created successfully", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Signup failed");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 justify-center">
        <View className="items-center mb-8">
          <Image 
            source={require('../assets/images/mountain.jpg')} 
            className="h-32 w-32 rounded-full"
            style={{ width: 128, height: 128 }}
          />
          <Text className="text-2xl font-bold mt-4 text-gray-800">Create Account</Text>
          <Text className="text-gray-500 mt-2">Sign up to get started</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 mb-2 ml-1">Username</Text>
            <TextInput
              className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-200"
              placeholder="Choose a username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2 ml-1">Password</Text>
            <TextInput
              className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-200"
              placeholder="Choose a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2 ml-1">Confirm Password</Text>
            <TextInput
              className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-200"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity
            className="bg-blue-500 py-4 rounded-xl mt-4"
            onPress={handleSignup}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Sign Up
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-blue-500 font-semibold">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen; 