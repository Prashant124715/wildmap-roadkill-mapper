import { motion } from 'framer-motion';
import clsx from 'clsx';

const Card = ({ children, className, hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5 } : {}}
      className={clsx(
        "glass-panel rounded-xl p-6 transition-all duration-300",
        hover && "hover:border-brand-orange/30 hover:shadow-[0_8px_30px_rgba(255,92,0,0.1)]",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
