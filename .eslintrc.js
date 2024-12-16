module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    'react-native/react-native': true, // React Native 환경
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-native/all', // React Native 플러그인 설정
  ],
  rules: {
    'react/react-in-jsx-scope': 'off', // React 17+ JSX Transform으로 불필요
  },
  plugins: ['react', 'react-native'],
  parserOptions: {
    ecmaVersion: 2021, // 최신 ES 문법 지원
    sourceType: 'module', // ES 모듈 사용
    requireConfigFile: false, // Babel 설정 파일 불필요
  },
};
