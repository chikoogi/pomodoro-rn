import {PomodoroSession, PomodoroSettings} from '../types/pomodoro.types.ts';

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 15 * 60,
  breakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  sessionsUntilLongBreak: 0,
};

export const DEFAULT_SESSION: PomodoroSession = {
  id: Date.now().toString(),
  title: 'Untitled',
  duration: DEFAULT_SETTINGS.workDuration,
  breakDuration: DEFAULT_SETTINGS.breakDuration,
  completedSessions: 0,
  startTime: null,
  endTime: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};
