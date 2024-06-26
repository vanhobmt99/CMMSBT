import { useEffect } from 'react';

const useFetchAndSet = (id, fetchFunction, setDataFunction, resetFunctions = []) => {
  useEffect(() => {
    if (id) {
      fetchFunction(id);
      resetFunctions.forEach(([resetDataFunction, resetValue]) => {
        resetDataFunction(resetValue);
      });
    }
  }, [id, fetchFunction, ...resetFunctions.map(([resetDataFunction]) => resetDataFunction)]);
};

export default useFetchAndSet;