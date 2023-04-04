import { Storage } from "expo-storage";
import AddUser from "../Components/AddUser";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { StackActions } from "@react-navigation/native";

export default function AdminDashboard({ route, navigation }) {
  async function Logout() {
    await Storage.removeItem({ key: "currentUser" });
    navigation.navigate("LoginScreen");
  }
  return (
    <SafeAreaView className="bg-slate-50">
      <View className="flex flex-row p-6 w-full ">
        <Text className="text-5xl font-bold mb-6 text-slate-900 -ml-2">
          Admin Dashboard
        </Text>
        <View className="-mt-2 -ml-6">
          <Pressable
            className="h-12 bg-purple-500 rounded-md flex flex-row justify-center items-center px-1 ml-8"
            onPress={async () => {
              await Logout();
              navigation.dispatch(StackActions.replace("LoginScreen"));
            }}
          >
            <Text className="text-white text-base font-medium">Logout</Text>
          </Pressable>

          <Pressable
            className="h-12 bg-purple-500 rounded-md flex flex-row justify-center items-center px-1 ml-8 mt-2"
            onPress={() => {
              navigation.dispatch(StackActions.replace("Dashboard"));
            }}
          >
            <Text className="text-white text-base font-medium">
              Project Dashboard
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Create a divider */}
      <View className="w-full h-1 bg-slate-200 -mt-10" />

      <AddUser />
    </SafeAreaView>
  );
}
