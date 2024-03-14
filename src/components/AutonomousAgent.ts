import type { Message } from "./ChatWindow";
import type { AxiosError } from "axios";
import axios from "axios";
import type { ModelSettings } from "../utils/types";
import {
  DEFAULT_MAX_LOOPS,
  DEFAULT_MAX_LOOPS_FREE,
} from "../utils/constants";
import {
  createAgent,
  executeAgent,
  startAgent,
} from "../services/agent-service";

class AutonomousAgent {
  private name: string;
  private goal: string;
  private tasks: string[];
  private completedTasks: string[];
  private modelSettings: ModelSettings;
  private isRunning: boolean;
  private renderMessage: (message: Message) => void;
  private shutdown: () => void;
  private numLoops: number;

  constructor(
    name: string,
    goal: string,
    renderMessage: (message: Message) => void,
    shutdown: () => void,
    modelSettings: ModelSettings
  ) {
    this.name = name;
    this.goal = goal;
    this.renderMessage = renderMessage;
    this.shutdown = shutdown;
    this.modelSettings = modelSettings;
    this.tasks = [];
    this.completedTasks = [];
    this.isRunning = true;
    this.numLoops = 0;
  }

  async run() {
    await this.initialize();
    await this.loop();
  }

  private async initialize() {
    this.sendGoalMessage();
    this.sendThinkingMessage();

    try {
      this.tasks = await this.getInitialTasks();
      for (const task of this.tasks) {
        await new Promise((r) => setTimeout(r, 800));
        this.sendTaskMessage(task);
      }
    } catch (e) {
      console.log(e);
      this.sendErrorMessage(getMessageFromError(e));
      this.shutdown();
    }
  }

  private async loop() {
    if (!this.isRunning) {
      return;
    }

    if (this.tasks.length === 0) {
      this.sendCompletedMessage();
      this.shutdown();
      return;
    }

    this.numLoops += 1;
    const maxLoops =
      this.modelSettings.customApiKey === ""
        ? DEFAULT_MAX_LOOPS_FREE
        : this.modelSettings.customMaxLoops || DEFAULT_MAX_LOOPS;
    if (this.numLoops > maxLoops) {
      this.sendLoopMessage();
      this.shutdown();
      return;
    }

    const currentTask = this.tasks.shift()!;
    await this.executeTask(currentTask);

    try {
      const newTasks = await this.getAdditionalTasks(currentTask);
      this.tasks = this.tasks.concat(newTasks);
      for (const task of newTasks) {
        await new Promise((r) => setTimeout(r, 800));
        this.sendTaskMessage(task);
      }
    } catch (e) {
      console.log(e);
      this.sendErrorMessage(
        `ERROR adding additional task(s). It might have been against our model's policies to run them. Continuing.`
      );
    }

    await this.loop();
  }

  private async getInitialTasks(): Promise<string[]> {
    if (this.shouldRunClientSide()) {
      await testConnection(this.modelSettings);
      return await startAgent(this.modelSettings, this.goal);
    }

    const res = await axios.post(`/api/chain`, {
      modelSettings: this.modelSettings,
      goal: this.goal,
    });

    return res.data.newTasks;
  }

  private async getAdditionalTasks(
    currentTask: string
  ): Promise<string[]> {
    if (this.shouldRunClientSide()) {
      return await createAgent(
        this.modelSettings,
        this.goal,
        this.tasks,
        currentTask,
        "",
        this.completedTasks
      );
    }

    const res = await axios.post(`/api/create`, {
      modelSettings: this.modelSettings,
      goal: this.goal,
      tasks: this.tasks,
      lastTask: currentTask,
      result: "",
      completedTasks: this.completedTasks,
    });
    return res.data.newTasks;
  }

  private async executeTask(task: string): Promise<void> {
    if (this.shouldRunClientSide()) {
      await executeAgent(this.modelSettings, this.goal, task);
    } else {
      await axios.post(`/api/execute`, {
        modelSettings: this.modelSettings,
        goal: this.goal,
        task: task,
      });
    }
  }

  private shouldRunClientSide() {
    return this.modelSettings.customApiKey != "";
  }

  stopAgent() {
    this.sendManualShutdownMessage();
    this.isRunning = false;
    this.shutdown();
    return;
  }

  sendMessage(message: Message) {
    if (this.isRunning) {
      this.renderMessage(message);
    }
  }

  sendGoalMessage() {
    this.sendMessage({ type: "goal", value: this.goal });
  }

  sendLoopMessage() {
    this.sendMessage({
      type: "system",
      value:
        this.modelSettings.customApiKey !== ""
          ? `This agent has been running for too long (50 Loops). To save your wallet this agent is shutting down. In the future, the number of iterations will be configurable.`
          : "We're sorry, because this is a demo, we cannot have our agents running for too long. Note, if you desire longer runs, please provide your own API key in Settings. Shutting down.",
    });
  }

  sendManualShutdownMessage() {
