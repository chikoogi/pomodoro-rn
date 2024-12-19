import {Text, View} from 'react-native';
import {usePomodoro} from '../../hooks/usePomodoro.ts';
import TimerDisplay from '../TimerDisplay/TimerDisplay.tsx';
import TimerForm from '../TimerForm/TimerForm.tsx';
import styled from './style.ts';
import {PomodoroSession} from '../../types/pomodoro.types.ts';

const TimerTemplate = ({
  session,
  onUpdate,
}: {
  session: PomodoroSession;
  onUpdate: any;
}) => {
  const {state, startSession, pauseSession, resumeSession, resetSession} =
    usePomodoro({session: session, updateSession: onUpdate});

  console.log(session);
  return (
    <View style={styled.wrapper}>
      <View style={styled.titleWrapper}>
        <Text>{session.title || ''}</Text>
      </View>
      <TimerDisplay state={state} onUpdate={onUpdate} />
      <Text style={styled.completeWrapper}>
        Completed : {session.completedSessions}
      </Text>
      <TimerForm
        state={state}
        startSession={startSession}
        pauseSession={pauseSession}
        resumeSession={resumeSession}
        resetSession={resetSession}
      />
    </View>
  );
};

export default TimerTemplate;
