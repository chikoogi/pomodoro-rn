import {css} from '@emotion/native';

export default {
  wrapper: css`
    flex: 1;
    justify-content: center;
    align-items: center;
  `,
  circleOuter: css`
    position: relative;

    width: 292px;
    height: 292px;

    border-radius: 50%;

    background-color: #716b6b;
    justify-content: center;
    align-items: center;
  `,
  circleInner: css`
    width: 178px;
    height: 178px;

    border-radius: 50%;
    background-color: #f3f3f3;
    justify-content: center;
    align-items: center;
  `,
  inputWrapper: css`
    width: 178px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  `,
  timerWrapper: css`
    font-weight: bold;
  `,
};
