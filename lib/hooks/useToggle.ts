import React, { useState } from 'react';

export const useToggle = () => {
  const [isOpen, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  return [isOpen, toggle] as const;
};
