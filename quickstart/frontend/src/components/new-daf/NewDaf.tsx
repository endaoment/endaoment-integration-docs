import type { FormEvent } from 'react';
import './NewDaf.css';
import { useMutation } from '@tanstack/react-query';
import { getEnvOrThrow } from '../../utils/env';

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
        }
      );

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
        {/*  Ideally, this should be a Dropdown Selector in your app. We kept it as a form for simplicity */}
        <label htmlFor="fundAdvisor.address.country">Advisor Country (Must be an ISO 3166-1 alpha-3 Country Code)</label>
        <input
          type="text"
          id="fundAdvisor.address.country"
          name="fundAdvisor.address.country"
          placeholder="USA"
          required
        />
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
