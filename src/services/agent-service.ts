import {
  createModel,
  executeCreateTaskAgent,
  executeTaskAgent,
  extractArray,
  realTasksFilter,
  startGoalAgent,
} from "../utils/chain";
import type { ModelSettings } from "../utils/types";

export async function startAgent(modelSettings: ModelSettings, goal: string): Promise<string[]> {
  try {
    const completion = await startGoalAgent(createModel(modelSettings), goal);
    if (completion.type !== 'success') {
      throw new Error('Start goal agent failed');
    }
    console.log(typeof completion.text);
    console.log("Completion:", completion.text);
    return extractArray(completion.text).filter(realTasksFilter);
  } catch (error) {
    console.error('Error in startAgent:', error);
    return [];
  }
}

export async function createAgent(
  modelSettings: ModelSettings,
  goal: string,
  tasks: string[],
  lastTask: string,
  result: string,
  completedTasks?: string[]
): Promise<string[]> {
  try {
    const completion = await executeCreateTaskAgent(
      createModel(modelSettings),
      goal,
      tasks,
      lastTask,
      result
    );

    if (completion.type !== 'success') {
      throw new Error('Create task agent failed');
    }

    const taskArray = extractArray(completion.text);
    const filteredTasks = taskArray.filter(realTasksFilter);
    if (completedTasks) {
      return filteredTasks.filter((task) => !completedTasks.includes(task));
    } else {
      return filteredTasks;
    }
  } catch (error) {
    console.error('Error in createAgent:', error);
    return [];
  }
}

export async function executeAgent(

