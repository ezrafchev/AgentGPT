import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { RequestBody } from "../../utils/interfaces";
import { createAgent } from "../../services/agent-service";

export const config = {
  runtime: "edge",
};

const handler = async (request: NextRequest) => {
  if (request.method !== "POST") {
    return new NextResponse("Method not allowed", { status: 405 });
  }

  try {
    const jsonBody = await request.json();
    if (!jsonBody || !isValidRequestBody(jsonBody)) {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    const { modelSettings, goal, tasks, lastTask, result, completedTasks } =
      jsonBody as RequestBody;

    const newTasks = await createAgent(
      modelSettings,
      goal,
      tasks,
      lastTask,
      result,
      completedTasks
    );

    return NextResponse.json({ newTasks });
  } catch (error) {
    console.error("Error handling request:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

const isValidRequestBody = (body: unknown): body is RequestBody => {
  if (typeof body !== "object" || body === null) return false;
  const keys = ["modelSettings", "goal", "tasks", "lastTask", "result", "completedTasks"] as const;
  return keys.every(key => key in body);
};

export default handler;
