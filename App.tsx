import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import PomodoroHome from './src/page/PomodoroHome/PomodoroHome.tsx';
import PomodoroList from './src/page/PomodoroList/PomodoroList.tsx';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PomodoroHome">
        <Stack.Screen
          name="PomodoroHome"
          component={PomodoroHome}
          options={{title: 'Overview'}}
        />

        <Stack.Screen name="PomodoroList" component={PomodoroList} />
      </Stack.Navigator>
    </NavigationContainer>
    /*<View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
        <Text>Try editing me! 222🎉</Text>
      </View>*/
  );
}

export default App;
