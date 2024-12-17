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
  }, [todoId, state.currentSession]);

  const updateSession = useCallback(
    (updated: Partial<PomodoroSession>) => {
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
    const session: PomodoroSession = {
      ...state.currentSession,
      status: 'PENDING' as const,
      // endTime: new Date(),
      updatedAt: new Date(),
    };

    setState(prev => ({
      ...prev,
      currentSession: session,
      completedSessions: prev.completedSessions + 1,
      isBreak: true,
      timeRemaining: prev.currentSession.duration,
    }));
  }, [state.currentSession]);

  const resetSession = useCallback(() => {
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
    if (state.currentSession.status !== 'RUNNING') return;

    let prevTime = Date.now();
    const interval = 1000;
    let timerEl: NodeJS.Timeout | null = null;

    const step = () => {
      const curTime = Date.now();
      const diff = curTime - prevTime;
      const delay = interval - (diff - interval);

      prevTime = curTime;

      // 여기서 상태 갱신 로직 추가 예: 남은 시간 감소
      setState(prev => {
        const newTimeRemaining = prev.timeRemaining - interval / 1000;

        if (newTimeRemaining <= 0) {
          // 타이머 끝났을 때 로직
          timerEl && clearTimeout(timerEl);
          return {
            ...prev,
            timeRemaining: prev.currentSession.duration,
            currentSession: {...prev.currentSession, status: 'PENDING'},
          };
        } else {
          return {...prev, timeRemaining: newTimeRemaining};
        }
      });

      timerEl = setTimeout(step, delay);
    };

    timerEl = setTimeout(step, interval);

    return () => {
      if (timerEl !== null) clearTimeout(timerEl);
    };
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

/*const timer = setInterval(() => {
      const now = Date.now();
      setState(prev => {
        const delta = (now - prevTime) / 1000; // ms -> sec
        const newTimeRemaining = prev.timeRemaining - delta;

        console.log('timer', newTimeRemaining);

        prevTime = now; // 여기서 prevTime 갱신

        if (newTimeRemaining <= 0) {
          clearInterval(timer);
          completeSession();
          return {
            ...prev,
            isBreak: false,
            timeRemaining: DEFAULT_SETTINGS.workDuration * 60,
          };
        }
        return {
          ...prev,
          timeRemaining: newTimeRemaining,
        };
      });
    }, 1000);

    return () => clearInterval(timer);*/
