import React, { useEffect, useRef, useState } from "react";
import { type NextPage } from "next";
import Badge from "../components/Badge";
import DefaultLayout from "../layout/default";
import type { Message } from "../components/ChatWindow";
import ChatWindow from "../components/ChatWindow";
import Drawer from "../components/Drawer";
import Input from "../components/Input";
import Button from "../components/Button";
import { FaRobot, FaStar } from "react-icons/fa";
import PopIn from "../components/motions/popin";
import { VscLoading } from "react-icons/vsc";
import AutonomousAgent from "../components/AutonomousAgent";
import Expand from "../components/motions/expand";
import HelpDialog from "../components/HelpDialog";
import SettingsDialog from "../components/SettingsDialog";
import { GPT_35_TURBO, DEFAULT_MAX_LOOPS_FREE } from "../utils/constants";
import { useSession } from "next-auth/react";
import { TaskWindow } from "../components/TaskWindow";
import { useAuth } from "../hooks/useAuth";

const Home: NextPage = () => {
  const { session, status } = useAuth();
  const [name, setName] = useState<string>("");
  const [goalInput, setGoalInput] = useState<string>("");
  const [agent, setAgent] = useState<AutonomousAgent | null>(null);
  const [customApiKey, setCustomApiKey] = useState<string>("");
  const [customModelName, setCustomModelName] = useState<string>(GPT_35_TURBO);
  const [customTemperature, setCustomTemperature] = useState<number>(0.9);
  const [customMaxLoops, setCustomMaxLoops] = useState<number>(
    DEFAULT_MAX_LOOPS_FREE
  );
  const [shouldAgentStop, setShouldAgentStop] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef?.current?.focus();
  }, []);

  useEffect(() => {
    if (agent == null) {
      setShouldAgentStop(false);
      setIsAgentRunning(false);
    }
  }, [agent]);

  const handleAddMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const tasks = messages.filter((message) => message.type === "task");

  const handleNewGoal = async () => {
    if (name === "" || goalInput === "") return;

    setIsAgentRunning(true);

    try {
      const newAgent = new AutonomousAgent(
        name,
        goalInput,
        handleAddMessage,
        () => setAgent(null),
        { customApiKey, customModelName, customTemperature, customMaxLoops }
      );

      setAgent(newAgent);
      await newAgent.run();
    } catch (error) {
      console.error("Error running the agent:", error);
      setIsAgentRunning(false);
    }
  };

  const handleStopAgent = () => {
    setIsStopping(true);
    if (agent) agent.stopAgent();
    setAgent(null);
    setIsStopping(false);
    setShouldAgentStop(false);
  };

  const proTitle = (
    <>
      AgentGPT<span className="ml-1 text-amber-500/90">Pro</span>
    </>
  );

  return (
    <DefaultLayout>
      <HelpDialog
        show={showHelpDialog}
        close={() => setShowHelpDialog(false)}
      />
      <SettingsDialog
        reactModelStates={{
          customApiKey,
          setCustomApiKey,
          customModelName,
          setCustomModelName,
          customTemperature,
          setCustomTemperature,
          customMaxLoops,
          setCustomMaxLoops,
        }}
        show={showSettingsDialog}
        close={() => setShowSettingsDialog(false)}
      />
      <main className="flex min-h-screen flex-row">
        <Drawer
          showHelp={() => setShowHelpDialog(true)}
          showSettings={() => setShowSettingsDialog(true)}
        />
        <div
          id="content"
          className="z-10 flex min-h-screen w-full max-w-screen-lg flex-col items-center justify-between gap-3 p-2 sm:px-4 md:px-10"
        >
          <div
            id="layout"
            className="flex h-full w-full flex-col items-center justify-between gap-3 py-5 md:justify-center"
          >
            <div
              id="title"
              className="relative flex flex-col items-center font-mono"
            >
              <div className="flex flex-row items-start shadow-2xl">
                <span className="text-4xl font-bold text-[#C0C0C0] xs:text-5xl sm:text-6xl">
                  Agent
                </span>
                <span className="text-4xl font-bold text-white xs:text-5xl sm:text-6xl">
                  GPT
                </span>
                <PopIn delay={0.5} className="sm:absolute sm
