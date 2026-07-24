export const buttonVariants = {
  hover: {
    scale: 1.02,
    boxShadow: "0px 8px 16px rgba(0, 104, 122, 0.15)",
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.97,
    transition: {
      duration: 0.1,
    },
  },
};

export const iconButtonVariants = {
  hover: {
    scale: 1.1,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.9,
    transition: { duration: 0.1 }
  }
};
