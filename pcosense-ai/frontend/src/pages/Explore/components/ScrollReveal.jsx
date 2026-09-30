// src/pages/Explore/components/ScrollReveal.jsx
import { motion } from 'framer-motion';

// Fades + slides an element up into place the first time it scrolls into
// view. `amount` controls how much of the element must be visible before it
// triggers, and `once` keeps it from re-animating on scroll-back.
const ScrollReveal = ({ children, delay = 0, y = 36, ...boxProps }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25, margin: '0px 0px -80px 0px' }}
    transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    {...boxProps}
  >
    {children}
  </motion.div>
);

export default ScrollReveal;
