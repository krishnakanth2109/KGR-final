// src/features/faculty/facultyQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getFaculty,
    getFacultyById,
    addFaculty,
    updateFaculty,
    setFacultyStatus
} from '../../api/facultyApi';

/**
 * Custom hook to fetch the list of faculty members with filters.
 * React Query will automatically cache and refetch this data when filters change.
 * @param {object} filters - The filter object from the UI state (e.g., { department, status, ... }).
 * @returns The result of the useQuery hook, including `data`, `isLoading`, `isError`, and `error`.
 */
export const useGetFaculty = (filters) => {
    return useQuery({
        // The query key uniquely identifies this query. Including `filters` ensures
        // the query refetches automatically when the filter values change.
        queryKey: ['faculty', filters], 
        queryFn: () => getFaculty(filters),
    });
};

/**
 * Custom hook to fetch a single faculty member by their unique ID.
 * @param {string|null} id - The _id of the faculty member to fetch.
 * @returns The query result for a single faculty member.
 */
export const useGetFacultyById = (id) => {
    return useQuery({
        queryKey: ['facultyMember', id],
        queryFn: () => getFacultyById(id),
        // This query will only run if an `id` is provided, preventing unnecessary API calls.
        enabled: !!id, 
    });
};

/**
 * Custom hook for adding a new faculty member.
 * @returns A mutation object from React Query with methods like `mutate`.
 */
export const useAddFaculty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addFaculty,
        // After a new faculty member is added successfully, invalidate the main 'faculty' query
        // to trigger an automatic refetch of the list.
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['faculty'] });
        },
    });
};

/**
 * Custom hook for updating an existing faculty member.
 * @returns A mutation object from React Query.
 */
export const useUpdateFaculty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        // The mutation function expects an object containing the `id` and the updated `data`.
        mutationFn: ({ id, data }) => updateFaculty(id, data),
        onSuccess: (updatedFacultyMember, variables) => {
            // After an update, refetch both the main list and the specific member's profile data.
            queryClient.invalidateQueries({ queryKey: ['faculty'] });
            queryClient.invalidateQueries({ queryKey: ['facultyMember', variables.id] });
        },
    });
};

/**
 * Custom hook for changing a faculty member's status.
 * @returns A mutation object from React Query.
 */
export const useSetFacultyStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: setFacultyStatus, 
        onSuccess: (data, variables) => {
            // After changing the status, refetch both the list and the specific member's profile.
            queryClient.invalidateQueries({ queryKey: ['faculty'] });
            queryClient.invalidateQueries({ queryKey: ['facultyMember', variables.id] });
        },
    });
};