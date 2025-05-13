import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEnvOrThrow } from '../../utils/env';
import './AllDafs.css'; // Assuming shared styles
import { useState } from 'react';

// Matches the backend DTO
export interface CollaboratorListingDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  collaboratorUserId: string;
  fundId: string;
}

export const CollaboratorList = ({ dafId }: { dafId: string }) => {
  const queryClient = useQueryClient(); // Get query client instance

  const collaboratorsQuery = useQuery({
    queryKey: ['Fund Collaborators', dafId],
    queryFn: async (): Promise<CollaboratorListingDto[]> => {
      // This backend endpoint will need to be created.
      // It should call the getCollaboratorsForFund util function.
      const response = await fetch(
        `${getEnvOrThrow(
          'SAFE_BACKEND_URL',
        )}/get-fund-collaborators?fundId=${dafId}`,
        { credentials: 'include' },
      );
      if (!response.ok) {
        throw new Error(
          'Network response was not ok when fetching collaborators',
        );
      }
      const list = await response.json();

      if (!Array.isArray(list)) {
        throw new Error('Invalid response when fetching collaborators');
      }

      return list;
    },
    enabled: false, // Only fetch when the list is shown
  });

  const [isShowingCollaborators, setIsShowingCollaborators] = useState(false);

  const toggleShow = () => {
    setIsShowingCollaborators((v) => !v);
    if (!isShowingCollaborators && !collaboratorsQuery.data) {
      collaboratorsQuery.refetch();
    }
  };

  const deleteCollaboratorMutation = useMutation({
    mutationFn: async (collaboratorId: string) => {
      const response = await fetch(
        `${getEnvOrThrow(
          'SAFE_BACKEND_URL',
        )}/remove-collaborator/${dafId}/${collaboratorId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete collaborator');
      }
      return response.json(); // Or handle no content response if API returns 204
    },
    onSuccess: () => {
      // Invalidate and refetch the collaborators list
      queryClient.invalidateQueries({
        queryKey: ['Fund Collaborators', dafId],
      });
      // Optionally, add a success notification here
      console.log('Collaborator deleted successfully');
    },
    onError: (error) => {
      // Optionally, add an error notification here
      console.error('Error deleting collaborator:', error.message);
    },
  });

  const handleDeleteCollaborator = (collaboratorId: string) => {
    // console.log('Deleting collaborator', collaboratorId); // Old log
    deleteCollaboratorMutation.mutate(collaboratorId);
  };

  return (
    <div className="daf-collaborators">
      <button type="button" onClick={toggleShow}>
        {isShowingCollaborators ? 'Hide' : 'Show'} Collaborators
      </button>
      {isShowingCollaborators && (
        <>
          {collaboratorsQuery.isLoading && <p>Loading collaborators...</p>}
          {collaboratorsQuery.isError && <p>Error fetching collaborators.</p>}
          {collaboratorsQuery.data && collaboratorsQuery.data.length > 0 && (
            <ul
              className="collaborator-list"
              style={{ listStyle: 'none', padding: 0, marginTop: '15px' }}
            >
              {collaboratorsQuery.data.map((collaborator) => (
                <li
                  key={collaborator.id}
                  className="collaborator-item"
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '10px',
                    backgroundColor: '#f9f9f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#333' }}>
                      {collaborator.firstName} {collaborator.lastName}
                    </span>
                    <br />
                    <span style={{ fontSize: '0.9em', color: '#555' }}>
                      ({collaborator.email})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteCollaborator(collaborator.collaboratorUserId)
                    }
                    style={{
                      color: 'red',
                      marginLeft: '10px',
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none',
                    }}
                    disabled={
                      deleteCollaboratorMutation.isPending &&
                      deleteCollaboratorMutation.variables === collaborator.id
                    }
                  >
                    {deleteCollaboratorMutation.isPending &&
                    deleteCollaboratorMutation.variables === collaborator.id
                      ? 'Deleting...'
                      : 'X'}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {collaboratorsQuery.data && collaboratorsQuery.data.length === 0 && (
            <p>No collaborators found for this DAF.</p>
          )}
        </>
      )}
    </div>
  );
};
