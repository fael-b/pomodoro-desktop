import { IconRepeat } from "@tabler/icons-react";
import { Stack, Button, Title, Text, Card } from "@mantine/core";
import { Break, Session } from "./types";

interface FinishedViewProps {
  session: Session;
  breaks: Break[];
  endTimestamp: number;
  onReset: () => void;
}

function FinishedView({
  session,
  breaks,
  endTimestamp,
  onReset,
}: FinishedViewProps) {
  const totalSessionDurationMs = endTimestamp - session.startTimestamp;
  const totalSessionDurationMin = Math.ceil(totalSessionDurationMs / 1000 / 60);

  const totalBreakDurationMs = breaks.reduce((previous, current) => {
    const currentBreakDuration = current.endTimestamp - current.startTimestamp;
    return previous + currentBreakDuration;
  }, 0);
  const totalBreakDurationMin = Math.ceil(totalBreakDurationMs / 1000 / 60);

  const totalFocusDurationMs =
    endTimestamp - session.startTimestamp - totalBreakDurationMs;
  const totalFocusDurationMin = Math.ceil(totalFocusDurationMs / 1000 / 60);

  return (
    <Stack align="center">
      <Title order={2}>Great job ! 🎉</Title>
      <Card>
        <Text>This session has been recorded in your history.</Text>
        <Stack align="center" justify="space-around" mt={8}>
          <Text fw={700} color="green">
            Focus duration: {totalFocusDurationMin} min
          </Text>
          <Text fw={700}>Break(s) duration: {totalBreakDurationMin} min</Text>
          <Text fw={700}>Total duration: ~{totalSessionDurationMin} min</Text>
        </Stack>
      </Card>
      <Button
        leftIcon={<IconRepeat />}
        color="green"
        size="md"
        radius="lg"
        variant="outline"
        onClick={onReset}
      >
        Start a new session
      </Button>
    </Stack>
  );
}

export default FinishedView;
