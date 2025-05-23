import type { Daf } from '../../utils/endaoment-types';
import { getEndaomentUrls } from '../../utils/endaoment-urls';
import './AllDafs.css';

export const DONATION_TYPE_SELECTOR_ID = 'donation-type-selector';

export type DonationType = 'wire' | 'crypto';

interface DonationTypeSelectorProps {
  daf: Daf;
  onSelectType: (type: DonationType) => void;
  onClose: () => void;
}

export const DonationTypeSelector = ({
  daf,
  onSelectType,
  onClose,
}: DonationTypeSelectorProps) => {
  return (
    <div className="box" id={DONATION_TYPE_SELECTOR_ID}>
      <button className="close-button" type="button" onClick={onClose}>
        Close
      </button>
      <h4>
        {'Select Donation Type for '}
        <a href={`${getEndaomentUrls().app}/funds/${daf.id}`}>{daf.name}</a>
      </h4>
      <div className="donation-type-buttons">
        <button onClick={() => onSelectType('wire')} type="button">
          Wire Donation
        </button>
        <button onClick={() => onSelectType('crypto')} type="button">
          Crypto Donation
        </button>
      </div>
    </div>
  );
};
