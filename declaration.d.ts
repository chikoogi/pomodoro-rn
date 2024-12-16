// TypeScript에서 .svg 이미지를 사용하기 위한 .d.ts 파일
declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
