import React, { useContext } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { taskRouteURL } from "../constraints/urls";
import ProjectContext, { fetchProjects } from "../State/ProjectContext.js";

export default function AddTask({ projectId }) {
  const { projects, setProjects } = useContext(ProjectContext);
  const [taskName, setTaskName] = React.useState("");

  async function refetchProjects() {
    const projects = await fetchProjects();
    setProjects(projects);
  }

  async function addTask() {
    const task = {
      name: taskName,
      description: "",
      status: "Pending",
      // setting the start date to today in dd/mm/yyyy format
      startDate: new Date().toLocaleDateString(),
      endDate: new Date().toLocaleDateString(),
      totalHoursWorked: 0,
      hourlyRate: 0,
      project: projectId,
    };
    console.log(task);
    const response = await fetch(taskRouteURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    }).catch((err) => {
      console.log(err);
    });

    console.log(await response.json());
    alert("Task Added Successfully");

    refetchProjects();
    setTaskName("");
  }

  return (
    <View className="p-8 w-full">
      <Text className="text-3xl font-bold mb-6 text-slate-900">
        Create Task
      </Text>
      <TextInput
        className="w-full bg-white border border-slate-200 rounded-md h-12 px-4 mb-4"
        placeholderTextColor="#000"
        placeholder="Enter Task Name"
        value={taskName}
        onChangeText={(text) => setTaskName(text)}
      />
      <Pressable
        className="h-12 bg-purple-500 rounded-md flex flex-row justify-center items-center px-6 mt-4"
        onPress={addTask}
      >
        <View className="flex-1 flex items-center">
          <Text className="text-white text-base font-medium">Add Task</Text>
        </View>
      </Pressable>
    </View>
  );
}
