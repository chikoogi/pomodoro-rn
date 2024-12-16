'use client';

import {useState, useCallback, useEffect} from 'react';
import {
  PomodoroSession,
  PomodoroSettings,
  PomodoroState,
} from '../types/pomodoro.types';
// import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 15 * 60,
  breakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  sessionsUntilLongBreak: 0,
};

export const usePomodoro = (todoId: string) => {
  const DEFAULT_SESSION: PomodoroSession = {
    id: new Date().toString(),
    todoId,
    title: 'Untitled',
    startTime: null,
    endTime: null,
    duration: DEFAULT_SETTINGS.workDuration,
    timeRemaining: DEFAULT_SETTINGS.workDuration,
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [state, setState] = useState<PomodoroState>({
    currentSession: DEFAULT_SESSION,
    timeRemaining: DEFAULT_SESSION.duration,
    isBreak: false,
    completedSessions: 0,
  });

  const startSession = useCallback(() => {
    if (!state.currentSession) return;
    const session: PomodoroSession = {
      ...state.currentSession,
      status: 'RUNNING',
    };

    setState(prev => ({
      ...prev,
      currentSession: session,
      timeRemaining: session.duration,
      isBreak: false,
      updatedAt: new Date(),
    }));
  }, [todoId]);

  const updateSession = useCallback(
    (updated: Partial<PomodoroSession>) => {
      if (!state.currentSession) return;

      const session = {
        ...state.currentSession,
        ...updated,
      };

      setState(prev => ({
        ...prev,
        currentSession: session,
        updatedAt: new Date(),
        timeRemaining: session.duration,
      }));
    },
    [state.currentSession],
  );

  const pauseSession = useCallback(() => {
    if (!state.currentSession) return;

    setState(prev => ({
      ...prev,
      currentSession: {
        ...prev.currentSession!,
        status: 'PAUSED',
        updatedAt: new Date(),
      },
    }));
  }, [state.currentSession]);

  const resumeSession = useCallback(() => {
    if (!state.currentSession) return;

    setState(prev => ({
      ...prev,
      currentSession: {
        ...prev.currentSession!,
        status: 'RUNNING',
        updatedAt: new Date(),
      },
    }));
  }, [state.currentSession]);

  const completeSession = useCallback(() => {
    if (!state.currentSession) return;

    const session: PomodoroSession = {
      ...state.currentSession,
      status: 'COMPLETED' as const,
      endTime: new Date(),
      updatedAt: new Date(),
    };

    setState(prev => ({
      ...prev,
      currentSession: session,
      completedSessions: prev.completedSessions + 1,
      isBreak: true,
      timeRemaining: prev.currentSession!.duration,
    }));
  }, [state.currentSession]);

  const resetSession = useCallback(() => {
    if (!state.currentSession) return;

    const session: PomodoroSession = {
      ...state.currentSession,
      status: 'PENDING',
      updatedAt: new Date(),
    };

    setState(prev => ({
      ...prev,
      currentSession: session,
      isBreak: false,
      timeRemaining: session.duration,
    }));
  }, [state.currentSession]);

  // 타이머 업데이트
  useEffect(() => {
    if (!state.currentSession || state.currentSession.status !== 'RUNNING')
      return;

    const timer = setInterval(() => {
      setState(prev => {
        if (prev.timeRemaining <= 0) {
          clearInterval(timer);
          if (!prev.isBreak) {
            completeSession();
          } else {
            return {
              ...prev,
              isBreak: false,
              timeRemaining: DEFAULT_SETTINGS.workDuration * 60,
            };
          }
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    state.currentSession,
    state.isBreak,
    completeSession,
    resetSession,
    updateSession,
  ]);

  return {
    state,
    startSession,
    updateSession,
    pauseSession,
    resumeSession,
    completeSession,
    resetSession,
  };
};
