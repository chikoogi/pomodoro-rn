import {Button, View} from 'react-native';
import styled from './style.ts';
const TimerForm = ({
  state,
  startSession,
  pauseSession,
  resumeSession,
  resetSession,
}: any) => {
  return (
    <View style={styled.buttonGroup}>
      {state.status === 'PENDING' && (
        <Button title={'Start'} onPress={startSession} />
      )}
      {state.status === 'RUNNING' && (
        <Button title={'Pause'} onPress={pauseSession} />
      )}
      {state.status === 'PAUSED' && (
        <Button title={'Restart'} onPress={resumeSession} />
      )}
      {state.status === 'PAUSED' && (
        <Button title={'Reset'} onPress={resetSession} />
      )}
    </View>
  );
};

export default TimerForm;
