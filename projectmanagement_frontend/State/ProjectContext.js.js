import { createContext } from "react";
import { projectRouteURL } from "../constraints/urls";

const ProjectContext = createContext();

export async function fetchProjects() {
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

export default ProjectContext;
