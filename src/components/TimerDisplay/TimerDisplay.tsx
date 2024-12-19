import BgTimer from '../../assets/BgTimer.svg';
import Svg, {Circle} from 'react-native-svg';
import {Text, TextInput, View} from 'react-native';
import {
  formatInputMin,
  formatInputOnBlur,
  formatTime,
  sanitizeInput,
} from '../../tools/common-tool.ts';
import styled from './style.ts';
import {useEffect, useMemo, useState} from 'react';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from '@sayem314/react-native-keep-awake';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const TimerDisplay = ({state, onUpdate}: any) => {
  const [min, setMin] = useState(
    formatInputMin(Math.floor(state.currentSession.duration / 60)),
  );
  const [sec, setSec] = useState(
    formatInputMin(state.currentSession.duration % 60),
  );

  const radius = 300 / 2; // 반지름
  const strokeWidth = 10; // 두께

  const session = state.currentSession;
  const totalSeconds = session.duration;
  const progress = (state.timeRemaining / totalSeconds) * 100;

  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius; // 원둘레

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
  const isActive = useMemo(
    () => session.status === 'RUNNING',
    [session.status],
  );

  useEffect(() => {
    if (isActive) {
      // 포모도로 실행 중에는 화면 꺼지지 않도록 유지
      activateKeepAwake();
    } else {
      // 포모도로 중지 시 화면 보호 기능 해제
      deactivateKeepAwake();
    }
  }, [isActive]);

  useEffect(() => {
    const duration = Number(min) * 60 + Number(sec);
    onUpdate({duration});
  }, [min, sec]);

  return (
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
      {(state.status === 'PAUSED' || state.status === 'RUNNING') && (
        <View style={styled.timerWrapper}>
          <Text style={styled.timeRemaining}>
            {formatTime(state.timeRemaining)}
          </Text>
        </View>
      )}
      {state.status === 'PENDING' && (
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
  );
};

export default TimerDisplay;
