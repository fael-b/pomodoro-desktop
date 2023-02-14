export type FocusDuration = "10" | "15" | "20" | "25";
export type BreakDuration = "1" | "2" | "5" | "10";

export type NumericalFocusDuration = 10 | 15 | 20 | 25;
export type NumericalBreakDuration = 1 | 2 | 5 | 10;

export interface Session {
  focusDuration: NumericalFocusDuration;
  breakDuration: NumericalBreakDuration;
  startTimestamp: number;
}

export interface LoggedSession extends Session {
  endTimestamp: number;
}

export interface Break {
  startTimestamp: number;
  endTimestamp: number;
}

interface BaseState {
  state: "idle" | "focusing" | "break" | "finished";
}

interface IdleState extends BaseState {
  state: "idle";
}

interface FocusingState extends BaseState {
  state: "focusing";
  session: Session;
  breaks: Break[];
}

interface BreakState extends BaseState {
  state: "break";
  startTimestamp: number;
  session: Session;
  breaks: Break[];
}

interface FinishedState extends BaseState {
  state: "finished";
  endTimestamp: number;
  session: Session;
  breaks: Break[];
}

export type AppState = IdleState | FocusingState | BreakState | FinishedState;
