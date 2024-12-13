'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  PomodoroSession,
  PomodoroSettings,
  PomodoroState,
} from '../types/pomodoro.types'
// import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
}

export const usePomodoro = (todoId: string) => {

  const [state, setState] = useState<PomodoroState>({
    currentSession: null,
    timeRemaining: DEFAULT_SETTINGS.workDuration * 60,
    isBreak: false,
    completedSessions: 0,
  })

  const startSession = useCallback(() => {
    const newSession: PomodoroSession = {
      id: new Date().toString(),
      todoId,
      title: '',
      startTime: new Date(),
      endTime: null,
      duration: DEFAULT_SETTINGS.workDuration,
      status: 'RUNNING',
      createdAt: new Date(),
      updatedAt: new Date(),
      timeRemaining: 0,
    }

    setState((prev) => ({
      ...prev,
      currentSession: newSession,
      timeRemaining: DEFAULT_SETTINGS.workDuration * 60,
      isBreak: false,
    }))

  }, [todoId])

  const pauseSession = useCallback(() => {
    if (!state.currentSession) return

    setState((prev) => ({
      ...prev,
      currentSession: {
        ...prev.currentSession!,
        status: 'PAUSED',
        updatedAt: new Date(),
      },
    }))
  }, [state.currentSession])

  const resumeSession = useCallback(() => {
    if (!state.currentSession) return

    setState((prev) => ({
      ...prev,
      currentSession: {
        ...prev.currentSession!,
        status: 'RUNNING',
        updatedAt: new Date(),
      },
    }))
  }, [state.currentSession])

  const completeSession = useCallback(() => {
    if (!state.currentSession) return

    const updatedSession: PomodoroSession = {
      ...state.currentSession,
      status: 'COMPLETED' as const,
      endTime: new Date(),
      updatedAt: new Date(),
    }

    setState((prev) => ({
      ...prev,
      currentSession: null,
      completedSessions: prev.completedSessions + 1,
      isBreak: true,
      timeRemaining: shouldTakeLongBreak(prev.completedSessions + 1)
        ? DEFAULT_SETTINGS.longBreakDuration * 60
        : DEFAULT_SETTINGS.breakDuration * 60,
    }))
  }, [state.currentSession])

  const shouldTakeLongBreak = (completedCount: number) => {
    return completedCount % DEFAULT_SETTINGS.sessionsUntilLongBreak === 0
  }

  // 타이머 업데이트
  useEffect(() => {
    if (!state.currentSession || state.currentSession.status !== 'RUNNING')
      return

    const timer = setInterval(() => {
      setState((prev) => {
        if (prev.timeRemaining <= 0) {
          clearInterval(timer)
          if (!prev.isBreak) {
            completeSession()
          } else {
            return {
              ...prev,
              isBreak: false,
              timeRemaining: DEFAULT_SETTINGS.workDuration * 60,
            }
          }
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [state.currentSession, state.isBreak, completeSession])

  return {
    state,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
  }
}
