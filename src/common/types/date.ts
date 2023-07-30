type Year = `${number}${number}${number}${number}`;
type Month = `${number}${number}`;
type Day = `${number}${number}`;
type Hours = `${number}${number}`;
type Minutes = `${number}${number}`;
type Seconds = `${number}${number}`;
type Milliseconds = `${number}${number}${number}`;

type Date = `${Year}-${Month}-${Day}`;

type DateTime = `${Hours}:${Minutes}:${Seconds}.${Milliseconds}`;

export type DateISO = `${Date}T${DateTime}Z`;
