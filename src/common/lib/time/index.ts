export enum FriendlySeconds {
  ONE_MINUTE = 60,
  FIVE_MINUTE = 300,
  ONE_HOUR = 3600,
  HALF_DAY = ONE_HOUR * 12,
  ONE_DAY = ONE_HOUR * 24,
  ONE_WEEK = ONE_DAY * 7,
  THREE_WEEKS = ONE_WEEK * 3,
  ONE_YEAR = ONE_DAY * 365,
}

export enum FriendlyMilliSeconds {
  ONE_MINUTE = FriendlySeconds.ONE_MINUTE * 1000,
  ONE_HOUR = FriendlySeconds.ONE_HOUR * 1000,
  ONE_DAY = FriendlySeconds.ONE_DAY * 1000,
  ONE_WEEK = FriendlySeconds.ONE_WEEK * 1000,
  ONE_YEAR = FriendlySeconds.ONE_YEAR * 1000,
}

export const getCurrentTimestampInSeconds = (): number => parseInt((new Date().getTime() / 1000).toString(), 10);
