import { useState } from 'react';
import { useQuery, queryOptions } from '@tanstack/react-query';
import type {
  Daf,
  TokenListingDto,
  SupportedTokensResponseDto,
} from '../../utils/endaoment-types';
import { getEndaomentUrls } from '../../utils/endaoment-urls';
import { getEnvOrThrow } from '../../utils/env';

export const CRYPTO_BOX_ID = 'crypto-box';

const tokensQueryOptions = queryOptions({
  queryKey: ['tokens', 'otc'],
  queryFn: async (): Promise<SupportedTokensResponseDto> => {
    const response = await fetch(
      `${getEnvOrThrow('SAFE_BACKEND_URL')}/get-tokens`,
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },
  select: (data) => {
    const filteredOtcTokens = data.tokens.filter((token) => token.otcAddress);
    const groupedTokens: Record<string, TokenListingDto[]> = {};
    for (const token of filteredOtcTokens) {
      const label = `${token.name} (${token.symbol})`;
      if (!groupedTokens[label]) {
        groupedTokens[label] = [];
      }
      groupedTokens[label].push(token);
    }
    return {
      // Convert the record to an array of { label, tokens }
      tokens: Object.entries(groupedTokens).map(([label, tokens]) => ({
        label,
        tokens,
      })),
    };
  },
});

export interface TokenGroup {
  label: string;
  tokens: TokenListingDto[];
}

export const CryptoBox = ({
  daf,
  onClose,
}: {
  daf: Daf;
  onClose: () => void;
}) => {
  const { data: tokensData, isLoading, error } = useQuery(tokensQueryOptions);
  const groupedTokens = tokensData?.tokens || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTokenGroup, setSelectedTokenGroup] = useState<
    TokenGroup | undefined
  >();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [transactionHash, setTransactionHash] = useState('');
  const [selectedFullToken, setSelectedFullToken] =
    useState<TokenListingDto | null>(null);
  const [selectedAddressMemoComboKey, setSelectedAddressMemoComboKey] =
    useState<string | null>(null);

  const handleNextStep = () => {
    setSelectedFullToken(null);
    setSelectedAddressMemoComboKey(null);
    setTransactionHash('');
    setCurrentStep(currentStep + 1);
  };
  const handlePreviousStep = () => setCurrentStep(currentStep - 1);

  const filteredTokenGroups = groupedTokens.filter((group) => {
    const term = searchTerm.toLowerCase();
    return group.label.toLowerCase().includes(term);
  });

  const handleSelectTokenGroup = (group: TokenGroup) => {
    setSelectedTokenGroup(group);
    console.log('Selected token group:', group);
    setSearchTerm(group.label);
    setIsInputFocused(false);
  };

  const renderTokenDetailsAndChainSelector = () => {
    if (!selectedTokenGroup) return null;
    const { tokens } = selectedTokenGroup;

    const otcToken = tokens.find((token) => token.type === 'OtcToken');
    if (otcToken) {
      if (!selectedFullToken || selectedFullToken.id !== otcToken.id) {
        setSelectedFullToken(otcToken);
      }
      return (
        <div className="token-details">
          <p>
            <strong>Address:</strong> {otcToken.otcAddress}
          </p>
          {otcToken.memo && (
            <p>
              <strong>Memo:</strong> {otcToken.memo}
            </p>
          )}
        </div>
      );
    }

    const addressMemoGroups: Record<string, TokenListingDto[]> = {};
    tokens.forEach((token) => {
      const key = `${token.otcAddress || 'no-address'}-${
        token.memo || 'no-memo'
      }`;
      if (!addressMemoGroups[key]) {
        addressMemoGroups[key] = [];
      }
      addressMemoGroups[key].push(token);
    });

    const uniqueAddressMemoCombos = Object.entries(addressMemoGroups).map(
      ([key, comboTokens]) => ({
        key,
        address: comboTokens[0].otcAddress!,
        memo: comboTokens[0].memo,
        tokensInCombo: comboTokens,
        distinctChainIds: Array.from(
          new Set(
            comboTokens.map((t) => t.chainId).filter((id) => id !== undefined),
          ),
        ),
      }),
    );

    let comboToProcess = null;

    if (uniqueAddressMemoCombos.length === 1) {
      comboToProcess = uniqueAddressMemoCombos[0];
    } else if (selectedAddressMemoComboKey) {
      comboToProcess =
        uniqueAddressMemoCombos.find(
          (c) => c.key === selectedAddressMemoComboKey,
        ) || null;
    }

    if (uniqueAddressMemoCombos.length > 1 && !selectedAddressMemoComboKey) {
      return (
        <div className="token-details">
          <p>
            This token has multiple deposit configurations. Please select one:
          </p>
          {uniqueAddressMemoCombos.map((combo) => (
            <div key={combo.key} className="chain-selection-option">
              <input
                type="radio"
                id={`combo-option-${combo.key}`}
                name="combo-option"
                onChange={() => {
                  setSelectedAddressMemoComboKey(combo.key);
                  setSelectedFullToken(null);
                }}
              />
              <label htmlFor={`combo-option-${combo.key}`}>
                <strong>Address:</strong> {combo.address}
                {combo.memo && (
                  <>
                    {' '}
                    <br />
                    <strong>Memo:</strong> {combo.memo}
                  </>
                )}
                (Available on chains:{' '}
                {combo.distinctChainIds.join(', ') || 'N/A'})
              </label>
            </div>
          ))}
        </div>
      );
    }

    if (comboToProcess) {
      if (comboToProcess.distinctChainIds.length <= 1) {
        const tokenToSelect = comboToProcess.tokensInCombo[0];
        if (!selectedFullToken || selectedFullToken.id !== tokenToSelect.id) {
          setSelectedFullToken(tokenToSelect);
        }
      } else {
        if (
          selectedFullToken &&
          (selectedFullToken.otcAddress !== comboToProcess.address ||
            selectedFullToken.memo !== comboToProcess.memo)
        ) {
          setSelectedFullToken(null);
        }
        return (
          <div className="token-details">
            <p>
              <strong>Address:</strong> {comboToProcess.address}
            </p>
            {comboToProcess.memo && (
              <p>
                <strong>Memo:</strong> {comboToProcess.memo}
              </p>
            )}
            <label
              htmlFor="chain-id-select"
              style={{ display: 'block', marginTop: '10px' }}
            >
              Select Network (Chain ID):
            </label>
            <select
              id="chain-id-select"
              onChange={(e) => {
                const selectedCId = parseInt(e.target.value, 10);
                const token = comboToProcess!.tokensInCombo.find(
                  (t) => t.chainId === selectedCId,
                );
                if (token) setSelectedFullToken(token);
              }}
              value={selectedFullToken?.chainId || ''}
              style={{ marginTop: '5px' }}
            >
              <option value="" disabled>
                -- Select Chain --
              </option>
              {comboToProcess.distinctChainIds.map((chainId) => (
                <option key={chainId} value={chainId}>
                  {chainId}
                </option>
              ))}
            </select>
          </div>
        );
      }
      if (
        selectedFullToken &&
        selectedFullToken.otcAddress === comboToProcess.address &&
        selectedFullToken.memo === comboToProcess.memo
      ) {
        return (
          <div className="token-details">
            <p>
              <strong>Address:</strong> {selectedFullToken.otcAddress}
            </p>
            {selectedFullToken.memo && (
              <p>
                <strong>Memo:</strong> {selectedFullToken.memo}
              </p>
            )}
            {selectedFullToken.chainId && (
              <p>
                <strong>Chain ID:</strong> {selectedFullToken.chainId}
              </p>
            )}
          </div>
        );
      }
    }
    return <p>Please make a selection.</p>;
  };

  const handleFinalContinue = async () => {
    if (
      !selectedTokenGroup ||
      !donationAmount ||
      !transactionHash ||
      !selectedFullToken
    ) {
      alert('Please ensure all fields are selected and filled correctly.');
      return;
    }

    console.log('Donation Details:', {
      tokenGroupLabel: selectedTokenGroup.label,
      amount: donationAmount,
      transactionHash,
      selectedToken: selectedFullToken,
    });

    // Convert donation amount to decimal representation
    const convertToDecimalAmount = (
      amount: string,
      decimals: number,
    ): string => {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount)) {
        throw new Error('Invalid donation amount');
      }
      // Multiply by 10^decimals to get the smallest unit
      const decimalAmount = Math.floor(numAmount * Math.pow(10, decimals));
      return decimalAmount.toString();
    };

    let convertedAmount: string;
    try {
      convertedAmount = convertToDecimalAmount(
        donationAmount,
        selectedFullToken.decimals,
      );
    } catch (error) {
      alert(
        `Invalid donation amount: ${
          error instanceof Error
            ? error.message
            : 'Please enter a valid number.'
        }`,
      );
      return;
    }

    // Construct the payload for the backend
    const payload = {
      tokenId: selectedFullToken.id,
      inputAmount: convertedAmount, // Now using the decimal representation
      otcDonationTransactionHash: transactionHash,
      receivingFundId: daf.id,
      receivingEntityType: 'fund',
    };

    try {
      const response = await fetch(
        `${getEnvOrThrow('SAFE_BACKEND_URL')}/create-crypto-pledge`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Failed to create crypto donation pledge',
        );
      }

      const result = await response.json();
      console.log('Crypto Donation Pledge Response:', result);
      alert(
        `Crypto donation pledge created successfully! Pledge ID: ${result.id}`,
      );
      onClose(); // Close the modal on success
    } catch (error) {
      console.error('Error creating crypto donation pledge:', error);
      alert(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  };

  return (
    <div className="box" id={CRYPTO_BOX_ID}>
      <button className="close-button" type="button" onClick={onClose}>
        Close
      </button>
      <h4>
        {'Donate Crypto to '}
        <a href={`${getEndaomentUrls().app}/funds/${daf.id}`}>{daf.name}</a>
      </h4>

      {isLoading && <p>Loading tokens...</p>}
      {error && <p>Error fetching tokens: {error.message}</p>}

      {!isLoading && !error && currentStep === 1 && (
        <>
          <div className="token-search-container">
            <label htmlFor="token-search">Select Token:</label>
            <input
              type="text"
              id="token-search"
              className="token-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                setIsInputFocused(true);
                setSelectedTokenGroup(undefined);
                setDonationAmount('');
              }}
              onBlur={() => setTimeout(() => setIsInputFocused(false), 100)}
              disabled={isLoading || !!error}
              placeholder="Search by name or symbol (e.g., WETH)"
            />
            {isInputFocused &&
              !selectedTokenGroup &&
              (filteredTokenGroups.length > 0 || searchTerm === '') && (
                <ul className="token-dropdown">
                  {(searchTerm === ''
                    ? groupedTokens.slice(0, 5)
                    : filteredTokenGroups
                  ).map((group) => (
                    <li
                      key={group.tokens[0]?.id || group.label}
                      onMouseDown={() => handleSelectTokenGroup(group)}
                    >
                      <img
                        src={group.tokens[0]?.logoUrl}
                        alt={group.label}
                        width="20"
                        height="20"
                      />
                      {group.label}
                    </li>
                  ))}
                  {searchTerm === '' && groupedTokens.length > 5 && (
                    <li className="token-dropdown-info">Type to see more...</li>
                  )}
                </ul>
              )}
          </div>

          {selectedTokenGroup && (
            <div className="donation-amount-input">
              <label
                style={{
                  width: '200px',
                }}
                htmlFor="donation-amount"
              >
                Amount to Donate:
              </label>
              <input
                type="text"
                id="donation-amount"
                className="donation-amount-input"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder={`Enter amount in ${
                  selectedTokenGroup.tokens[0]?.symbol || 'tokens'
                }`}
              />
            </div>
          )}

          {selectedTokenGroup && donationAmount && (
            <button onClick={handleNextStep} className="step-button">
              Continue
            </button>
          )}
        </>
      )}

      {!isLoading && !error && currentStep === 2 && (
        <>
          <p>
            <strong>Step 2: Confirm Network & Transaction</strong>
          </p>
          {selectedTokenGroup && (
            <div className="step2-summary">
              <p>
                Reviewing for: {selectedTokenGroup.label} - {donationAmount}{' '}
                {selectedTokenGroup.tokens[0]?.symbol}
              </p>
            </div>
          )}

          <div className="step2-details-container">
            {renderTokenDetailsAndChainSelector()}

            {selectedFullToken && (
              <>
                <p
                  className="donation-prompt"
                  style={{ marginTop: '15px', marginBottom: '5px' }}
                >
                  Please send {donationAmount}{' '}
                  {selectedTokenGroup?.tokens[0]?.symbol} to the selected
                  address and network.
                </p>
                <div
                  className="transaction-hash-input"
                  style={{ marginTop: '5px' }}
                >
                  <label
                    htmlFor="transaction-hash"
                    style={{ marginRight: '5px' }}
                  >
                    Transaction Hash:
                  </label>
                  <input
                    type="text"
                    id="transaction-hash"
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    placeholder="Enter transaction hash"
                  />
                </div>
              </>
            )}
          </div>

          <div className="step-navigation" style={{ marginTop: '20px' }}>
            <button
              onClick={handlePreviousStep}
              className="step-button"
              style={{ marginRight: '10px' }}
            >
              Back
            </button>
            <button
              onClick={handleFinalContinue}
              className="step-button"
              disabled={!transactionHash || !selectedFullToken}
              style={{
                backgroundColor:
                  !transactionHash || !selectedFullToken ? 'grey' : '',
                cursor:
                  !transactionHash || !selectedFullToken
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              Confirm Donation
            </button>
          </div>
        </>
      )}
    </div>
  );
};
