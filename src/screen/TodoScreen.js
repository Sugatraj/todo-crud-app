import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const TodoScreen = () => {
  const navigation = useNavigation();
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    loadTodos();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("@currentUser");
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user.username);
      }
    } catch (error) {
      console.log("Error getting user data:", error);
    }
  };

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem("@todos");
      if (storedTodos !== null) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load todos");
    }
  };

  const saveTodos = async (updatedTodos) => {
    try {
      await AsyncStorage.setItem("@todos", JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
    } catch (error) {
      Alert.alert("Error", "Failed to save todos");
    }
  };

  const handleAddTodo = async () => {
    if (inputText.trim().length === 0) {
      Alert.alert("Error", "Please enter a todo item");
      return;
    }

    try {
      let updatedTodos;
      if (editingId !== null) {
        updatedTodos = todos.map((todo) =>
          todo.id === editingId ? { ...todo, title: inputText } : todo
        );
      } else {
        const newTodo = {
          id: Date.now(),
          title: inputText,
        };
        updatedTodos = [...todos, newTodo];
      }
      
      await saveTodos(updatedTodos);
      setInputText("");
      setEditingId(null);
    } catch (error) {
      Alert.alert("Error", "Failed to save todo");
    }
  };

  const handleEditStart = (todo) => {
    setEditingId(todo.id);
    setInputText(todo.title);
  };

  const handleDeleteTodo = async (id) => {
    try {
      const filteredTodos = todos.filter((todo) => todo.id !== id);
      await saveTodos(filteredTodos);
    } catch (error) {
      Alert.alert("Error", "Failed to delete todo");
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@currentUser");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Error", "Failed to logout");
    }
  };

  const renderTodos = ({ item }) => (
    <View className="flex-row items-center justify-between bg-white p-4 rounded-xl mb-3 shadow">
      <Text className="flex-1 text-base text-gray-800">{item.title}</Text>
      <View className="flex-row space-x-2">
        <TouchableOpacity 
          className="bg-blue-500 px-3 py-2 rounded-md"
          onPress={() => handleEditStart(item)}
        >
          <Text className="text-white text-sm font-medium">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-red-500 px-3 py-2 rounded-md"
          onPress={() => handleDeleteTodo(item.id)}
        >
          <Text className="text-white text-sm font-medium">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View className="flex-1 px-4">
        {/* Header */}
        <View className="py-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-bold text-gray-800">Todo List</Text>
            <TouchableOpacity 
              className="bg-red-500 px-4 py-2 rounded-lg"
              onPress={handleLogout}
            >
              <Text className="text-white font-medium">Logout</Text>
            </TouchableOpacity>
          </View>
          
          {/* User Email */}
          <Text className="text-gray-500 mt-1">
            Welcome,{" "}
            <Text className="font-semibold">{username.charAt(0).toUpperCase() + username.slice(1)}</Text>
          </Text>
        </View>

        {/* Input Section */}
        <View className="flex-row space-x-2 mb-6">
          <TextInput
            className="flex-1 bg-white px-4 py-3 rounded-xl border border-gray-200"
            placeholder="Add a new todo"
            placeholderTextColor="#666"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity 
            className={`px-5 rounded-xl justify-center items-center ${
              editingId !== null ? 'bg-green-500' : 'bg-blue-500'
            }`}
            onPress={handleAddTodo}
          >
            <Text className="text-white text-base font-semibold">
              {editingId !== null ? "Update" : "Add"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Todo List */}
        {todos.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg text-center">
              No todos yet. Add one above!
            </Text>
          </View>
        ) : (
          <FlatList
            data={todos}
            renderItem={renderTodos}
            keyExtractor={(item) => item.id.toString()}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-4"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default TodoScreen;
