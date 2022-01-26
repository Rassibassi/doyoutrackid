import { createContext } from "react";

import { TODAY } from "../constants/dates";

export const ActiveDate = createContext<Date>(TODAY);
