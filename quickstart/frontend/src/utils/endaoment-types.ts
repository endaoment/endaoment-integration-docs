type OrgAddress = {
  line1: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
};

export type OrgListing = {
  id: string | null;
  ein: string | null;
  name: string;
  description: string | null;
  address: OrgAddress;
  website: string | null;
  logo: string;
  nteeCode: string;
  nteeDescription: string;
  isCompliant: boolean;
  lifetimeContributionsUsdc: string;
  donationsReceived: number;
  grantsReceived: number;
};

export type Daf = {
  id: string;
  name: string;
  type: string;
  description: string;
  logo: string;
  usdcBalance: string;
  inTransitBuyUsdcAmount: string;
  inTransitSellUsdcAmount: string;
  processingTransfersTotalUsdc: string;
};

export type WireInstructions = {
  beneficiary: {
    name: string;
    accountNumber: string;
    typeOfAccount: string;
    address: string;
  };
  receivingBank: {
    abaRoutingNumber: string;
    name: string;
    address: string;
  };
};

// Shared types used in activity schemas
export type EntityLabelDto = {
  name: string;
  id: string;
  type: 'org' | 'fund' | 'subproject';
};

export type PortfolioLabelDto = {
  id: string;
  name: string;
  type:
    | 'AaveUsdc'
    | 'CompoundUsdc'
    | 'YearnUsdc'
    | 'SingleToken'
    | 'AaveUsdcV3'
    | 'CompoundUsdcV3'
    | 'TPlusN'
    | 'PrivateWealth'
    | 'IlliquidSellOverTime'
    | 'IlliquidAsset'
    | 'IlliquidLockedAdvisorManaged';
  symbol?: string | null;
};

export type StockListingDto = {
  name: string;
  ticker: string;
  id: string;
};

// Activity types based on OpenAPI schema
export type DonationActivity = {
  transactor: string | null;
  occurredAtUtc: string;
  transactorUrl: string | null;
  transactionHash: string | null;
  type: 'donation';
  automated: boolean;
  chainId: number | null;
  amount: string;
  usdcAmount: string;
  token: TokenListingDto | null;
  stock: StockListingDto | null;
  to: EntityLabelDto;
};

export type PortfolioTradeActivity = {
  transactor: string | null;
  occurredAtUtc: string;
  transactorUrl: string | null;
  transactionHash: string | null;
  type: 'portfolio_trade';
  automated: boolean;
  chainId: number | null;
  amount: string;
  usdcAmount: string;
  portfolio: PortfolioLabelDto;
  fund: EntityLabelDto;
  tradeType: 'Buy' | 'Sell';
  shares: string | null;
  outcome: 'InTransit' | 'Completed';
};

export type InternalTransferActivity = {
  transactor: string | null;
  occurredAtUtc: string;
  transactorUrl: string | null;
  transactionHash: string | null;
  type:
    | 'grant'
    | 'internal_transfer'
    | 'pending_grant'
    | 'pending_internal_transfer';
  automated: boolean;
  chainId: number | null;
  amount: string;
  usdcAmount: string;
  token: TokenListingDto;
  from: EntityLabelDto;
  to: EntityLabelDto;
};

export type StockDonationPledgeActivity = {
  transactor: string | null;
  occurredAtUtc: string;
  transactorUrl: string | null;
  transactionHash: string | null;
  type: 'stock_donation_pledge';
  automated: boolean;
  chainId: number | null;
  pledgeId: string;
  to: EntityLabelDto;
  outcome: 'Pending' | 'AwaitingAssets' | 'OnRamping' | 'Success' | 'Failure';
  stock: StockListingDto;
  usdcAmount: string;
};

export type CustodianCashPledgeActivity = {
  transactor: string | null;
  occurredAtUtc: string;
  transactorUrl: string | null;
  transactionHash: string | null;
  type: 'custodian_cash_pledge';
  automated: boolean;
  chainId: number | null;
  pledgeId: string;
  to: EntityLabelDto;
  outcome: 'Pending' | 'AwaitingAssets' | 'OnRamping' | 'Success' | 'Failure';
  usdcAmount: string;
};

export type CryptoDonationPledgeActivity = {
  transactor: string | null;
  occurredAtUtc: string;
  transactorUrl: string | null;
  transactionHash: string | null;
  type: 'crypto_donation_pledge' | 'nec_donation_pledge';
  automated: boolean;
  chainId: number | null;
  pledgeId: string;
  to: EntityLabelDto;
  outcome: 'Pending' | 'AwaitingAssets' | 'OnRamping' | 'Success' | 'Failure';
  token: TokenListingDto;
  amount: string;
  usdcAmount: string | null;
};

export type FiatDonationPledgeActivity = {
  transactor: string | null;
  occurredAtUtc: string;
  transactorUrl: string | null;
  transactionHash: string | null;
  type: 'fiat_donation_pledge';
  automated: boolean;
  chainId: number | null;
  pledgeId: string;
  to: EntityLabelDto;
  outcome: 'Pending' | 'AwaitingAssets' | 'OnRamping' | 'Success' | 'Failure';
  usdcAmount: string;
  selectedPaymentMethod: string | null;
};

export type CashDonationPledgeActivity = {
  transactor: string | null;
  occurredAtUtc: string;
  transactorUrl: string | null;
  transactionHash: string | null;
  type: 'cash_donation_pledge';
  automated: boolean;
  chainId: number | null;
  pledgeId: string;
  to: EntityLabelDto;
  outcome: 'Pending' | 'AwaitingAssets' | 'OnRamping' | 'Success' | 'Failure';
  usdcAmount: string;
  cashTransferType: 'DafMigration' | 'WirePledge';
};

// Union type for all activity types
export type DafActivity =
  | DonationActivity
  | PortfolioTradeActivity
  | InternalTransferActivity
  | StockDonationPledgeActivity
  | CustodianCashPledgeActivity
  | CryptoDonationPledgeActivity
  | FiatDonationPledgeActivity
  | CashDonationPledgeActivity;

export type TokenListingDto = {
  id: number;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl: string;
  type: 'Token' | 'EvmToken' | 'OtcToken';
  featured: boolean;
  popularity: number;
  chainId?: number;
  contractAddress?: string;
  otcAddress?: string;
  memo?: string;
};

export type SupportedTokensResponseDto = {
  tokens: TokenListingDto[];
};
