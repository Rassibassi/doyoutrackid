import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import BananaNav from "./BananaNav";

export default {
  title: "Components/BananaNav",
  component: BananaNav,
} as ComponentMeta<typeof BananaNav>;

const Template: ComponentStory<typeof BananaNav> = (args) => (
  <BananaNav {...args} />
);

export const Default = Template.bind({});
