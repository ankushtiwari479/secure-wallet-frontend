import React from 'react';
import { useSnackbar } from 'notistack';

const SnackbarUtil = () => {
  const { enqueueSnackbar } = useSnackbar();

  return { enqueueSnackbar };
};

export default SnackbarUtil;
