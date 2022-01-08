import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PolyCta, { EPolyAs } from "./PolyCta";

export default {
  title: "Components/PolyCta",
  component: PolyCta,
} as ComponentMeta<typeof PolyCta>;

const Template: ComponentStory<typeof PolyCta> = (args) => (
  <PolyCta {...args}>Button</PolyCta>
);

export const Button = Template.bind({});
Button.args = {
  as: EPolyAs.button,
};

export const Anchor = Template.bind({});
Anchor.args = {
  as: EPolyAs.anchor,
};
