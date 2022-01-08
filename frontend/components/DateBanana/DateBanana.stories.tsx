import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import DateBanana from "./DateBanana";

export default {
  title: "Components/DateBanana",
  component: DateBanana,
} as ComponentMeta<typeof DateBanana>;

const Template: ComponentStory<typeof DateBanana> = (args) => (
  <DateBanana {...args} />
);

export const Default = Template.bind({});
Default.args = {
  day: "Fri",
  date: "01/12/2021",
};
