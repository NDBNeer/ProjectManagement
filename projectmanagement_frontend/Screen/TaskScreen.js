import React, { useContext } from "react";
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
import { StackActions } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { allUserRouteURL, taskRouteURL } from "../constraints/urls.js";
import { Storage } from "expo-storage";

export default function TaskScreen({ route, navigation }) {
  const { taskId, projectId } = route.params;

  const { projects, setProjects } = useContext(ProjectContext);
  const [assosicatedTask, setAssosicatedTask] = React.useState("None");

  const projectIndex = projects.findIndex(
    (project) => project._id === projectId
  );
  const project = projects[projectIndex];
  const [task, setTask] = React.useState(
    project.tasks.find((task) => task._id === taskId)
  );
  // console.log(task);

  const [assignees, setAssignees] = React.useState([
    { label: "None", value: null },
  ]);

  const [assosiateTasks, setAssosiateTasks] = React.useState([
    { label: "None", value: 0 },
    ...project.tasks
      .filter((task) => task._id !== taskId)
      .map((task) => {
        return { label: task.name, value: task._id };
      }),
  ]);

  const [isUserAdmin, setIsUserAdmin] = React.useState(false);

  React.useEffect(() => {
    async function fetchAssignees() {
      const response = await fetch(allUserRouteURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((err) => {
        console.log(err);
      });
      const data = await response.json();
      console.log(data.data);
      // mapping all the users whose role is not admin
      const assignees = data.data
        .filter((user) => user.type !== "admin")
        .map((user) => {
          return { label: user.name, value: user._id };
        });
      setAssignees([{ label: "None", value: null }, ...assignees]);
    }
    async function getCurrentUser() {
      const value = JSON.parse(await Storage.getItem({ key: "currentUser" }));
      if (value != null) {
        console.log(value.type);
        value.type.toString() === "admin"
          ? setIsUserAdmin(true)
          : setIsUserAdmin(false);
      }
    }
    getCurrentUser();

    fetchAssignees();
  }, []);

  async function updateTask() {
    const newTaskModel = {
      name: task.name,
      description: task.description,
      startDate: task.startDate,
      endDate: task.endDate,
      status: task.status,
      assignee: task.assignee,
      assosicatedTask: task.assosicatedTask,
      hourlyRate: task.hourlyRate,
      totalHoursWorked: task.totalHoursWorked,
      project: projectId,
    };

    const response = await fetch(taskRouteURL + "/" + task._id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTaskModel),
    }).catch((err) => {
      alert("Task Update Failed" + err);
    });

    const data = await response.json();
    console.log(data);
    if (data.status === 200) {
      await fetchProjects().then((projects) => {
        setProjects(projects);
      });
      alert("Task Updated");
    } else {
      alert("Task Update Failed");
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
                navigation.dispatch(
                  StackActions.replace("ProjectScreen", {
                    projectId: projectId,
                  })
                );
              }}
            >
              <Text className="text-blue-400 text-md font-medium">Back</Text>
            </Pressable>
            <Text className="p-2 h-10  mt-4  -ml-12 text-xl font-bold mb-6 text-slate-900">
              Task Name
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
                Task Description
              </Text>
              <TextInput
                className="w-2/3 bg-white border border-slate-200 rounded-md h-24 px-4 mb-4"
                placeholderTextColor="#000"
                placeholder="Enter the task description"
                multiline={true}
                numberOfLines={4}
                value={task.description}
                onChangeText={(text) => {
                  setTask({ ...task, description: text });
                }}
                editable={isUserAdmin}
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
                value={task.startDate}
                editable={isUserAdmin}
                onChangeText={(text) => {
                  setTask({ ...task, startDate: text });
                }}
              />
            </View>

            <View className="flex flex-row items-center justify-center">
              <Text className="w-1/3 text-sm font-bold mb-6 text-slate-900">
                End Date
              </Text>
              <TextInput
                className="w-2/3 bg-white border border-slate-200 rounded-md h-12 px-4 mb-4"
                placeholderTextColor="#000"
                placeholder="Enter the end date"
                value={task.endDate}
                onChangeText={(text) => {
                  setTask({ ...task, endDate: text });
                }}
              />
            </View>

            <View className="flex flex-row items-center justify-center">
              <Text className="w-1/3 text-sm font-bold mb-6 text-slate-900">
                Status
              </Text>
              <View className="m-1 w-2/3 z-50">
                <Picker
                  selectedValue={task.status}
                  onValueChange={(itemValue, itemIndex) =>
                    setTask({ ...task, status: itemValue })
                  }
                >
                  <Picker.Item label="Pending" value="Pending" />
                  <Picker.Item label="In Progress" value="In Progress" />
                  <Picker.Item label="Completed" value="Completed" />
                </Picker>
              </View>
            </View>

            {isUserAdmin ? (
              <View className="flex flex-row items-center justify-center">
                <Text className="w-1/3 text-sm font-bold mb-6 text-slate-900">
                  Associated Task
                </Text>
                <View className="m-1 w-2/3 z-50">
                  <Picker
                    selectedValue={
                      task.assosicatedTask ? task.assosicatedTask : "None"
                    }
                    onValueChange={(itemValue, itemIndex) =>
                      setTask({ ...task, assosicatedTask: itemValue })
                    }
                  >
                    {assosiateTasks.map((assosiateTask) => (
                      <Picker.Item
                        label={assosiateTask.label}
                        value={assosiateTask.value}
                        key={assosiateTask.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            ) : assosiateTasks.length > 0 ? (
              <View className="flex flex-row items-center justify-center">
                <Text className="w-1/3 text-sm font-bold mb-6 text-slate-900">
                  Associated Task
                </Text>
                <TextInput
                  className="w-2/3 bg-white border border-slate-200 rounded-md h-12 px-4 mb-4"
                  placeholderTextColor="#000"
                  placeholder="No Associated Task"
                  editable={false}
                  value={task.assosicatedTask}
                ></TextInput>
              </View>
            ) : null}

            {isUserAdmin ? (
              <View className="flex flex-row items-center justify-center">
                <Text className="w-1/3 text-sm font-bold mb-6 text-slate-900">
                  Assignee
                </Text>
                <View className="m-1 w-2/3 z-50">
                  <Picker
                    selectedValue={task.assignee ? task.assignee : "None"}
                    onValueChange={(itemValue, itemIndex) =>
                      setTask({ ...task, assignee: itemValue })
                    }
                  >
                    {assignees.map((assignee) => (
                      <Picker.Item
                        label={assignee.label}
                        value={assignee.value}
                        key={assignee.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            ) : null}

            {/* {task.assignee?.length > 0 && !isUserAdmin ? (
              <View className="flex flex-row items-center justify-center">
                <Text className="w-1/3 text-sm font-bold mb-6 text-slate-900">
                  Assignee
                </Text>
                <View className="m-1 w-2/3 z-50">
                  <Picker
                    selectedValue={task.status}
                    onValueChange={(itemValue, itemIndex) =>
                      setTask({ ...task, status: itemValue })
                    }
                  >
                    {isUserAdmin
                      ? assignees.map((assignee) => (
                          <Picker.Item
                            label={assignee.label}
                            value={assignee.value}
                            key={assignee.value}
                          />
                        ))
                      : null}
                  </Picker>
                </View>
              </View>
            ) : null} */}

            <View className="flex flex-row items-center justify-center">
              <Text className="w-1/3 text-sm font-bold mb-6 text-slate-900">
                Hourly Rate
              </Text>
              <TextInput
                className="w-2/3 bg-white border border-slate-200 rounded-md h-12 px-4 mb-4"
                placeholderTextColor="#000"
                placeholder="Enter the hourly rate"
                value={task.hourlyRate.toString()}
                onChangeText={(text) => {
                  setTask({ ...task, hourlyRate: text });
                }}
              />
            </View>
            <View className="flex flex-row items-center justify-center">
              <Text className="w-1/3 text-sm font-bold mb-6 text-slate-900">
                Total Hours Worked
              </Text>
              <TextInput
                className="w-2/3 bg-white border border-slate-200 rounded-md h-12 px-4 mb-4"
                placeholderTextColor="#000"
                placeholder="Enter the hourly rate"
                value={task.totalHoursWorked.toString()}
                onChangeText={(text) => {
                  setTask({ ...task, totalHoursWorked: text });
                }}
              />
            </View>

            <Pressable
              className="h-12 bg-purple-500 rounded-md flex flex-row justify-center items-center px-6 mt-4"
              onPress={updateTask}
            >
              <View className="flex-1 flex items-center">
                <Text className="text-white text-base font-medium">
                  Update Task
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
