import React, { useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import {
  FaAccessibleIcon,
  FaBars,
  FaCog,
  FaDiscord,
  FaGithub,
  FaQuestionCircle,
  FaRobot,
  FaRocket,
  FaSignInAlt,
  FaSignOutAlt,
  FaTwitter,
  FaUser,
} from "react-icons/fa";
import { BiPlus } from "react-icons/bi";
import { useAuth } from "../hooks/useAuth";
import { env } from "../env/client.mjs";
import { api } from "../utils/api";
import { signIn as nextAuthSignIn } from "next-auth/react";

const Drawer = ({
  showHelp,
  showSettings,
}: {
  showHelp: () => void;
  showSettings: () => void;
}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const { session, signIn: authSignIn, signOut: authSignOut } = useAuth();
  const router = useRouter();

  const subMutation = api.account.subscribe.useMutation({
    onSuccess: async (url) => {
      if (!url) return;
      await router.push(url);
    },
  });

  const manageMutation = api.account.manage.useMutation({
    onSuccess: async (url) => {
      if (!url) return;
      await router.push(url);
    },
  });

  const toggleDrawer = () => {
    setShowDrawer((prevState) => !prevState);
  };

  const userAgents = api.agent.getAll.useQuery(undefined, {
    enabled: session?.user.role === "ADMIN",
  }).data ?? [];

  const signIn = () => {
    authSignIn();
  };

  const signOut = () => {
    authSignOut();
  };

  return (
    <>
      <button
        hidden={showDrawer}
        className="fixed left-2 top-2 z-40 rounded-md border-2 border-white/20 bg-zinc-900 p-2 text-white hover:bg-zinc-700 md:hidden"
        onClick={toggleDrawer}
      >
        <FaBars />
      </button>
      <div
        id="drawer"
        className={clsx(
          showDrawer ? "translate-x-0" : "-translate-x-full",
          "z-30 m-0 h-screen w-72 flex-col justify-between bg-zinc-900 p-3 font-mono text-white shadow-3xl transition-all",
          "fixed top-0 md:sticky",
          "flex md:translate-x-0"
        )}
      >
        <div className="flex flex-col gap-1 overflow-hidden">
          <div className="mb-2 flex justify-center gap-2">
            <DrawerItem
              className="flex-grow"
              icon={<BiPlus />}
              border
              text="New Agent"
              onClick={() => location.reload()}
            />
            <button
              className="z-40 rounded-md border-2 border-white/20 bg-zinc-900 p-2 text-white hover:bg-zinc-700 md:hidden"
              onClick={toggleDrawer}
            >
              <FaBars />
            </button>
          </div>
          <ul>
            {userAgents.map((agent, index) => (
              <DrawerItem
                key={index}
                icon={<FaRobot />}
                text={agent.name}
                className={""}
                onClick={() => router.push(`/agent/${agent.id}`)}
              />
            ))}

            {userAgents.length === 0 && (
              <div>
                Click the above button to restart. In the future, this will be a
                list of your deployed agents!
              </div>
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-1">
          <hr className="my-5 border-white/20" />
          {/*<DrawerItem*/}
          {/*  icon={<FaTrashAlt />}*/}
          {/*  text="Clear Agents"*/}
          {/*  onClick={() => setAgents([])}*/}
          {/*/>*/}

          {env.NEXT_PUBLIC_FF_SUB_ENABLED && (
            <ProItem
              subMutation={subMutation.mutate}
              manageMutation={manageMutation.mutate}
              session={session}
            />
          )}
          {env.NEXT_PUBLIC_FF_AUTH_ENABLED && (
            <AuthItem
              session={session}
              signIn={signIn}
              signOut={signOut}
              nextAuthSignIn={nextAuthSignIn}
            />
          )}
          <DrawerItem
            icon={<FaQuestionCircle />}
            text="Help"
            onClick={showHelp}
          />
          <DrawerItem icon={<FaCog />} text="Settings" onClick={showSettings} />
          <hr className="my-2 border-white/20" />
          <div className="flex flex-row items-center">
            <DrawerItem
              icon={<FaDiscord size={30} />}
              text="Discord"
              href="https://discord.gg/jdSBAnmdnY"
              target="_blank"
              small
            />
            <DrawerItem
              icon={<FaTwitter size={30} />}
              text="Twitter"
              href="https://twitter.com/asimdotshrestha/status/1644883727707959296"
              target="_blank"
              small
            />
            <DrawerItem
