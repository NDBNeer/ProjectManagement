import { View, Text, TextInput, Pressable } from "react-native";
import React from "react";
import { loginURL } from "../constraints/urls";
import { StackActions } from "@react-navigation/native";
import { Storage } from "expo-storage";

export default function LoginScreen({ route, navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function setCurrentUser(userData) {
    await Storage.setItem({
      key: "currentUser",
      value: userData,
    });
  }

  async function login() {
    fetch(loginURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // checking the status of the response
        if (data.status === 200) {
          // todo: Store the token in the local storage

          setCurrentUser(JSON.stringify(data.data));
          data.data.type === "admin"
            ? navigation.dispatch(StackActions.replace("AdminDashboard"))
            : navigation.dispatch(StackActions.replace("Dashboard"));

          // destructuring the data
        } else {
          console.log(data.message);
          alert(data.message);
        }
      })
      .catch(function (error) {
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
        // ADD THIS THROW error
        throw error;
      });
  }

  return (
    <View className="flex-1 items-center justify-center bg-slate-50">
      <View className="p-8 w-full max-w-sm">
        <Text className="text-5xl font-bold mb-6 text-slate-900">Login</Text>

        <TextInput
          className="w-full bg-white border border-slate-200 rounded-md h-12 px-4 mb-4"
          placeholderTextColor="#000"
          placeholder="Enter email address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          className="w-full bg-white border border-slate-200 rounded-md h-12 px-4"
          placeholderTextColor="#000"
          placeholder="Enter password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <Pressable
          className="h-12 bg-purple-500 rounded-md flex flex-row justify-center items-center px-6 mt-4"
          onPress={login}
        >
          <View className="flex-1 flex items-center">
            <Text className="text-white text-base font-medium">Login</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
