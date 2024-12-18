import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import PomodoroHome from './src/page/PomodoroHome/PomodoroHome.tsx';
import PomodoroList from './src/page/PomodoroList/PomodoroList.tsx';
import {PaperProvider} from "react-native-paper";

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
      <PaperProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PomodoroHome">
        <Stack.Screen
          name="PomodoroHome"
          component={PomodoroHome}
          options={{title: 'Pomodoro'}}
        />

        <Stack.Screen name="PomodoroList" component={PomodoroList} />
      </Stack.Navigator>
    </NavigationContainer>
      </PaperProvider>
  );
}

export default App;
