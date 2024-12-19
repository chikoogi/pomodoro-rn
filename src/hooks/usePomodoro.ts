'use client';

import {useState, useCallback, useEffect} from 'react';
import {PomodoroState} from '../types/pomodoro.types';

/*
 * usePomodoro
 * 단일 포모도로 세션의 상태와 동작을 관리
 *
 * */

export const usePomodoro = ({session, updateSession}: any) => {
  const [state, setState] = useState<PomodoroState>({
    currentSession: session,
    timeRemaining: session.duration,
    status: 'PENDING',
    isBreak: false,
  });

  const startSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      timeRemaining: prev.currentSession.duration,
      status: 'RUNNING',
    }));
  }, []);

  const pauseSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'PAUSED',
    }));
  }, []);

  const resumeSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'RUNNING',
    }));
  }, []);

  const resetSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      timeRemaining: prev.currentSession.duration,
      status: 'PENDING',
      isBreak: false,
    }));
  }, []);

  // 타이머 업데이트
  useEffect(() => {
    if (state.status !== 'RUNNING') return;

    const interval = 1000;
    let prevTime = Date.now();
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
          updateSession({
            completedSessions: prev.currentSession.completedSessions + 1,
          });

          // 타이머 끝났을 때 로직
          timerEl && clearTimeout(timerEl);
          return {
            ...prev,
            status: 'PENDING',
            isBreak: false,
            timeRemaining: prev.currentSession.duration,
          };
        } else {
          return {...prev, timeRemaining: newTimeRemaining};
        }
      });

      timerEl = setTimeout(step, delay);
    };

    timerEl = setTimeout(step, interval);

    return () => {
      if (timerEl) clearTimeout(timerEl);
    };
  }, [state.status, updateSession, session]);

  useEffect(() => {
    setState({
      currentSession: session,
      timeRemaining: session.duration,
      status: 'PENDING',
      isBreak: false,
    });
  }, [session]);

  return {
    state,
    startSession,
    pauseSession,
    resumeSession,
    resetSession,
  };
};
