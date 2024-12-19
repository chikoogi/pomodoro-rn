import {useStorage} from './useStorage.ts';
import {PomodoroSession, PomodoroSettings} from '../types/pomodoro.types.ts';
import {useCallback, useEffect, useState} from 'react';
import {DEFAULT_SESSION} from '../variables/pomodoro-variable.ts';

/*
 * usePomodoroManagements
 * 포도로고 리스트 관리 CRUD
 * storage 관리
 * */
export const usePomodoroManagement = () => {
  const [sessions, setSessions, isLoading1] = useStorage<PomodoroSession[]>(
    `pomodoro_list`,
    [DEFAULT_SESSION],
  );

  const addSession = useCallback(() => {
    setSessions(prev => [
      ...prev,
      {
        ...DEFAULT_SESSION,
        id: Date.now().toString(),
      },
    ]);
  }, [setSessions]);

  const updateSession = useCallback(
    (id: string, updates: Partial<PomodoroSession>) => {
      setSessions(prev => {
        return prev.map(session =>
          session.id === id
            ? {...session, ...updates, updatedAt: new Date()}
            : session,
        );
      });
    },
    [setSessions],
  );

  const deleteSession = useCallback(
    (id: string) => {
      setSessions(prev => prev.filter(session => session.id !== id));
    },
    [setSessions],
  );

  /*const updateSelectedSession = useCallback(
    (session: PomodoroSession) => {
      setSelectedSession(session);
    },
    [setSelectedSession],
  );

  useEffect(() => {
    if (!selectedSession && !isLoading1) {
      setSelectedSession(sessions[0]);
    }
  }, [sessions, isLoading1, selectedSession]);*/

  return {
    sessions,
    isLoading: isLoading1,
    addSession,
    updateSession,
    deleteSession,
  };
};
