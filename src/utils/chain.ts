import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import type { ModelSettings } from "./types";
import { GPT_35_TURBO } from "./constants";

type Task = {
  task: string;
  completed: boolean;
};

export const createModel = (settings: ModelSettings) =>
  new OpenAI({
    openAIApiKey:
      settings.customApiKey === ""
        ? process.env.OPENAI_API_KEY
        : settings.customApiKey,
    temperature: settings.customTemperature || 0.9,
    modelName:
      settings.customModelName === "" ? GPT_35_TURBO : settings.customModelName,
    maxTokens: 750,
  });

const startGoalPrompt = new PromptTemplate({
  template:
    "You are an autonomous task creation AI called AgentGPT. You have the following objective `{goal}`. Create a list of zero to three tasks to be completed by your AI system such that your goal is more closely reached or completely reached. Return the response as a JSON-formatted array of task objects, where each object has a 'task' property (string) and a 'completed' property (boolean, set to false).",
  inputVariables: ["goal"],
});

export const startGoalAgent = async (model: OpenAI, goal: string) => {
  return await new LLMChain({
    llm: model,
    prompt: startGoalPrompt,
  }).call({
    goal,
  });
};

const executeTaskPrompt = new PromptTemplate({
  template:
    "You are an autonomous task execution AI called AgentGPT. You have the following objective `{goal}`. You have the following task `{task}` with 'completed' property set to `{completed}`. Execute the task and return the response as a string.",
  inputVariables: ["goal", "task"],
});

export const executeTaskAgent = async (
  model: OpenAI,
  goal: string,
  task: Task
) => {
  return await new LLMChain({ llm: model, prompt: executeTaskPrompt }).call({
    goal,
    task: JSON.stringify(task),
  });
};

const createTaskPrompt = new PromptTemplate({
  template:
    "You are an AI task creation agent. You have the following objective `{goal}` and the following incomplete tasks `{tasks}` (array of task objects). You have just executed the following task `{lastTask}` and received the following result `{result}` (string). Based on this, create a new task to be completed by your AI system ONLY IF NEEDED such that your goal is more closely reached or completely reached. Return the response as a JSON-formatted array of task objects, where each object has a 'task' property (string) and a 'completed' property (boolean, set to false). Return an empty array if no new task is needed.",
  inputVariables: ["goal", "tasks", "lastTask", "result"],
});

export const executeCreateTaskAgent = async (
  model: OpenAI,
  goal: string,
  tasks: Task[],
  lastTask: Task,
  result: string
) => {
  return await new LLMChain({ llm: model, prompt: createTaskPrompt }).call({
    goal,
    tasks: JSON.stringify(tasks),
    lastTask: JSON.stringify(lastTask),
    result,
  });
};

export const extractTasks = (input: string): Task[] => {
  const regex = /(\[.*\])/;
  const match = input.match(regex);

  if (match && match[0]) {
    try {
      return JSON.parse(match[0]) as Task[];
    } catch (error) {
      console.error("Error parsing the matched tasks:", error);
    }
  }

  console.warn("Error, could not extract tasks from inputString:", input);
  return [];
};

// Filter tasks that don't require any action
export const realTasksFilter = (tasks: Task[]): Task[] => {
  return tasks.filter(
    (task) =>
      !/^No( (new|further|additional|extra|other))? tasks? (is )?(required|needed|added|created|inputted).*$/i.test(
        task.task
      ) &&
      !/^Task (complete|completed|finished|done|over|success).*/i.test(
        task.task
      ) &&
      !/^(\s*|Do nothing(\s.*)?)$/i.test(task.task)
  );
};
