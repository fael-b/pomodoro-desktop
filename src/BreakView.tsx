import { useInterval } from "@mantine/hooks";
import { useEffect, useState } from "react";
import {
  IconPlayerPlayFilled,
  IconPlayerStopFilled,
} from "@tabler/icons-react";
import {
  Stack,
  Flex,
  ActionIcon,
  Text,
  Title,
  RingProgress,
} from "@mantine/core";
import { Session } from "./types";
import { formatMMSS } from "./timeFormatter";

interface BreakViewProps {
  breakDuration: Session["breakDuration"];
  onBreakEnd: () => void;
  onSessionEnd: () => void;
}

function BreakView({
  breakDuration,
  onBreakEnd,
  onSessionEnd,
}: BreakViewProps) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const elapsedPercentage = (secondsElapsed / (breakDuration * 60)) * 100;
  const formattedElapsedTime = formatMMSS(secondsElapsed);

  const interval = useInterval(
    () =>
      setSecondsElapsed((s) => {
        if (s >= breakDuration * 60) {
          onBreakEnd();
        }

        return s + 1;
      }),
    1000
  );

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, []);

  return (
    <Stack align="center">
      <Title order={2}>Break ({breakDuration} min)</Title>
      <RingProgress
        size={164}
        thickness={8}
        sections={[{ value: elapsedPercentage, color: "green" }]}
        label={
          <Text fw={700} align="center" size={34}>
            {formattedElapsedTime}
          </Text>
        }
      />
      <Flex gap={8} align="center" justify="center" direction="row">
        <ActionIcon
          color="green"
          variant="outline"
          radius="lg"
          size={56}
          title="Continue the session"
          onClick={onBreakEnd}
        >
          <IconPlayerPlayFilled size={32} />
        </ActionIcon>
        <ActionIcon
          color="red"
          variant="outline"
          radius="lg"
          size={56}
          title="Stop the session"
          onClick={onSessionEnd}
        >
          <IconPlayerStopFilled size={32} />
        </ActionIcon>
      </Flex>
    </Stack>
  );
}

export default BreakView;
