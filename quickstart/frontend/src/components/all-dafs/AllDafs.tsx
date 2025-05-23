import { queryOptions, useQuery } from '@tanstack/react-query';
import { getEnvOrThrow } from '../../utils/env';
import type { Daf } from '../../utils/endaoment-types';
import './AllDafs.css';
import { useReducer, useState } from 'react';
import { DONATE_BOX_ID, DonateBox } from './DonateBox';
import { GRANT_BOX_ID, GrantBox } from './GrantBox';
import { getEndaomentUrls } from '../../utils/endaoment-urls';
import { formatUsdc } from '../../utils/formatUsdc';
import { DafActivityList } from './DafActivityList';
import { CollaboratorList } from './CollaboratorList';
import {
  DONATION_TYPE_SELECTOR_ID,
  DonationTypeSelector,
  DonationType,
} from './DonationTypeSelector';
import { CRYPTO_BOX_ID, CryptoBox } from './CryptoBox';

const allDafsQueryOptions = queryOptions({
  queryKey: ['All DAFs'],
  queryFn: async (): Promise<Daf[]> => {
    const response = await fetch(
      `${getEnvOrThrow('SAFE_BACKEND_URL')}/get-dafs`,
      { credentials: 'include' },
    );
    const list = await response.json();

    if (!Array.isArray(list)) {
      throw new Error('Invalid response');
    }

    return list;
  },
});

export const AllDafs = () => {
  const allDafsResponse = useQuery(allDafsQueryOptions);

  const [focusedDaf, setFocusedDaf] = useReducer(
    (_prev: Daf | undefined, nextId: string | undefined) => {
      if (!nextId) return undefined;
      if (!allDafsResponse.data) return undefined;

      const foundDaf = allDafsResponse.data.find((daf) => daf.id === nextId);
      if (!foundDaf) return undefined;
      return foundDaf;
    },
    undefined,
  );
  const [isShowingDonateBox, setIsShowingDonateBox] = useState(false);
  const [isShowingGrantBox, setIsShowingGrantBox] = useState(false);
  const [isShowingDonationTypeSelector, setIsShowingDonationTypeSelector] =
    useState(false);
  const [isShowingCryptoBox, setIsShowingCryptoBox] = useState(false);

  const handleDonate = (id: string) => {
    setFocusedDaf(id);
    setIsShowingDonationTypeSelector(true);
    setIsShowingDonateBox(false);
    setIsShowingCryptoBox(false);
    setIsShowingGrantBox(false);
    document.getElementById(DONATION_TYPE_SELECTOR_ID)?.scrollIntoView();
  };

  const handleSelectDonationType = (type: DonationType) => {
    setIsShowingDonationTypeSelector(false);

    if (type === 'wire') {
      setIsShowingDonateBox(true);
      document.getElementById(DONATE_BOX_ID)?.scrollIntoView();
    } else if (type === 'crypto') {
      setIsShowingCryptoBox(true);
      document.getElementById(CRYPTO_BOX_ID)?.scrollIntoView();
    }
  };

  const handleGrant = (id: string) => {
    if (!focusedDaf || focusedDaf.id !== id || !isShowingGrantBox) {
      setFocusedDaf(id);
      setIsShowingGrantBox(true);
      document.getElementById(GRANT_BOX_ID)?.scrollIntoView();
    }
    setIsShowingDonateBox(false);
    setIsShowingDonationTypeSelector(false);
    setIsShowingCryptoBox(false);
  };

  const handleClose = () => {
    setIsShowingDonateBox(false);
    setIsShowingGrantBox(false);
    setIsShowingDonationTypeSelector(false);
    setIsShowingCryptoBox(false);
    setFocusedDaf(undefined);
  };

  return (
    <>
      {isShowingDonationTypeSelector && focusedDaf && (
        <DonationTypeSelector
          daf={focusedDaf}
          onSelectType={handleSelectDonationType}
          onClose={handleClose}
        />
      )}
      {isShowingDonateBox && focusedDaf && (
        <DonateBox daf={focusedDaf} onClose={handleClose} />
      )}
      {isShowingCryptoBox && focusedDaf && (
        <CryptoBox daf={focusedDaf} onClose={handleClose} />
      )}
      {isShowingGrantBox && focusedDaf && (
        <GrantBox daf={focusedDaf} onClose={handleClose} />
      )}
      {allDafsResponse.data && (
        <ul className="daf-list">
          {allDafsResponse.data.map((daf) => (
            <li className="box" key={daf.id}>
              <a href={`${getEndaomentUrls().app}/funds/${daf.id}`}>
                {daf.name}
              </a>
              <p>{daf.description}</p>
              <p>Balance: {formatUsdc(daf.usdcBalance)} USDC</p>
              <div className="daf-buttons">
                <button onClick={() => handleDonate(daf.id)} type="button">
                  Donate
                </button>
                <button
                  onClick={() => handleGrant(daf.id)}
                  type="button"
                  disabled={BigInt(daf.usdcBalance) === 0n}
                >
                  Grant
                </button>
              </div>
              <DafActivityList dafId={daf.id} />
              <CollaboratorList dafId={daf.id} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
