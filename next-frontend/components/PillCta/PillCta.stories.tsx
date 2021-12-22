import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { EPolyAs } from "../PolyCta/PolyCta";

import PillCta from "./PillCta";

export default {
  title: "Components/PillCta",
  component: PillCta,
} as ComponentMeta<typeof PillCta>;

const Template: ComponentStory<typeof PillCta> = (args) => (
  <PillCta {...args}>Button</PillCta>
);

export const Button = Template.bind({});
Button.args = {
  as: EPolyAs.button,
};

export const Anchor = Template.bind({});
Anchor.args = {
  as: EPolyAs.anchor,
};
