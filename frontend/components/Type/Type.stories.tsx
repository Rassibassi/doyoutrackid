import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Type from "./Type";

export default {
  title: "Components/Type",
  component: Type,
} as ComponentMeta<typeof Type>;

const Template: ComponentStory<typeof Type> = () => <Type />;

export const Default = Template.bind({});
