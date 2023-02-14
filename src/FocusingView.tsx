import { useInterval } from "@mantine/hooks";
import { useEffect, useState } from "react";
import {
  Stack,
  ActionIcon,
  Flex,
  Text,
  Title,
  RingProgress,
} from "@mantine/core";
import {
  IconPlayerPauseFilled,
  IconPlayerStopFilled,
} from "@tabler/icons-react";
import { Session } from "./types";
import { formatMMSS } from "./timeFormatter";

interface FocusingViewProps {
  focusDuration: Session["focusDuration"];
  onBreakStart: () => void;
  onSessionEnd: () => void;
}

function FocusingView({
  focusDuration,
  onBreakStart,
  onSessionEnd,
}: FocusingViewProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(focusDuration * 60);

  const elapsedPercentage =
    100 - (secondsRemaining / (focusDuration * 60)) * 100;
  const formattedRemainingTime = formatMMSS(secondsRemaining);

  const interval = useInterval(
    () =>
      setSecondsRemaining((s) => {
        if (s <= 0) {
          onBreakStart();
        }

        return s - 1;
      }),
    1000
  );

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, []);

  return (
    <Stack align="center">
      <Title order={2}>Focusing ({focusDuration} min)</Title>
      <RingProgress
        sections={[{ value: elapsedPercentage, color: "green" }]}
        size={164}
        thickness={8}
        label={
          <Text fw={700} align="center" size={34} ff="monospace">
            {formattedRemainingTime}
          </Text>
        }
      />
      <Flex gap={8} align="center" justify="center" direction="row">
        <ActionIcon
          color="orange"
          variant="outline"
          radius="lg"
          size={56}
          title="Take a break"
          onClick={onBreakStart}
        >
          <IconPlayerPauseFilled size={32} />
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

export default FocusingView;
