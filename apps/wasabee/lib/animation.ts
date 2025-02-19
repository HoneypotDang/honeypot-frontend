const defaultContainerVariants = {
  hidden: {
    opacity: 0,
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
};

const itemSlideVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

const itemPopUpVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export { defaultContainerVariants, itemSlideVariants, itemPopUpVariants };
