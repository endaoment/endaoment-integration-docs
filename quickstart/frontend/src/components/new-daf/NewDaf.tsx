import type { FormEvent } from 'react';
import './NewDaf.css';
import { useMutation } from '@tanstack/react-query';
import { getEnvOrThrow } from '../../utils/env';

// ISO 3166-1 alpha-3 country codes
const COUNTRY_CODES = [
  { code: 'USA', name: 'United States' },
  { code: 'GBR', name: 'United Kingdom' },
  { code: 'CAN', name: 'Canada' },
  { code: 'AUS', name: 'Australia' },
  { code: 'DEU', name: 'Germany' },
  { code: 'FRA', name: 'France' },
  { code: 'ITA', name: 'Italy' },
  { code: 'ESP', name: 'Spain' },
  { code: 'JPN', name: 'Japan' },
  { code: 'CHN', name: 'China' },
  { code: 'IND', name: 'India' },
  { code: 'BRA', name: 'Brazil' },
  { code: 'MEX', name: 'Mexico' },
  { code: 'ZAF', name: 'South Africa' },
  { code: 'RUS', name: 'Russia' },
  { code: 'KOR', name: 'South Korea' },
  { code: 'NLD', name: 'Netherlands' },
  { code: 'CHE', name: 'Switzerland' },
  { code: 'SWE', name: 'Sweden' },
  { code: 'NOR', name: 'Norway' },
  { code: 'DNK', name: 'Denmark' },
  { code: 'FIN', name: 'Finland' },
  { code: 'IRL', name: 'Ireland' },
  { code: 'PRT', name: 'Portugal' },
  { code: 'GRC', name: 'Greece' },
  { code: 'POL', name: 'Poland' },
  { code: 'CZE', name: 'Czech Republic' },
  { code: 'HUN', name: 'Hungary' },
  { code: 'ROU', name: 'Romania' },
  { code: 'BGR', name: 'Bulgaria' },
  { code: 'HRV', name: 'Croatia' },
  { code: 'SVK', name: 'Slovakia' },
  { code: 'SVN', name: 'Slovenia' },
  { code: 'EST', name: 'Estonia' },
  { code: 'LVA', name: 'Latvia' },
  { code: 'LTU', name: 'Lithuania' },
  { code: 'CYP', name: 'Cyprus' },
  { code: 'MLT', name: 'Malta' },
  { code: 'LUX', name: 'Luxembourg' },
  { code: 'BEL', name: 'Belgium' },
  { code: 'AUT', name: 'Austria' },
  { code: 'NZL', name: 'New Zealand' },
  { code: 'SGP', name: 'Singapore' },
  { code: 'HKG', name: 'Hong Kong' },
  { code: 'TWN', name: 'Taiwan' },
  { code: 'ISR', name: 'Israel' },
  { code: 'ARE', name: 'United Arab Emirates' },
  { code: 'SAU', name: 'Saudi Arabia' },
  { code: 'QAT', name: 'Qatar' },
  { code: 'KWT', name: 'Kuwait' },
  { code: 'BHR', name: 'Bahrain' },
  { code: 'OMN', name: 'Oman' },
  { code: 'JOR', name: 'Jordan' },
  { code: 'LBN', name: 'Lebanon' },
  { code: 'EGY', name: 'Egypt' },
  { code: 'MAR', name: 'Morocco' },
  { code: 'TUN', name: 'Tunisia' },
  { code: 'DZA', name: 'Algeria' },
  { code: 'LBY', name: 'Libya' },
  { code: 'SDN', name: 'Sudan' },
  { code: 'ETH', name: 'Ethiopia' },
  { code: 'KEN', name: 'Kenya' },
  { code: 'NGA', name: 'Nigeria' },
  { code: 'GHA', name: 'Ghana' },
  { code: 'CIV', name: "Côte d'Ivoire" },
  { code: 'SEN', name: 'Senegal' },
  { code: 'TZA', name: 'Tanzania' },
  { code: 'UGA', name: 'Uganda' },
  { code: 'ZWE', name: 'Zimbabwe' },
  { code: 'ZMB', name: 'Zambia' },
  { code: 'MOZ', name: 'Mozambique' },
  { code: 'AGO', name: 'Angola' },
  { code: 'NAM', name: 'Namibia' },
  { code: 'BWA', name: 'Botswana' },
  { code: 'MWI', name: 'Malawi' },
  { code: 'MDG', name: 'Madagascar' },
  { code: 'MUS', name: 'Mauritius' },
  { code: 'SYC', name: 'Seychelles' },
  { code: 'COM', name: 'Comoros' },
  { code: 'DJI', name: 'Djibouti' },
  { code: 'ERI', name: 'Eritrea' },
  { code: 'SOM', name: 'Somalia' },
  { code: 'SSD', name: 'South Sudan' },
  { code: 'CAF', name: 'Central African Republic' },
  { code: 'CMR', name: 'Cameroon' },
  { code: 'COD', name: 'Democratic Republic of the Congo' },
  { code: 'COG', name: 'Republic of the Congo' },
  { code: 'GAB', name: 'Gabon' },
  { code: 'GNQ', name: 'Equatorial Guinea' },
  { code: 'STP', name: 'São Tomé and Príncipe' },
  { code: 'GNB', name: 'Guinea-Bissau' },
  { code: 'GIN', name: 'Guinea' },
  { code: 'SLE', name: 'Sierra Leone' },
  { code: 'LBR', name: 'Liberia' },
  { code: 'MLI', name: 'Mali' },
  { code: 'BFA', name: 'Burkina Faso' },
  { code: 'NER', name: 'Niger' },
  { code: 'TCD', name: 'Chad' },
  { code: 'MRT', name: 'Mauritania' },
  { code: 'ESH', name: 'Western Sahara' },
  { code: 'CPV', name: 'Cape Verde' },
  { code: 'GMB', name: 'Gambia' },
  { code: 'BEN', name: 'Benin' },
  { code: 'TGO', name: 'Togo' },
];

export const NewDaf = () => {
  const {
    mutate: createDaf,
    isIdle,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationKey: ['Create DAF'],
    mutationFn: async (formData: FormData) => {
      const rawFormObject = Object.fromEntries(formData.entries());

      const cleanedForm = {
        name: rawFormObject['name'],
        description: rawFormObject['description'],
        fundAdvisor: {
          firstName: rawFormObject['fundAdvisor.firstName'],
          lastName: rawFormObject['fundAdvisor.lastName'],
          email: rawFormObject['fundAdvisor.email'],
          address: {
            line1: rawFormObject['fundAdvisor.address.line1'],
            line2: rawFormObject['fundAdvisor.address.line2'],
            city: rawFormObject['fundAdvisor.address.city'],
            state: rawFormObject['fundAdvisor.address.state'],
            zip: rawFormObject['fundAdvisor.address.zip'],
            country: rawFormObject['fundAdvisor.address.country'],
          },
        },
        addMyAdvisorToDaf: rawFormObject['addMyAdvisorToDaf'] === 'on',
      };

      const response = await fetch(
        `${getEnvOrThrow('SAFE_BACKEND_URL')}/create-daf`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanedForm),
          credentials: 'include',
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Server error: ${response.status} ${response.statusText}`,
        );
      }

      return response.json();
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createDaf(new FormData(e.currentTarget));
  };

  return (
    <form id="create-daf-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Fund Name</label>
        <input type="text" id="name" name="name" required />
      </div>

      <div>
        <label htmlFor="description">Fund Description</label>
        <textarea id="description" name="description" required></textarea>
      </div>

      <div>
        <label htmlFor="fundAdvisor.firstName">Advisor First Name</label>
        <input
          type="text"
          id="fundAdvisor.firstName"
          name="fundAdvisor.firstName"
          required
        />
      </div>

      <div>
        <label htmlFor="fundAdvisor.lastName">Advisor Last Name</label>
        <input
          type="text"
          id="fundAdvisor.lastName"
          name="fundAdvisor.lastName"
          required
        />
      </div>

      <div>
        <label htmlFor="fundAdvisor.email">Advisor Email</label>
        <input
          type="email"
          id="fundAdvisor.email"
          name="fundAdvisor.email"
          required
        />
      </div>

      <div>
        <label htmlFor="fundAdvisor.address.line1">
          Advisor Address Line 1
        </label>
        <input
          type="text"
          id="fundAdvisor.address.line1"
          name="fundAdvisor.address.line1"
          required
        />
      </div>

      <div>
        <label htmlFor="fundAdvisor.address.line2">
          Advisor Address Line 2
        </label>
        <input
          type="text"
          id="fundAdvisor.address.line2"
          name="fundAdvisor.address.line2"
        />
      </div>

      <div>
        <label htmlFor="fundAdvisor.address.city">Advisor City</label>
        <input
          type="text"
          id="fundAdvisor.address.city"
          name="fundAdvisor.address.city"
          required
        />
      </div>

      <div>
        <label htmlFor="fundAdvisor.address.state">Advisor State</label>
        <input
          type="text"
          id="fundAdvisor.address.state"
          name="fundAdvisor.address.state"
          required
        />
      </div>

      <div>
        <label htmlFor="fundAdvisor.address.zip">Advisor Zip</label>
        <input
          type="text"
          id="fundAdvisor.address.zip"
          name="fundAdvisor.address.zip"
          required
        />
      </div>

      <div>
        <label htmlFor="fundAdvisor.address.country">Advisor Country</label>
        <select
          id="fundAdvisor.address.country"
          name="fundAdvisor.address.country"
          defaultValue="USA"
          required
        >
          {COUNTRY_CODES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name} ({country.code})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="addMyAdvisorToDaf">
          <input
            type="checkbox"
            id="addMyAdvisorToDaf"
            name="addMyAdvisorToDaf"
          />
          Add my Financial Advisor to the DAF
        </label>
      </div>

      {isIdle || isError ? (
        <button type="submit">
          {isIdle && 'Create DAF'}
          {isError && 'Error Creating DAF, Try Again'}
        </button>
      ) : (
        <span>
          {isPending && 'Creating DAF...'}
          {isSuccess && 'DAF Created!'}
        </span>
      )}
    </form>
  );
};
