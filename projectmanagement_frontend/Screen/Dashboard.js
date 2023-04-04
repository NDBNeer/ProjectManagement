import React, { useContext } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  FlatList,
  SafeAreaView,
} from "react-native";
import AddProject from "../Components/AddProject";
import ProjectCard from "../Components/ProjectCard";
import { projectRouteURL } from "../constraints/urls";
import ProjectContext, { fetchProjects } from "../State/ProjectContext.js";

export default function Dashboard({ route, navigation }) {
  const { projects, setProjects } = useContext(ProjectContext);
  const renderItem = ({ item }) => (
    <ProjectCard projectId={item._id} navigation={navigation} />
  );

  React.useEffect(() => {
    async function getProjects() {
      const projects = await fetchProjects();
      setProjects(projects);
    }
    getProjects();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView className="w-full">
        <View className="flex flex-col items-center justify-center bg-slate-50">
          <View className="flex flex-row p-6 w-full ">
            <Text className="text-5xl font-bold mb-6 text-slate-900">
              Project Dashboard
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
          {/* Create a divider */}
          <View className="w-full h-1 bg-slate-200 -mt-10" />

          <AddProject />

          {/* Create a divider */}
          <View className="w-full h-1 bg-slate-200" />

          {/* Create a divider */}
          {/* Create a flat list and map all the project with project card */}

          {/* <FlatList
            className="w-full"
            data={projects}
            renderItem={renderItem}
            keyExtractor={(project) => project._id.toString()}
          /> */}

          {/* // map projects to project card */}
          {projects.map((project) => (
            <ProjectCard
              projectId={project._id}
              navigation={navigation}
              key={project._id}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
