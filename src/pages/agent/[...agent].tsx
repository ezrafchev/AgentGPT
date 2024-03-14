import { type NextPage } from "next";
import DefaultLayout from "../../layout/default";
import Button, { type ButtonProps } from "../../components/Button";

import React from "react";
import { useRouter } from "next/router";

type HomeProps = {};

const Home: NextPage<HomeProps> = () => {
  const router = useRouter();

  const handleBackClick: ButtonProps["onClick"] = () => {
    router.push("/");
  };

  return (
    <DefaultLayout className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-center text-4xl font-bold text-[#C0C0C0]">
        Coming Soon!{" "}
      </h1>
      <Button data-testid="back-button" title="Back" onClick={handleBackClick}>
        Back
      </Button>
    </DefaultLayout>
  );
};

export default Home;

