import React, { useContext } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { projectRouteURL } from "../constraints/urls";
import ProjectContext, { fetchProjects } from "../State/ProjectContext.js";

export default function AddProject() {
  const { projects, setProjects } = useContext(ProjectContext);
  const [projectName, setProjectName] = React.useState("");

  async function refetchProjects() {
    const projects = await fetchProjects();
    setProjects(projects);
  }

  async function addProject() {
    const response = await fetch(projectRouteURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectName,
        description: "Please update the description",
        // setting the start date to today in dd/mm/yyyy format
        startDate: new Date().toLocaleDateString(),
        // setting the end date to 14 day after the start date
        endDate: new Date(
          new Date().getTime() + 14 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
      }),
    }).catch((err) => {
      console.log(err);
    });
    alert("Project Added Successfully");

    refetchProjects();
    setProjectName("");
  }

  return (
    <View className="p-8 w-full">
      <Text className="text-3xl font-bold mb-6 text-slate-900">
        Create Project
      </Text>
      <TextInput
        className="w-full bg-white border border-slate-200 rounded-md h-12 px-4 mb-4"
        placeholderTextColor="#000"
        placeholder="Enter Project Name"
        value={projectName}
        onChangeText={(text) => setProjectName(text)}
      />
      <Pressable
        className="h-12 bg-purple-500 rounded-md flex flex-row justify-center items-center px-6 mt-4"
        onPress={addProject}
      >
        <View className="flex-1 flex items-center">
          <Text className="text-white text-base font-medium">Add Project</Text>
        </View>
      </Pressable>
    </View>
  );
}
