// In App.js in a new project

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./Screen/LoginScreen";
import Dashboard from "./Screen/Dashboard";
import AdminDashboard from "./Screen/AdminDashboard";
import ProjectContext from "./State/ProjectContext.js";
import ProjectScreen from "./Screen/ProjectScreen";
import TaskScreen from "./Screen/TaskScreen";

const Stack = createNativeStackNavigator();

function App() {
  const [projects, setProjects] = React.useState([]);

  return (
    <ProjectContext.Provider value={{ projects, setProjects }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              headerBackVisible: false,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{
              headerBackVisible: false,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AdminDashboard"
            component={AdminDashboard}
            options={{
              headerBackVisible: false,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ProjectScreen"
            component={ProjectScreen}
            options={{
              headerBackVisible: false,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TaskScreen"
            component={TaskScreen}
            options={{
              headerBackVisible: false,
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ProjectContext.Provider>
  );
}

export default App;
