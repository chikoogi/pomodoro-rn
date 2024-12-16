export type PomodoroStatus = 'PENDING' | 'RUNNING' | 'PAUSED' | 'COMPLETED';

export interface PomodoroSession {
  id: string;
  todoId: string;
  title: string;
  duration: number;
  status: PomodoroStatus;
  timeRemaining: number;
  startTime?: Date | null;
  endTime?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PomodoroSettings {
  workDuration: number; // 작업 시간 (초)
  breakDuration: number; // 휴식 시간 (초)
  longBreakDuration: number; // 긴 휴식 시간 (초)
  sessionsUntilLongBreak: number; // 긴 휴식까지의 세션 수
}

export interface PomodoroState {
  currentSession: PomodoroSession;
  timeRemaining: number; // 초 단위
  isBreak: boolean;
  completedSessions: number;
}
