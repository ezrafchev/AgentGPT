import type { NextRequest, NextResponse } from "next/server";
import type { RequestBody } from "../../utils/interfaces";
import { startAgent } from "../../services/agent-service";

export const config = {
  runtime: "edge",
};

const handler = async (request: NextRequest) => {
  if (request.method !== "POST") {
    return new NextResponse("Method not allowed", { status: 405 });
  }

  try {
    const jsonBody = await request.json();
    if (!jsonBody || !("modelSettings" in jsonBody && "goal" in jsonBody)) {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    const { modelSettings, goal } = jsonBody as RequestBody;
    const newTasks = await startAgent(modelSettings, goal);
    return new NextResponse.json({ newTasks });
  } catch (error) {
    console.error("Error handling request:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export default handler;
