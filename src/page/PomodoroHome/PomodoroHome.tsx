import {Button, Text, TextInput, View} from 'react-native';
import {usePomodoro} from '../../hooks/usePomodoro.ts';
import {
  formatInputOnBlur,
  formatTime,
  sanitizeInput,
} from '../../tools/common-tools.ts';
import styled from './style.ts';
import {useEffect, useMemo, useState} from 'react';
import Svg, {Circle, Line} from 'react-native-svg';
import BgTimer from '../../assets/BgTimer.svg';
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from '@sayem314/react-native-keep-awake';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const PomodoroHome = () => {
  const {
    state,
    startSession,
    pauseSession,
    updateSession,
    resetSession,
    resumeSession,
  } = usePomodoro('1');
  const [min, setMin] = useState('00');
  const [sec, setSec] = useState('10');

  const session = state.currentSession;
  const isActive = useMemo(
    () => session.status === 'RUNNING',
    [session.status],
  );

  const radius = 300 / 2; // 반지름
  const strokeWidth = 10; // 두께

  const totalSeconds = session.duration;
  const progress = (state.timeRemaining / totalSeconds) * 100;

  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius; // 원둘레

  // const strokeDashoffset = useDerivedValue(
  //   () => (progress / 100) * circumference - circumference,
  //   [progress],
  // );

  const pr = useSharedValue(0); // 진행 상태 초기값

  const animatedProgress = useDerivedValue(() => {
    return withTiming((progress / 100) * circumference - circumference, {
      duration: 1000,
    });
  });
  // 애니메이션 Props
  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: animatedProgress.value, // 역방향으로 Stroke 채우기
    };
  });

  useEffect(() => {
    const duration = Number(min) * 60 + Number(sec);
    updateSession({duration});
  }, [min, sec]);

  useEffect(() => {
    if (isActive) {
      // 포모도로 실행 중에는 화면 꺼지지 않도록 유지
      activateKeepAwake();
    } else {
      // 포모도로 중지 시 화면 보호 기능 해제
      deactivateKeepAwake();
    }
  }, [isActive]);

  return (
    <View style={styled.wrapper}>
      <View style={styled.titleWrapper}>
        <Text>{state.currentSession?.title || ''}</Text>
      </View>
      <View style={styled.svgWrapper}>
        <BgTimer width={'300px'} height={'300px'} />
        <Svg style={styled.lineWrapper} width={'300px'} height={'300px'}>
          <Circle
            stroke="black"
            fill="none"
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            strokeWidth={strokeWidth}
          />
          {/* 진행 원 (색상 있는 stroke) */}
          <AnimatedCircle
            stroke="blue" // 진행 상황을 표시할 색상 (토마토 예시)
            fill="none"
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            opacity={isActive ? '0.8' : '0.5'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            transform={`rotate(-90 ${radius} ${radius})`}
            strokeLinecap="round"
            animatedProps={animatedProps}
          />
        </Svg>
        {(state.currentSession.status === 'PAUSED' ||
          state.currentSession?.status === 'RUNNING') && (
          <View style={styled.timerWrapper}>
            <Text style={styled.timeRemaining}>
              {formatTime(state.timeRemaining)}
            </Text>
          </View>
        )}
        {state.currentSession?.status === 'PENDING' && (
          <View style={styled.inputWrapper}>
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
          </View>
        )}
      </View>
      <Text style={styled.completeWrapper}>
        Completed : {state.completedSessions}
      </Text>

      <View style={styled.buttonGroup}>
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
    </View>
  );
};
export default PomodoroHome;

{
  /*<Svg style={styled.lineWrapper}>
          {Array.from({length: 60}).map((_, i) => {
            const size = 300; // 시계 전체 크기
            const radius = size / 2;
            const centerX = radius;
            const centerY = radius;

            const angle = (i * 360) / 60;
            const angleRad = (angle * Math.PI) / 180;

            // 큰 눈금 여부 판단 (12개: i % 5 === 0 인 경우)
            const isHourTick = i % 5 === 0;

            // 눈금 길이 설정
            // 큰 눈금은 예: 15px, 작은 눈금은 예: 10px
            const tickStart = 10;
            const tickLength = tickStart + 10;

            // 선 두께
            const strokeWidth = isHourTick ? 2 : 1;

            // 바깥쪽 눈금 위치
            const outerX = centerX + (radius - tickStart) * Math.sin(angleRad);
            const outerY = centerY - (radius - tickStart) * Math.cos(angleRad);

            // 안쪽 눈금 위치(눈금 길이를 10px 정도로 가정)
            const innerX = centerX + (radius - tickLength) * Math.sin(angleRad);
            const innerY = centerY - (radius - tickLength) * Math.cos(angleRad);

            return (
              <Line
                key={i}
                x1={innerX}
                y1={innerY}
                x2={`${outerX}`}
                y2={`${outerY}`}
                opacity={0.3}
                stroke="currentColor"
                strokeWidth={strokeWidth}
              />
            );
          })}
        </Svg>*/
}
