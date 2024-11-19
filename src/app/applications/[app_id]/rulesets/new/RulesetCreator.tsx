"use client";

import { useState } from "react";
import React from "react";
import { Steps } from "antd";
import { initialFormData } from "@/app/data/initialFormData";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

interface RulesetCreatorProps {
  appId: string;
}

const steps = [
  {
    title: "Host",
    content: "Choose a Host URL",
  },
  {
    title: "Ruleset Settings",
    content: "Ruleset JSON Form",
  },
  {
    title: "Final Check",
    content: "Double Confirm Ruleset",
  },
];

export default function RulesetCreator(
  { appId }: RulesetCreatorProps
) {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<any>(initialFormData);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <div>
      <Steps current={current} items={items} style={
        { 
          marginBottom: "2rem",
          paddingRight: "2rem",
        }

      } />
      <div>
        {current == 0 ? (
          <Step1 ruleset={formData} updateRuleset={setFormData} next={next} />
        ) : current == 1 ? (
          <Step2
            ruleset={formData}
            updateRuleset={setFormData}
            next={next}
            prev={prev}
          />
        ) : current == 2 ? (
          <Step3 ruleset={formData} prev={prev} appID={appId} />
        ) : null}
      </div>
    </div>
  );
}
