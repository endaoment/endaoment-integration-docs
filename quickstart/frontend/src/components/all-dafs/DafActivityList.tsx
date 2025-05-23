import { useQuery } from '@tanstack/react-query';
import { getEnvOrThrow } from '../../utils/env';
import type { DafActivity } from '../../utils/endaoment-types';
import './AllDafs.css';
import { formatUsdc } from '../../utils/formatUsdc';
import { useState } from 'react';
import { formatDate } from '../../utils/formatDate';

const ACTIVITY_TYPE_TO_LABEL: Record<string, string> = {
  pending_grant: 'Pending Grant',
  grant: 'Grant',
  cash_donation_pledge: 'Cash Donation Pledge',
  crypto_donation_pledge: 'Crypto Donation Pledge',
};

// Helper function to format crypto amounts with decimal adjustment
const formatCryptoAmount = (
  amount: string,
  decimals: number,
  symbol: string,
): string => {
  const numericAmount = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const quotient = numericAmount / divisor;
  const remainder = numericAmount % divisor;

  if (remainder === 0n) {
    return `${quotient.toString()} ${symbol}`;
  }

  // For non-zero remainders, show decimal places
  const decimal = remainder
    .toString()
    .padStart(decimals, '0')
    .replace(/0+$/, '');
  return `${quotient.toString()}.${decimal} ${symbol}`;
};

// Helper function to get the formatted amount based on activity type
const getFormattedAmount = (activity: DafActivity): string => {
  if (activity.type === 'crypto_donation_pledge') {
    return formatCryptoAmount(
      activity.amount,
      activity.token.decimals,
      activity.token.symbol,
    );
  }
  return formatUsdc(activity.usdcAmount || '0');
};

export const DafActivityList = ({ dafId }: { dafId: string }) => {
  const dafActivityResponse = useQuery({
    queryKey: ['Daf Activity', dafId],
    queryFn: async (): Promise<DafActivity[]> => {
      const response = await fetch(
        `${getEnvOrThrow('SAFE_BACKEND_URL')}/get-daf-activity?fundId=${dafId}`,
        { credentials: 'include' },
      );
      const list = await response.json();

      if (!Array.isArray(list)) {
        throw new Error('Invalid response');
      }

      return list;
    },
  });

  const [isShowingActivity, setIsShowingActivity] = useState(false);
  const toggleShow = () => setIsShowingActivity((v) => !v);

  return (
    <div className="daf-activity">
      <button type="button" onClick={toggleShow}>
        {isShowingActivity ? 'Hide' : 'Show'} Activity
      </button>
      {isShowingActivity && (
        <>
          {dafActivityResponse.data ? (
            <>
              {dafActivityResponse.data.map((activity) => (
                <div
                  className="daf-activity-item"
                  key={
                    activity.occurredAtUtc +
                    activity.type +
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ((activity as any).pledgeId || activity.usdcAmount || '')
                  }
                >
                  <p>Type: {ACTIVITY_TYPE_TO_LABEL[activity.type]}</p>
                  <p>Amount: {getFormattedAmount(activity)}</p>
                  <p>At: {formatDate(activity.occurredAtUtc)}</p>
                </div>
              ))}
            </>
          ) : (
            <p>No activity yet</p>
          )}
        </>
      )}
    </div>
  );
};
