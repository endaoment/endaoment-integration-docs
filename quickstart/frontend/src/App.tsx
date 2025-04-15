import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import './App.css';
import logo from './assets/logo.svg';
import { AllDafs } from './components/all-dafs/AllDafs';
import { NewDaf } from './components/new-daf/NewDaf';
import { OrgSearch } from './components/org-search/OrgSearch';
import { getEnvOrThrow } from './utils/env';

type View = 'none' | 'org-search' | 'all-dafs' | 'new-daf';

const checkSignedInQueryOptions = queryOptions({
  queryKey: ['Check Signed In'],
  queryFn: async (): Promise<boolean> => {
    const response = await fetch(
      `${getEnvOrThrow('SAFE_BACKEND_URL')}/check-login`,
      { credentials: 'include' },
    );
    const data = await response.json();
    return data.isSignedIn;
  },
});

function App() {
  // Pull login status from the server
  const { data: isSignedIn, refetch: refetchSignInStatus } = useQuery(
    checkSignedInQueryOptions,
  );
  const { mutate: signIn } = useMutation({
    mutationKey: ['Sign In'],
    mutationFn: async () => {
      console.log('Signing in');
      const response = await fetch(
        `${getEnvOrThrow('SAFE_BACKEND_URL')}/init-login`,
      );
      const { url } = await response.json();
      window.location.href = url;
    },
  });
  const { mutate: signOut } = useMutation({
    mutationKey: ['Sign Out'],
    mutationFn: async () => {
      await fetch(`${getEnvOrThrow('SAFE_BACKEND_URL')}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    },
    onSuccess: () => {
      refetchSignInStatus();
    },
  });

  // The current view the user is on
  const [currentView, setCurrentView] = useState<View>('none');

  return (
    <>
      <div>
        <a href="https://endaoment.org" target="_blank">
          <img src={logo} className="logo" alt="Endaoment logo" />
        </a>
      </div>
      <h1>Endaoment Quickstart</h1>
      <div className="action-buttons">
        <button type="button" onClick={() => setCurrentView('org-search')}>
          Search Orgs
        </button>

        {isSignedIn ? (
          <>
            <button type="button" onClick={() => setCurrentView('all-dafs')}>
              View My DAFs
            </button>
            <button type="button" onClick={() => setCurrentView('new-daf')}>
              Open A New DAF
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('none');
                signOut();
              }}
              data-color="red"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              setCurrentView('none');
              signIn();
            }}
            data-color="green"
          >
            Sign In
          </button>
        )}
      </div>
      <main>
        {currentView === 'org-search' && <OrgSearch />}
        {currentView === 'all-dafs' && <AllDafs />}
        {currentView === 'new-daf' && <NewDaf />}
      </main>
    </>
  );
}

export default App;
