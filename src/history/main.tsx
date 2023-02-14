import React from "react";
import ReactDOM from "react-dom/client";
import HistoryView from "./HistoryView";
import "./style.css";
import { MantineProvider } from "@mantine/core";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
      }}
    >
      <HistoryView />
    </MantineProvider>
  </React.StrictMode>
);
