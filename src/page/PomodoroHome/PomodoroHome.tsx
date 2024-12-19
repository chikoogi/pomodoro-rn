import {Button, Text, View} from 'react-native';
import {usePomodoro} from '../../hooks/usePomodoro.ts';
import styled from './style.ts';
import TimerDisplay from '../../components/TimerDisplay/TimerDisplay.tsx';
import {usePomodoroManagement} from '../../hooks/usePomodoroManagements.ts';
import TimerForm from '../../components/TimerForm/TimerForm.tsx';
import TimerTemplate from '../../components/TimerTemplate/TImerTemplate.tsx';
import {PomodoroSession} from '../../types/pomodoro.types.ts';
import {useEffect, useState} from 'react';
import {getStorageData, saveStorageData} from '../../tools/storage-tool.ts';

const PomodoroHome = () => {
  const {sessions, isLoading, updateSession} = usePomodoroManagement();
  const [selected, setSelected] = useState<PomodoroSession | null>(null);

  useEffect(() => {
    if (!isLoading) {
      const selected = getStorageData('selected-pomodoro');
      if (selected && sessions.find(v => v.id === selected.id)) {
        setSelected(selected);
      } else {
        setSelected(sessions[0]);
      }
    }
  }, [isLoading, sessions]);

  useEffect(() => {
    if (selected) {
      saveStorageData('selected-pomodoro', JSON.stringify(selected));
    }
  }, [selected]);

  if (isLoading && selected)
    return (
      <View>
        <Text>isLoading...</Text>
      </View>
    );
  return (
    selected && (
      <TimerTemplate
        session={selected}
        onUpdate={(updates: Partial<PomodoroSession>) => {
          updateSession(selected.id, updates);
        }}
      />
    )
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
