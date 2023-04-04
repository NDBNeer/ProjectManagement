import { createContext } from "react";
import { projectRouteURL } from "../constraints/urls";
import { Storage } from "expo-storage";

const ProjectContext = createContext();

export async function fetchProjects() {
  const currentUser = JSON.parse(await Storage.getItem({ key: "currentUser" }));

  if (currentUser.type === "admin") {
    const response = await fetch(projectRouteURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => {
      console.log(err);
    });
    const data = await response.json();

    return data.data;
  }
  const url = projectRouteURL + "/assosicatedProjects";
  console.log(url);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: currentUser._id,
    }),
  }).catch((err) => {
    console.log(err);
  });
  const data = await response.json();
  return data.data;
}

export default ProjectContext;
