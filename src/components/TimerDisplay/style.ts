import {css} from '@emotion/native';

export default {
  wrapper: css`
    flex: 1;
    justify-content: center;
    align-items: center;
    //position: relative;
  `,
  svgWrapper: css`
    position: relative;
    left: 0;
    top: 0;

    //width: 300px;
    //height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  timerSvg: css`
    width: 300px;
    height: 300px;
  `,
  lineWrapper: css`
    position: absolute;
    //transition: all 1s linear;
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
    position: absolute;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  `,
  timerWrapper: css`
    position: absolute;
    font-weight: bold;
  `,
  timeRemaining: css`
    font-weight: bold;
  `,
  buttonGroup: css`
    flex-direction: row;
    margin-top: 30px;
    gap: 10px;
  `,
  completeWrapper: css`
    margin: 20px;
    font-weight: bold;
  `,
  titleWrapper: css`
    margin-bottom: 40px;
  `,
};
