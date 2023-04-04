import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { userRouteURL } from "../constraints/urls";

export default function AddUser() {
  const userTypes = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
  ];

  const [userTypeValue, setUserTypeValue] = React.useState("user");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function addUserToDB() {
    fetch(userRouteURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        type: userTypeValue,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // checking the status of the response
        if (data.status === 200) {
          console.log(data);
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
    <View className="items-center justify-center bg-slate-50">
      <View className="p-8 w-full max-w-sm">
        <Text className="text-5xl font-bold mb-6 text-slate-900">Add User</Text>

        <TextInput
          className="w-full bg-white border border-slate-200 rounded-md h-12 px-4 mb-4"
          placeholderTextColor="#000"
          placeholder="Enter Full Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />

        <TextInput
          className="w-full bg-white border border-slate-200 rounded-md h-12 px-4 mb-4"
          placeholderTextColor="#000"
          placeholder="Enter Email Address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          className="w-full bg-white border border-slate-200 rounded-md h-12 px-4 mb-4"
          placeholderTextColor="#000"
          placeholder="Enter Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <Picker
          className="w-full  mb-4"
          selectedValue={userTypeValue}
          onValueChange={setUserTypeValue}
        >
          {userTypes.map((userType) => (
            <Picker.Item
              label={userType.label}
              value={userType.value}
              key={userType.value}
            />
          ))}
        </Picker>

        <Pressable
          className="h-12 bg-purple-500 rounded-md flex flex-row justify-center items-center px-6 mt-4"
          onPress={addUserToDB}
        >
          <View className="flex-1 flex items-center">
            <Text className="text-white text-base font-medium">Add User</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
