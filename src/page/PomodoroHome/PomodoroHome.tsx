/** @jsxImportSource @emotion/react */

import {Button, StyleProp, Text, View, ViewStyle} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {usePomodoro} from "../../hooks/usePomodoro.ts";
import {formatTime} from "../../tools/common-tools.ts";
import styled , {css}from "@emotion/native";

const Container = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px;
  padding: 20px;
  border: 1px solid #121212;

`

const containerStyle = css`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: yellow;
    padding: 20px;
`;

const PomodoroHome = () => {
  const navigation = useNavigation();
  const {state, startSession, pauseSession, resumeSession}=usePomodoro(1);
  return(
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Pomodoro 22</Text>
        <Text>
          {formatTime(state.timeRemaining)}
        </Text>
        <Text>
          {state.isBreak ? '휴식 시간' : '작업 시간'}
        </Text>
        <Container>
          {!state.currentSession && (
              <Button title={"시작"} onPress={startSession} />)
          }
          {state.currentSession?.status === "RUNNING" && (
              <Button title={"일시정지"} onPress={pauseSession} />)
          }
          {state.currentSession?.status === "PAUSED" && (
              <Button title={"재개"} onPress={resumeSession} />)
          }
        </Container>
        <View style={containerStyle}>
          <Text>완료한 세션::: {state.completedSessions}</Text>
        </View>

          </View>
  )
}
export default PomodoroHome;