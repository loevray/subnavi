// formatUtcToKst.test.ts (또는 .spec.ts) 파일
import { describe, it, expect } from 'vitest'; // Vitest에서 가져올 함수들
import formatUtcToKst from './formatUtcToKst'; // 실제 파일 경로에 맞게 조정

describe('formatUtcToKst', () => {
  // 기준 UTC 문자열: 2023년 10월 27일 오전 1시 0분 0초 (UTC)
  // 이는 KST로 2023년 10월 27일 오전 10시 0분 0초 입니다. (UTC+9)
  const baseUtcString = '2023-10-27T01:00:00Z';

  // 여름철/겨울철 시간대를 모두 테스트하기 위한 추가 UTC 문자열
  // 2024년 7월 15일 오후 3시 30분 15초 (UTC) -> KST: 2024년 7월 16일 오전 12시 30분 15초
  const summerUtcString = '2024-07-15T15:30:15Z';

  // 다른 날짜 형식 테스트를 위한 UTC 문자열
  // 2022년 1월 5일 오전 0시 0분 0초 (UTC) -> KST: 2022년 1월 5일 오전 9시 0분 0초
  const winterUtcString = '2022-01-05T00:00:00Z';

  // 잘못된 입력 테스트를 위한 문자열
  const invalidUtcString = 'invalid-date-string';

  // --- 기본 동작 테스트 ---
  it('should convert UTC string to KST with default 2-digit format', () => {
    const kst = formatUtcToKst(baseUtcString);
    expect(kst.year).toBe('2023');
    expect(kst.month).toBe('10');
    expect(kst.day).toBe('27');
    expect(kst.hour).toBe('10'); // 1 (UTC) + 9 (KST) = 10
    expect(kst.minute).toBe('00');
    expect(kst.second).toBe('00');
  });

  // --- 다양한 시간대 (여름/겨울) 테스트 ---
  it('should correctly convert UTC to KST during summer months (no DST in Korea)', () => {
    const kst = formatUtcToKst(summerUtcString);
    expect(kst.year).toBe('2024');
    expect(kst.month).toBe('07');
    expect(kst.day).toBe('16'); // 자정 넘김
    expect(kst.hour).toBe('00'); // 15 (UTC) + 9 (KST) = 24 (다음날 00시)
    expect(kst.minute).toBe('30');
    expect(kst.second).toBe('15');
  });

  it('should correctly convert UTC to KST during winter months', () => {
    const kst = formatUtcToKst(winterUtcString);
    expect(kst.year).toBe('2022');
    expect(kst.month).toBe('01');
    expect(kst.day).toBe('05');
    expect(kst.hour).toBe('09'); // 0 (UTC) + 9 (KST) = 9
    expect(kst.minute).toBe('00');
    expect(kst.second).toBe('00');
  });

  // --- 옵션 적용 테스트 ---
  it('should apply custom options for numeric month and hour12', () => {
    const kst = formatUtcToKst(baseUtcString, {
      month: 'numeric', // 10
      day: 'numeric', // 27
      hour: 'numeric', // 10
      hour12: true, // 오전/오후 사용
      minute: 'numeric',
      second: 'numeric',
    });
    expect(kst.month).toBe('10');
    expect(kst.day).toBe('27');
    expect(kst.hour).toBe('10'); // 10 AM (Intl.DateTimeFormat은 12시간제로 변환하여 반환)
    expect(kst.minute).toBe('0');
    expect(kst.second).toBe('0');
  });

  it('should apply custom options for long month, 12-hour format, and numeric minutes/seconds', () => {
    const utcTime = '2023-05-01T20:00:00Z'; // KST: 2023-05-02 05:00:00 AM
    const kst = formatUtcToKst(utcTime, {
      month: 'long', // "5월"
      hour: 'numeric', // "5"
      hour12: true, // "오전"
      minute: 'numeric', // "0"
      second: 'numeric', // "0"
    });

    expect(kst.year).toBe('2023');
    expect(kst.month).toBe('5월');
    expect(kst.day).toBe('02'); // 날짜 변경 확인
    expect(kst.hour).toBe('5');
    expect(kst.minute).toBe('0');
    expect(kst.second).toBe('0');
  });

  it('should return empty string for second if option is undefined', () => {
    const kst = formatUtcToKst(baseUtcString, { second: undefined });
    expect(kst.year).toBe('2023');
    expect(kst.month).toBe('10');
    expect(kst.day).toBe('27');
    expect(kst.hour).toBe('10');
    expect(kst.minute).toBe('00');
    expect(kst.second).toBe(''); // second 옵션이 없으면 빈 문자열 반환
  });

  // --- 엣지 케이스 및 유효하지 않은 입력 테스트 ---
  it('should handle midnight (00:00) KST correctly', () => {
    const utcMidnight = '2023-10-26T15:00:00Z'; // KST: 2023-10-27 00:00:00
    const kst = formatUtcToKst(utcMidnight);
    expect(kst.year).toBe('2023');
    expect(kst.month).toBe('10');
    expect(kst.day).toBe('27');
    expect(kst.hour).toBe('00');
    expect(kst.minute).toBe('00');
    expect(kst.second).toBe('00');
  });

  it('should handle invalid date string gracefully', () => {
    const kst = formatUtcToKst(invalidUtcString);
    // 'Invalid Date' 객체에 대해 Intl.DateTimeFormat은 빈 문자열을 반환할 수 있습니다.
    // 브라우저/Node.js 환경에 따라 결과가 다를 수 있으므로, 예상되는 빈 값들을 확인합니다.
    expect(Object.values(kst).every((val) => val === '')).toBe(true);
    // 또는 더 구체적으로:
    expect(kst.year).toBe('');
    expect(kst.month).toBe('');
    expect(kst.day).toBe('');
    expect(kst.hour).toBe('');
    expect(kst.minute).toBe('');
    expect(kst.second).toBe('');
  });

  it('should handle empty string input', () => {
    const kst = formatUtcToKst('');
    expect(Object.values(kst).every((val) => val === '')).toBe(true);
  });
});
