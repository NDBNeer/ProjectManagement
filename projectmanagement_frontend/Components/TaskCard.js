import React, { useContext, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import ProjectContext, { fetchProjects } from "../State/ProjectContext.js";
import { StackActions } from "@react-navigation/native";
import { Storage } from "expo-storage";
import { taskRouteURL } from "../constraints/urls.js";

export default function TaskCard({ navigation, projectId, taskId }) {
  const { projects, setProjects } = useContext(ProjectContext);
  const [task, setTask] = React.useState(null);
  const [isUserAdmin, setIsUserAdmin] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [isTaskLate, setIsTaskLate] = React.useState(false);

  React.useEffect(() => {
    async function getProject() {
      const projects = await fetchProjects();
      // looping through projects and checking if the project id matches the id of the project we are looking for
      const project = projects.find((project) => project._id === projectId);

      // looping through tasks and checking if the task id matches the id of the task we are looking for
      const task = project.tasks.find((task) => task._id === taskId);
      // if task end date has less than 7 days left, set isTaskLate to true
      if (new Date(task.endDate) - Date.now() < 604800000) {
        console.log("task is late");
        setIsTaskLate(true);
      }

      setTask(task);
    }
    async function getCurrentUser() {
      const value = JSON.parse(await Storage.getItem({ key: "currentUser" }));
      if (value != null) {
        console.log(value.type);
        value.type.toString() === "admin"
          ? setIsUserAdmin(true)
          : setIsUserAdmin(false);
        setCurrentUser(value);
      }
    }
    getCurrentUser();
    getProject();
  }, []);

  async function deleteTask() {
    const response = await fetch(taskRouteURL + "/" + task._id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => {
      alert("Task Delete Failed" + err);
    });

    const data = await response?.json();
    console.log(data);
    if (data.status === 200) {
      await fetchProjects().then((projects) => {
        setProjects(projects);
      });
      alert("Task Deleted");
    } else {
      alert("Task Delete Failed");
    }
  }

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
              if (isUserAdmin) {
                navigation.dispatch(
                  StackActions.replace("TaskScreen", {
                    taskId: task._id,
                    projectId: projectId,
                  })
                );
              } else {
                if (currentUser._id === task.assignee) {
                  // so you are the assignee now you have to check if the associated task is completed or not
                  // if it is completed then you can't edit it

                  const assosiatedProject = projects.find(
                    (project) => project._id === projectId
                  );
                  const assosiateTask = assosiatedProject.tasks.find(
                    (searchTask) => searchTask._id === task.assosicatedTask
                  );

                  if (assosiateTask?.status === "Completed") {
                    return navigation.dispatch(
                      StackActions.replace("TaskScreen", {
                        taskId: task._id,
                        projectId: projectId,
                      })
                    );
                  } else {
                    // check if we dont have assosiated task
                    if (task.assosicatedTask === undefined) {
                      return navigation.dispatch(
                        StackActions.replace("TaskScreen", {
                          taskId: task._id,
                          projectId: projectId,
                        })
                      );
                    }
                    alert(
                      "Associated Task is not completed, you cannot view the task"
                    );
                  }
                } else {
                  alert("You are not assigned to this task");
                }
              }
            }}
          >
            <View className="flex-1 flex items-center">
              <Text className="text-white text-center text-xs font-medium w-12">
                {isUserAdmin ? "Edit" : "View"}
              </Text>
            </View>
          </Pressable>
          {isUserAdmin ? (
            <Pressable
              className="h-12 bg-red-500 rounded-md flex flex-row justify-center items-center px-6"
              onPress={deleteTask}
            >
              <View className="flex-1 flex items-center">
                <Text className="text-white text-center text-xs font-medium w-12">
                  Delete
                </Text>
              </View>
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Create a divider */}
      <View
        className={
          isTaskLate
            ? "w-full h-1 bg-red-500"
            : task?.status === "Completed"
            ? "w-full h-1 bg-green-500"
            : "w-full h-1 bg-yellow-500"
        }
      />

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
