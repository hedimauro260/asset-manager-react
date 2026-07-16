export type ActivityType =
  | "All Types"
  | "Deposit"
  | "Transfer"
  | "Withdraw"
  | "Edit"
  | "Buy"
  | "Sell"
  | "Fee";
export type ActivityStatus = "Completed" | "Pending" | "Failed";

export interface ActivityRow {
  id: string;
  date: Date;
  walletName: string;
  type: ActivityType;
  description: string;
  amount: number;
  status: ActivityStatus;
  assetSymbol?: string;
  website?: string;
}

// Gerar 25 atividades mockadas para testar paginação
export const MOCK_ACTIVITIES: ActivityRow[] = [
  {
    id: "act-1",
    date: new Date("2026-07-10T14:43:00"),
    walletName: "CWallet 1",
    type: "Deposit",
    description: "Add funds",
    amount: 0.41,
    status: "Completed",
  },
  {
    id: "act-2",
    date: new Date("2026-07-09T14:43:00"),
    walletName: "CWallet 2",
    type: "Transfer",
    description: "From Airtm",
    amount: -1.41,
    status: "Completed",
  },
  {
    id: "act-3",
    date: new Date("2026-07-09T14:43:00"),
    walletName: "Airtm",
    type: "Transfer",
    description: "To CWallet 2",
    amount: 1.21,
    status: "Completed",
  },
  {
    id: "act-4",
    date: new Date("2026-07-09T14:43:00"),
    walletName: "Airtm",
    type: "Withdraw",
    description: "To Angola Bank",
    amount: -1.41,
    status: "Completed",
  },
  {
    id: "act-5",
    date: new Date("2026-07-09T14:43:00"),
    walletName: "BitFaucet",
    type: "Deposit",
    description: "Add funds",
    amount: 1.41,
    status: "Completed",
  },
  {
    id: "act-6",
    date: new Date("2026-07-08T10:22:00"),
    walletName: "CWallet 1",
    type: "Edit",
    description: "Manual adjustment",
    amount: 0.25,
    status: "Completed",
  },
  {
    id: "act-7",
    date: new Date("2026-07-07T09:15:00"),
    walletName: "FaucetPay",
    type: "Deposit",
    description: "Faucet claim",
    amount: 0.8,
    status: "Completed",
  },
  {
    id: "act-8",
    date: new Date("2026-07-06T16:30:00"),
    walletName: "Binance",
    type: "Buy",
    description: "BTC purchase",
    amount: 500.0,
    status: "Completed",
  },
  {
    id: "act-9",
    date: new Date("2026-07-05T11:20:00"),
    walletName: "CWallet 1",
    type: "Withdraw",
    description: "ATM withdrawal",
    amount: -50.0,
    status: "Completed",
  },
  {
    id: "act-10",
    date: new Date("2026-07-04T08:45:00"),
    walletName: "CWallet 2",
    type: "Deposit",
    description: "Salary deposit",
    amount: 1200.0,
    status: "Completed",
  },
  {
    id: "act-11",
    date: new Date("2026-07-03T14:10:00"),
    walletName: "Airtm",
    type: "Transfer",
    description: "To FaucetPay",
    amount: -25.5,
    status: "Pending",
  },
  {
    id: "act-12",
    date: new Date("2026-07-02T19:55:00"),
    walletName: "BitFaucet",
    type: "Deposit",
    description: "Reward claim",
    amount: 2.3,
    status: "Completed",
  },
  {
    id: "act-13",
    date: new Date("2026-07-01T10:00:00"),
    walletName: "Binance",
    type: "Sell",
    description: "ETH sale",
    amount: -150.0,
    status: "Completed",
  },
  {
    id: "act-14",
    date: new Date("2026-06-30T15:30:00"),
    walletName: "CWallet 1",
    type: "Edit",
    description: "Balance correction",
    amount: -5.0,
    status: "Completed",
  },
  {
    id: "act-15",
    date: new Date("2026-06-29T12:15:00"),
    walletName: "FaucetPay",
    type: "Withdraw",
    description: "To bank account",
    amount: -100.0,
    status: "Failed",
  },
  {
    id: "act-16",
    date: new Date("2026-06-28T09:40:00"),
    walletName: "CWallet 2",
    type: "Transfer",
    description: "From Binance",
    amount: 75.0,
    status: "Completed",
  },
  {
    id: "act-17",
    date: new Date("2026-06-27T17:25:00"),
    walletName: "Airtm",
    type: "Deposit",
    description: "P2P received",
    amount: 320.0,
    status: "Completed",
  },
  {
    id: "act-18",
    date: new Date("2026-06-26T13:50:00"),
    walletName: "BitFaucet",
    type: "Deposit",
    description: "Daily reward",
    amount: 0.15,
    status: "Completed",
  },
  {
    id: "act-19",
    date: new Date("2026-06-25T11:05:00"),
    walletName: "Binance",
    type: "Buy",
    description: "USDT purchase",
    amount: 1000.0,
    status: "Completed",
  },
  {
    id: "act-20",
    date: new Date("2026-06-24T16:20:00"),
    walletName: "CWallet 1",
    type: "Withdraw",
    description: "Bill payment",
    amount: -85.5,
    status: "Completed",
  },
  {
    id: "act-21",
    date: new Date("2026-06-23T10:35:00"),
    walletName: "CWallet 2",
    type: "Deposit",
    description: "Freelance payment",
    amount: 450.0,
    status: "Pending",
  },
  {
    id: "act-22",
    date: new Date("2026-06-22T14:45:00"),
    walletName: "FaucetPay",
    type: "Transfer",
    description: "To CWallet 1",
    amount: -10.0,
    status: "Completed",
  },
  {
    id: "act-23",
    date: new Date("2026-06-21T09:10:00"),
    walletName: "Airtm",
    type: "Edit",
    description: "Fee adjustment",
    amount: -2.5,
    status: "Completed",
  },
  {
    id: "act-24",
    date: new Date("2026-06-20T18:30:00"),
    walletName: "BitFaucet",
    type: "Deposit",
    description: "Bonus reward",
    amount: 5.0,
    status: "Completed",
  },
  {
    id: "act-25",
    date: new Date("2026-06-19T12:00:00"),
    walletName: "Binance",
    type: "Withdraw",
    description: "To external wallet",
    amount: -200.0,
    status: "Completed",
  },
];

export const WALLETS_LIST = [
  "All Wallets",
  "CWallet 1",
  "CWallet 2",
  "FaucetPay",
  "Airtm",
  "BitFaucet",
  "Binance",
];
export const TYPES_LIST = [
  "All Types",
  "Deposit",
  "Transfer",
  "Withdraw",
  "Buy",
  "Sell",
  "Edit",
];
export const PERIODS_LIST = ["7 Days", "30 Days", "90 Days", "All Time"];
export type ActivityFilterType = ActivityType | "All Types";
