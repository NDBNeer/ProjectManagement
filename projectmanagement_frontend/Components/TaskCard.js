import React, { useContext, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import ProjectContext, { fetchProjects } from "../State/ProjectContext.js";
import { StackActions } from "@react-navigation/native";

export default function TaskCard({ navigation, projectId, taskId }) {
  const { projects, setProjects } = useContext(ProjectContext);
  const [task, setTask] = React.useState(null);

  React.useEffect(() => {
    async function getProject() {
      const projects = await fetchProjects();
      // looping through projects and checking if the project id matches the id of the project we are looking for
      const project = projects.find((project) => project._id === projectId);

      // looping through tasks and checking if the task id matches the id of the task we are looking for
      const task = project.tasks.find((task) => task._id === taskId);
      setTask(task);
    }
    getProject();
  }, []);

  return (
    <View className="flex flex-col w-full border-2 border-slate-300 p-2">
      <View className="flex flex-row w-full items-center justify-between bg-white rounded-md p-4 mb-4">
        <View className="flex flex-col">
          <Text className="text-xl font-bold text-slate-900">{task?.name}</Text>
        </View>
        <View className="flex flex-row items-center">
          <Pressable
            className="h-12 bg-purple-500 rounded-md flex flex-row justify-center items-center px-6 mr-4"
            onPress={() => {
              navigation.dispatch(
                StackActions.replace("TaskScreen", {
                  taskId: task._id,
                  projectId: projectId,
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
            onPress={() => {}}
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
            <Text className="text-base text-slate-900">{task?.startDate}</Text>
          </View>
          <View className="flex flex-col border-2 border-slate-100 p-3 items-center justify-center mt-2">
            <Text className="text-md font-bold text-slate-900">Status</Text>
            <Text className="text-base text-slate-900">{task?.status}</Text>
          </View>
        </View>

        <View className="flex flex-col items-center justify-center">
          <View className="flex flex-col border-2 border-slate-100 p-3 items-center justify-center">
            <Text className="text-md font-bold text-slate-900">End Date</Text>
            <Text className="text-base text-slate-900">{task?.endDate}</Text>
          </View>
          <View className="flex flex-col border-2 border-slate-100 p-3 items-center justify-center mt-2">
            <Text className="text-md font-bold text-slate-900">Cost</Text>
            <Text className="text-base text-slate-900">
              {task?.totalHoursWorked * task?.hourlyRate}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
