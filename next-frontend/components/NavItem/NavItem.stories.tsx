import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import NavItem from "./NavItem";

export default {
  title: "Components/NavItem",
  component: NavItem,
} as ComponentMeta<typeof NavItem>;

const Template: ComponentStory<typeof NavItem> = (args) => (
  <NavItem {...args}>Live</NavItem>
);

export const Default = Template.bind({});
