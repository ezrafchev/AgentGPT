import { ZodTypeAny, StructuredOutputParser } from "langchain/output_parsers";

// Define custom enums for action type and task status
export enum ActionType {
  Question = "Question",
  Respond = "Respond",
}

export enum TaskStatus {
  InProgress = "InProgress",
  Completed = "Completed",
}

// Create Zod schemas for action and task objects
const actionSchema: ZodTypeAny = z.object({
  action: z.nativeEnum(ActionType).describe(
    `The action to take, either '${ActionType.Question}' or '${ActionType.Respond}'`
  ),
  arg: z.string().describe("The argument to the action"),
});

const taskSchema: ZodTypeAny = z.object({
  task: z.string().describe("The task to be completed"),
  status: z.nativeEnum(TaskStatus).describe("The status of the task"),
});

const tasksSchema: ZodTypeAny = z.array(taskSchema).describe("A list of tasks to complete");

// Initialize the parsers
export const actionParser = StructuredOutputParser.fromZodSchema(actionSchema);
export const tasksParser = StructuredOutputParser.fromZodSchema(tasksSchema);
