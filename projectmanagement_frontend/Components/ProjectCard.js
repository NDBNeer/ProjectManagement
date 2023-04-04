import React, { useContext, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { projectRouteURL } from "../constraints/urls";
import ProjectContext, { fetchProjects } from "../State/ProjectContext.js";
import { StackActions } from "@react-navigation/native";

export default function ProjectCard({ navigation, projectId }) {
  const { projects, setProjects } = useContext(ProjectContext);
  const [project, setProject] = useState(null);

  React.useEffect(() => {
    async function getProject() {
      const projects = await fetchProjects();
      // looping through projects and checking if the project id matches the id of the project we are looking for
      const project = projects.find((project) => project._id === projectId);
      setProject(project);
    }
    getProject();
  }, []);

  async function deleteProject() {
    const response = await fetch(projectRouteURL + "/" + project._id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => {
      alert("Project Delete Failed" + err);
    });

    const data = await response.json();
    console.log(data);
    if (data.status === 200) {
      await fetchProjects().then((projects) => {
        setProjects(projects);
      });
      alert("Project Deleted");
    } else {
      alert("Project Delete Failed");
    }
  }

  return (
    <View className="flex flex-col w-full border-2 border-slate-300 p-2">
      <View className="flex flex-row w-full items-center justify-between bg-white rounded-md p-4 mb-4">
        <View className="flex flex-col">
          <Text className="text-xl font-bold text-slate-900">
            {project?.name}
          </Text>
        </View>
        <View className="flex flex-row items-center">
          <Pressable
            className="h-12 bg-purple-500 rounded-md flex flex-row justify-center items-center px-6 mr-4"
            onPress={() => {
              navigation.dispatch(
                StackActions.replace("ProjectScreen", {
                  projectId: project._id,
                })
              );
            }}
          >
            <View className="flex-1 flex items-center">
              <Text className="text-white text-center text-xs font-medium w-12">
                Edit
              </Text>
            </View>
          </Pressable>
          <Pressable
            className="h-12 bg-red-500 rounded-md flex flex-row justify-center items-center px-6"
            onPress={deleteProject}
          >
            <View className="flex-1 flex items-center">
              <Text className="text-white text-center text-xs font-medium w-12">
                Delete
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Create a divider */}
      <View className="w-full h-1 bg-slate-200" />

      {/* Create a Row to show start date, end date status and overall cost of the project */}
      <View className="flex flex-row w-full items-stretch justify-evenly bg-white rounded-md p-4 mb-4">
        <View className="flex flex-col items-center justify-center">
          <View className="flex flex-col border-2 border-slate-100 p-3 items-center justify-center">
            <Text className="text-md font-bold text-slate-900">Start Date</Text>
            <Text className="text-base text-slate-900">
              {project?.startDate}
            </Text>
          </View>
          <View className="flex flex-col border-2 border-slate-100 p-3 items-center justify-center mt-2">
            <Text className="text-md font-bold text-slate-900">Status</Text>
            <Text className="text-base text-slate-900">{project?.status}</Text>
          </View>
        </View>

        <View className="flex flex-col items-center justify-center">
          <View className="flex flex-col border-2 border-slate-100 p-3 items-center justify-center">
            <Text className="text-md font-bold text-slate-900">End Date</Text>
            <Text className="text-base text-slate-900">
              {project?.startDate}
            </Text>
          </View>
          <View className="flex flex-col border-2 border-slate-100 p-3 items-center justify-center mt-2">
            <Text className="text-md font-bold text-slate-900">Cost</Text>
            <Text className="text-base text-slate-900">{project?.cost}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
