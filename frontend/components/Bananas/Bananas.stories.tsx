import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { BANANA_NAV_LINKS } from "../../constants/routes";

import Bananas from "./Bananas";

export default {
  title: "Components/Bananas",
  component: Bananas,
} as ComponentMeta<typeof Bananas>;

const Template: ComponentStory<typeof Bananas> = (args) => (
  <Bananas {...args} />
);

export const Default = Template.bind({});
Default.args = {
  links: BANANA_NAV_LINKS,
};
