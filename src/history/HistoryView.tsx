import { Stack, Indicator, LoadingOverlay, Text } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useEffect, useState } from "react";
import { useInterval } from "@mantine/hooks";
import { LoggedSession } from "../types";
import { BaseDirectory, exists, readTextFile } from "@tauri-apps/api/fs";
import { formatHHMMSS } from "../timeFormatter";

function HistoryView() {
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<LoggedSession[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const selectedYear = selectedDate?.getFullYear() ?? new Date().getFullYear();
  const selectedMonth = selectedDate?.getMonth() ?? new Date().getMonth();
  const selectedDay = selectedDate?.getDate() ?? new Date().getDate();

  const sessionsInSelectedMonth = sessions.filter((session) => {
    const sessionDate = new Date(session.startTimestamp);
    return (
      sessionDate.getFullYear() === selectedYear &&
      sessionDate.getMonth() === selectedMonth
    );
  });

  const sessionsInSelectedDay = sessionsInSelectedMonth.filter((session) => {
    const sessionDate = new Date(session.startTimestamp);
    return sessionDate.getDate() === selectedDay;
  });

  let selectedSessions = sessionsInSelectedMonth;
  if (selectedDate) {
    selectedSessions = sessionsInSelectedDay;
  }

  const totalFocusTimeInSelectedDay = selectedSessions.reduce(
    (previous, current) => {
      // In seconds
      const sessionDuration = Math.ceil(
        (current.endTimestamp - current.startTimestamp) / 1000
      );

      return previous + sessionDuration;
    },
    0
  );

  // Refresh sessions every 30 seconds if the window is open
  const refreshInterval = useInterval(refreshSessions, 1000 * 30);

  function refreshSessions() {
    setIsLoading(true);
    // Check if sessions.json exists
    exists("logs/sessions.json", { dir: BaseDirectory.AppData })
      .then(async (fileExists) => {
        try {
          if (!fileExists) {
            setIsLoading(false);
            return;
          }
          // Read sessions.json
          const text = await readTextFile("logs/sessions.json", {
            dir: BaseDirectory.AppData,
          });
          // Parse sessions.json
          const sessions = JSON.parse(text) as LoggedSession[];
          setSessions(sessions);
          setIsLoading(false);
        } catch (err) {
          console.error(err);
        }
      })
      .catch(console.error);
  }

  // Load sessions from computer storage
  useEffect(() => {
    if (!isLoading) {
      return;
    }
    refreshSessions();
  }, []);

  useEffect(() => {
    refreshInterval.start();
    return refreshInterval.stop;
  }, []);

  return (
    <Stack align="center" justify="space-around">
      <LoadingOverlay
        visible={isLoading}
        overlayBlur={2}
        loaderProps={{ color: "green" }}
      />
      <Calendar
        value={selectedDate}
        onChange={(newDate) => {
          if (!newDate) {
            setSelectedDate(null);
            return;
          }

          // Unselect the date if it's already selected
          const day = newDate.getDate();
          if (selectedDate?.getDate() === day) {
            setSelectedDate(null);
            return;
          }

          setSelectedDate(newDate);
        }}
        renderDay={(date) => {
          const day = date.getDate();
          const hasSession = sessionsInSelectedMonth.some((session) => {
            const sessionDate = new Date(session.startTimestamp);
            return sessionDate.getDate() === day;
          });

          if (!hasSession) {
            return <div>{day}</div>;
          }

          return (
            <Indicator size={6} color="green" offset={8}>
              <div>{day}</div>
            </Indicator>
          );
        }}
      />
      {selectedDate ? (
        <>
          <Text fw={500}>
            Total time focusing on{" "}
            {Intl.DateTimeFormat("en", {
              day: "numeric",
              month: "long",
            }).format(selectedDate)}{" "}
            :
          </Text>
          <Text fw={800} size={32}>
            {formatHHMMSS(totalFocusTimeInSelectedDay)}
          </Text>
        </>
      ) : (
        <>
          <Text fw={500}>Total time focusing this month :</Text>
          <Text fw={800} size={32}>
            {formatHHMMSS(totalFocusTimeInSelectedDay)}
          </Text>
        </>
      )}
    </Stack>
  );
}

export default HistoryView;
