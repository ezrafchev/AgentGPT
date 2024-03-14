import { ModelSettings } from "./types";

export interface RequestBody {
  modelSettings: ModelSettings;
  goal: string;
  metadata?: {
    task?: string;
    tasks?: string[];
    lastTask?: string;
    result?: string;
    completedTasks?: string[];
  };
}

// Example usage:
const requestBody: RequestBody = {
  modelSettings: { /* ModelSettings object */ },
  goal: "some goal",
  metadata: {
    task: "some task",
    tasks: ["task1", "task2"],
    lastTask: "last task",
    result: "some result",
    completedTasks: ["task1"],
  },
};
