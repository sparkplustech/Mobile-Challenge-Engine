/** Stub — configure Redux store per challenge 01 README */
export const store = { getState: () => ({}), dispatch: () => {}, subscribe: () => () => {} };
export type RootState = Record<string, unknown>;
export type AppDispatch = (action: unknown) => void;
export { useSelector, useDispatch } from 'react-redux';
