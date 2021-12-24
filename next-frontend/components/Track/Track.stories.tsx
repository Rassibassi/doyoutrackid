import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Track from "./Track";

export default {
  title: "Components/Track",
  component: Track,
} as ComponentMeta<typeof Track>;

const Template: ComponentStory<typeof Track> = (args) => <Track {...args} />;

export const Default = Template.bind({});
Default.args = {
  album: "Italian Classics: Pino D'Angiò Collection, Vol. 1",
  artist: "Ma quale idea",
  label: "Peer Southern Productions",
  listenHref: "#",
  releaseDate: "15/03/2011",
  time: "11:53",
  title: "Pino D'Angiò",
};
