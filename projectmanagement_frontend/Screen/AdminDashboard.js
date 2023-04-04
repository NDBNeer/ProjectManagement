import AddUser from "../Components/AddUser";
import { Pressable, SafeAreaView, Text, View } from "react-native";

export default function AdminDashboard({ route, navigation }) {
  return (
    <SafeAreaView className="bg-slate-50">
      <View className=" flex flex-row p-8 w-full items-stretch justify-evenly">
        <Text className="text-3xl font-bold mb-6 text-slate-900">
          Admin Dashboard
        </Text>
        <Pressable
          className="h-12 bg-purple-500 rounded-md flex flex-row justify-center items-center px-8 ml-8"
          onPress={() => {
            navigation.navigate("LoginScreen");
          }}
        >
          <Text className="text-white text-base font-medium">Logout</Text>
        </Pressable>
      </View>
      <AddUser />
    </SafeAreaView>
  );
}
