// src/features/students/studentQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getStudents,
    getStudentById,
    addStudent,
    updateStudent,
    setStudentStatus
} from '../../api/studentApi';

/**
 * Custom hook to fetch the list of students with filters.
 * React Query will automatically cache this data and refetch it when the `filters` object changes.
 * @param {object} filters - The filter object from the UI state (e.g., { admissionYear, program, ... }).
 * @returns The result of the useQuery hook, which includes `data`, `isLoading`, `isError`, and `error`.
 */
export const useGetStudents = (filters) => {
    return useQuery({
        // The query key is an array that uniquely identifies this specific query.
        // By including the `filters` object in the key, React Query knows to re-run this query
        // automatically whenever any filter value changes.
        queryKey: ['students', filters], 
        queryFn: () => getStudents(filters),
    });
};

/**
 * Custom hook to fetch a single student by their unique ID.
 * @param {string|null} id - The _id of the student to fetch.
 * @returns The query result for a single student.
 */
export const useGetStudentById = (id) => {
    return useQuery({
        queryKey: ['student', id],
        queryFn: () => getStudentById(id),
        // The `enabled` option is a crucial optimization. It tells React Query to only
        // run this query if the `id` is a "truthy" value (i.e., not null or undefined).
        // This prevents it from running unnecessarily on the "Add New Student" page.
        enabled: !!id, 
    });
};

/**
 * Custom hook for adding a new student.
 * This provides a `mutate` function to trigger the addition and tracks its loading state.
 * @returns A mutation object from React Query.
 */
export const useAddStudent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addStudent,
        // The `onSuccess` callback is the perfect place to handle side effects after a successful mutation.
        // Here, we invalidate the 'students' query. This tells React Query that the student list
        // is now out-of-date and must be refetched automatically, ensuring the new student appears in the table.
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
    });
};

/**
 * Custom hook for updating an existing student.
 * @returns A mutation object from React Query.
 */
export const useUpdateStudent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        // The mutation function expects an object containing both the `id` and the `data`.
        mutationFn: ({ id, data }) => updateStudent(id, data),
        onSuccess: (updatedStudent, variables) => {
            // After an update, we should refetch both the main list and the specific student's profile data.
            queryClient.invalidateQueries({ queryKey: ['students'] });
            queryClient.invalidateQueries({ queryKey: ['student', variables.id] });
        },
    });
};

/**
 * Custom hook for deactivating or reactivating a student's status.
 * @returns A mutation object from React Query.
 */
export const useSetStudentStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        // The mutation function expects an object like { id, status }.
        mutationFn: setStudentStatus, 
        onSuccess: (data, variables) => {
            // After changing the status, refetch both the student list and the specific student's profile.
            queryClient.invalidateQueries({ queryKey: ['students'] });
            queryClient.invalidateQueries({ queryKey: ['student', variables.id] });
        },
    });
};