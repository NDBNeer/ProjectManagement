import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  SafeAreaView,
  FlatList,
} from "react-native";
import ProjectContext, { fetchProjects } from "../State/ProjectContext.js";
import TaskCard from "../Components/TaskCard.js";
import AddTask from "../Components/AddTask.js";
import { projectRouteURL } from "../constraints/urls.js";

export default function ProjectScreen({ route, navigation }) {
  const { projectId } = route.params;
  const { projects, setProjects } = useContext(ProjectContext);

  const [date, setDate] = useState(new Date());

  const projectIndex = projects.findIndex(
    (project) => project._id === projectId
  );
  const [project, setProject] = React.useState(projects[projectIndex]);
  //   console.log(project);

  const renderItem = ({ item }) => (
    <TaskCard taskId={item._id} navigation={navigation} projectId={projectId} />
  );

  React.useEffect(() => {
    async function getProject() {}
    getProject();
  }, []);

  async function updateProject() {
    const newProjectModel = {
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
    };

    const response = await fetch(projectRouteURL + "/" + project._id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProjectModel),
    }).catch((err) => {
      alert("Project Update Failed" + err);
    });

    const data = await response.json();
    console.log(data);
    if (data.status === 200) {
      alert("Project Updated");
    } else {
      alert("Project Update Failed");
    }
  }

  return (
    <SafeAreaView>
      <ScrollView className="w-full">
        <View className="flex flex-col items-center justify-center bg-slate-50">
          <View className="flex flex-row p-2 w-full items-center justify-between">
            <Pressable
              className="h-10 rounded-md flex flex-row justify-center items-center p-2 ml-2"
              onPress={() => {
                navigation.navigate("Dashboard");
              }}
            >
              <Text className="text-blue-400 text-md font-medium">Home</Text>
            </Pressable>
            <Text className="p-2 h-10  mt-4  -ml-12 text-xl font-bold mb-6 text-slate-900">
              {project.name}
            </Text>
            <View />
          </View>
        </View>
        {/* Create a divider */}
        <View className="w-full h-1 bg-slate-200" />

        {/* Project Desciption */}
        <View className="items-center justify-center bg-slate-50">
          <View className="p-8 w-full">
            <View className="flex flex-row items-center justify-center">
              <Text className="w-1/3 text-sm font-bold mb-6 text-slate-900">
                Project Description
              </Text>
              <TextInput
                className="w-2/3 bg-white border border-slate-200 rounded-md h-24 px-4 mb-4"
                placeholderTextColor="#000"
                placeholder="Enter the project description"
                multiline={true}
                numberOfLines={4}
                value={project.description}
                onChangeText={(text) =>
                  setProject({ ...project, description: text })
                }
              />
            </View>

            <View className="flex flex-row items-center justify-center">
              <Text className="w-1/3 text-sm font-bold mb-6 text-slate-900">
                Start Date
              </Text>
              <TextInput
                className="w-2/3 bg-white border border-slate-200 rounded-md h-12 px-4 mb-4"
                placeholderTextColor="#000"
                placeholder="Enter the start date"
                value={project.startDate}
                onChangeText={(text) =>
                  setProject({ ...project, startDate: text })
                }
              />
              {/* <RNDateTimePicker mode="time" /> */}
            </View>

            <View className="flex flex-row items-center justify-center">
              <Text className="w-1/3 text-sm font-bold mb-6 text-slate-900">
                End Date
              </Text>
              <TextInput
                className="w-2/3 bg-white border border-slate-200 rounded-md h-12 px-4 mb-4"
                placeholderTextColor="#000"
                placeholder="Enter the end date"
                value={project.endDate}
                onChangeText={(text) =>
                  setProject({ ...project, endDate: text })
                }
              />
            </View>

            <View className="flex flex-row items-center justify-center">
              <Text className="w-1/3 text-sm font-bold mb-6 text-slate-900">
                Status
              </Text>
              <TextInput
                className="w-2/3 bg-white border border-slate-200 rounded-md h-12 px-4 mb-4"
                placeholderTextColor="#000"
                placeholder="Enter the status"
                // make readonly
                editable={false}
                value={project.status}
              />
            </View>

            <View className="flex flex-row items-center justify-center">
              <Text className="w-1/3 text-sm font-bold mb-6 text-slate-900">
                Cost
              </Text>
              <TextInput
                className="w-2/3 bg-white border border-slate-200 rounded-md h-12 px-4 mb-4"
                placeholderTextColor="#000"
                placeholder="Enter the cost"
                editable={false}
                value={project.cost.toString()}
              />
            </View>

            <Pressable
              className="h-12 bg-purple-500 rounded-md flex flex-row justify-center items-center px-6 mt-4"
              onPress={updateProject}
            >
              <View className="flex-1 flex items-center">
                <Text className="text-white text-base font-medium">
                  Update Project
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Create a divider */}
        <View className="w-full h-1 bg-slate-200" />

        <AddTask projectId={projectId} />

        {/* Create a divider */}
        <View className="w-full h-1 bg-slate-200" />

        {/* <FlatList
          className="w-full"
          data={projects[projectIndex].tasks}
          renderItem={renderItem}
          keyExtractor={(task) => task._id.toString()}
        /> */}

        {/* //Map projects with project card */}
        {projects[projectIndex]?.tasks.map((task) => (
          <TaskCard
            key={task._id}
            taskId={task._id}
            navigation={navigation}
            projectId={projectId}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
