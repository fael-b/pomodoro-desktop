import { useState } from "react";
import { Stack } from "@mantine/core";
import SessionForm from "./SessionForm";
import FocusingView from "./FocusingView";
import BreakView from "./BreakView";
import FinishedView from "./FinishedView";
import HistoryButton from "./HistoryButton";
import { AppState, Session, LoggedSession } from "./types";
import { sendNotification } from "./notifications";
import {
  BaseDirectory,
  exists,
  readTextFile,
  writeTextFile,
  createDir,
} from "@tauri-apps/api/fs";

function App() {
  const [appState, setAppState] = useState<AppState>({ state: "idle" });

  async function onSessionStart(sessionData: Session) {
    setAppState({
      state: "focusing",
      session: sessionData,
      breaks: [],
    });

    await sendNotification(
      "Session started",
      `You are now focusing for ${sessionData.focusDuration} minutes`
    );
  }

  async function onBreakStart() {
    setAppState((prevState) => {
      if (prevState.state !== "focusing") {
        return prevState;
      }

      return {
        state: "break",
        startTimestamp: Date.now(),
        session: prevState.session,
        breaks: prevState.breaks,
      };
    });

    // Make sure we only send a notification if the session is not over
    if (appState.state !== "idle") {
      await sendNotification(
        "Break started",
        "You are now taking a 2 minutes break"
      );
    }
  }

  async function onBreakEnd() {
    setAppState((prevState) => {
      if (prevState.state !== "break") {
        return prevState;
      }

      const breaks = [...prevState.breaks];
      breaks.push({
        startTimestamp: prevState.startTimestamp,
        endTimestamp: Date.now(),
      });

      return {
        state: "focusing",
        session: prevState.session,
        breaks,
      };
    });

    // Make sure we only send a notification if the session is not over
    if (appState.state !== "idle") {
      await sendNotification(
        "Break ended",
        `You are now focusing for ${appState.session.focusDuration} minutes`
      );
    }
  }

  function onSessionEnd() {
    setAppState((prevState) => {
      if (!(prevState.state === "focusing" || prevState.state === "break")) {
        return prevState;
      }

      const endTimestamp = Date.now();

      const sessionLog: LoggedSession = {
        ...prevState.session,
        endTimestamp,
      };

      // Save session to computer storage
      // Check if "logs/sessions.json" exists
      exists("logs/sessions.json", { dir: BaseDirectory.AppData })
        .then(async (fileExists) => {
          try {
            if (!fileExists) {
              // Check if the parent directory "logs" exists
              const dirExists = await exists("logs", {
                dir: BaseDirectory.AppData,
              });

              // Create the parent directory if it doesn't exist
              if (!dirExists) {
                await createDir("logs", {
                  dir: BaseDirectory.AppData,
                  recursive: true,
                });
              }

              // Create sessions.json if it doesn't exist
              await writeTextFile(
                "logs/sessions.json",
                JSON.stringify([sessionLog]),
                {
                  dir: BaseDirectory.AppData,
                }
              );
              return;
            }

            // Read and parse sessions.json
            const text = await readTextFile("logs/sessions.json", {
              dir: BaseDirectory.AppData,
            });
            const sessions = JSON.parse(text) as LoggedSession[];

            // Add the new session
            sessions.push(sessionLog);
            writeTextFile("logs/sessions.json", JSON.stringify(sessions), {
              dir: BaseDirectory.AppData,
            });
          } catch (err) {
            console.error(err);
          }
        })
        .catch(console.error);

      return {
        state: "finished",
        endTimestamp,
        session: prevState.session,
        breaks: prevState.breaks,
      };
    });
  }

  function onReset() {
    setAppState({
      state: "idle",
    });
  }

  return (
    <Stack align="center" justify="space-between" sx={{ height: "100%" }}>
      {appState.state === "idle" && <SessionForm onStart={onSessionStart} />}
      {appState.state === "focusing" && (
        <FocusingView
          focusDuration={appState.session.focusDuration}
          onBreakStart={onBreakStart}
          onSessionEnd={onSessionEnd}
        />
      )}
      {appState.state === "break" && (
        <BreakView
          breakDuration={appState.session.breakDuration}
          onBreakEnd={onBreakEnd}
          onSessionEnd={onSessionEnd}
        />
      )}
      {appState.state === "finished" && (
        <FinishedView
          session={appState.session}
          endTimestamp={appState.endTimestamp}
          breaks={appState.breaks}
          onReset={onReset}
        />
      )}

      <HistoryButton />
    </Stack>
  );
}

export default App;
