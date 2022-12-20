export enum ActionType {
  LISTING = 'listing',
  BID = 'bid',
  DELISTING = 'delisting',
  SALE = 'sale',
}

export const logFound = (messages: string[], keyword: string): boolean =>
  !!messages.find((message) => message.includes(keyword));

export type Activity = {
  buyerWallet: string | null;
  sellerWallet: string | null;
  price: number;
  mint: string;
  blocktime: number;
}