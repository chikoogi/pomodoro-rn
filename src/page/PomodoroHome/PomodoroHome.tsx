import {Button, Text, TextInput, View} from 'react-native';
import {usePomodoro} from '../../hooks/usePomodoro.ts';
import {
  formatInputOnBlur,
  formatTime,
  sanitizeInput,
} from '../../tools/common-tools.ts';
import styled from './style.ts';
import {useEffect, useState} from 'react';
import Svg, {Circle} from 'react-native-svg';

const PomodoroHome = () => {
  const {
    state,
    startSession,
    pauseSession,
    updateSession,
    resetSession,
    resumeSession,
  } = usePomodoro('1');
  const [min, setMin] = useState('15');
  const [sec, setSec] = useState('00');

  const session = state.currentSession;
  const totalSeconds = session.duration;
  const progress = (session.timeRemaining / totalSeconds) * 100;
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const offset = (progress / 100) * circumference - circumference;
  const isActive = session.status === 'RUNNING';

  useEffect(() => {
    const duration = Number(min) * 60 + Number(sec);
    updateSession({duration});
  }, [min, sec]);

  return (
    <View style={styled.wrapper}>
      <View style={styled.circleOuter}>
        <View style={styled.circleInner}>
          <View style={styled.inputWrapper}>
            {state.currentSession?.status === 'PENDING' && (
              <>
                <TextInput
                  value={min}
                  maxLength={2}
                  onChangeText={value => setMin(sanitizeInput(value))}
                  onBlur={() => setMin(formatInputOnBlur(min, 60))}
                  keyboardType={'numeric'}
                />
                <Text>:</Text>
                <TextInput
                  value={sec}
                  maxLength={2}
                  onChangeText={value => setSec(sanitizeInput(value))}
                  onBlur={() => setSec(formatInputOnBlur(sec, 59))}
                  keyboardType={'numeric'}
                />
              </>
            )}
            {state.currentSession?.status !== 'PENDING' && (
              <Text style={styled.timerWrapper}>
                {formatTime(state.timeRemaining)}
              </Text>
            )}
          </View>
          <View>
            <Text>{state.currentSession?.title || ''}</Text>
          </View>
        </View>
      </View>
      <View>
        {state.currentSession?.status === 'PENDING' && (
          <Button title={'Start'} onPress={startSession} />
        )}
        {state.currentSession?.status === 'RUNNING' && (
          <Button title={'Pause'} onPress={pauseSession} />
        )}
        {state.currentSession?.status === 'PAUSED' && (
          <Button title={'Restart'} onPress={resumeSession} />
        )}
        {state.currentSession?.status === 'PAUSED' && (
          <Button title={'Reset'} onPress={resetSession} />
        )}
      </View>
      {/*<Svg>
            {Array.from({length: 60}).map((_, i) => {
              const angle = (i * 6 - 90) * (Math.PI / 180);
              const outerRadius = 46;
              const innerRadius = i % 5 === 0 ? 42 : 44; // 5분 단위는 더 긴 눈금
              const x1 = 50 + outerRadius * Math.cos(angle);
              const y1 = 50 + outerRadius * Math.sin(angle);
              const x2 = 50 + innerRadius * Math.cos(angle);
              const y2 = 50 + innerRadius * Math.sin(angle);

              return (
                <>
                                    <Line
                  key={i}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="currentColor"
                  strokeWidth={i % 5 === 0 ? '1.5' : '1'}
                />

                </>
              );
            })}
          </Svg>*/}
    </View>
  );
};
export default PomodoroHome;
