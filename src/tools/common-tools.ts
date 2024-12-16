export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
};

// 입력값 필터링 함수
export const sanitizeInput = value => {
  return value.replace(/[^0-9]/g, ''); // 숫자만 허용
};

// 블러 시 두 자리 포맷팅 및 범위 제한 함수
export const formatInputOnBlur = (value: string, max: number) => {
  let numericValue = parseInt(value, 10);

  if (!isNaN(numericValue)) {
    if (numericValue > max) numericValue = max; // 최대값 제한
    if (numericValue < 0) numericValue = 0; // 최소값 제한
    return numericValue.toString().padStart(2, '0'); // 두 자리 포맷
  }
  return '00'; // 비어있으면 기본값 00 반환
};
