export enum ActionType {
  LISTING = 'listing',
  BID = 'bid',
  DELISTING = 'delisting',
  SALE = 'sale',
}

export const logFound = (messages: string[], keyword: string): boolean =>
  !!messages.find((message) => message.includes(keyword));
