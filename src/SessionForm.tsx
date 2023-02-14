import { useState } from "react";
import { Title, Text, Stack, SegmentedControl, Button } from "@mantine/core";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import {
  BreakDuration,
  FocusDuration,
  NumericalBreakDuration,
  NumericalFocusDuration,
  Session,
} from "./types";

interface SessionFormProps {
  onStart: (sessionData: Session) => void;
}

function SessionForm({ onStart }: SessionFormProps) {
  const [focusDuration, setFocusDuration] = useState<FocusDuration>("20");
  const [breakDuration, setBreakDuration] = useState<BreakDuration>("2");

  return (
    <Stack align="center" justify="space-around">
      <Title order={2}>Start a new session 🍅</Title>
      <Text fw={700}>Select a focus duration :</Text>
      <SegmentedControl
        data={[
          { label: "10 min", value: "10" },
          { label: "15 min", value: "15" },
          { label: "20 min", value: "20" },
          { label: "25 min", value: "25" },
        ]}
        value={focusDuration}
        onChange={(value) => setFocusDuration(value as FocusDuration)}
      />

      <Text fw={700}>Select a break duration :</Text>
      <SegmentedControl
        data={[
          { label: "1 min", value: "1" },
          { label: "2 min", value: "2" },
          { label: "5 min", value: "5" },
          { label: "10 min", value: "10" },
        ]}
        value={breakDuration}
        onChange={(value) => setBreakDuration(value as BreakDuration)}
      />

      <Button
        variant="gradient"
        gradient={{
          from: "orange",
          to: "red",
        }}
        onClick={() => {
          onStart({
            focusDuration: Number(focusDuration) as NumericalFocusDuration,
            breakDuration: Number(breakDuration) as NumericalBreakDuration,
            startTimestamp: Date.now(),
          });
        }}
        size="md"
        radius="lg"
        leftIcon={<IconPlayerPlayFilled />}
      >
        Start focusing
      </Button>
    </Stack>
  );
}

export default SessionForm;
