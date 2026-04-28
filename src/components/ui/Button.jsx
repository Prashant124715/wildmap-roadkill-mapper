import { motion } from 'framer-motion';
import clsx from 'clsx';
import { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  className, 
  icon: Icon,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-sm font-bold tracking-widest transition-all duration-300 relative overflow-hidden group";
  
  const variants = {
    primary: "bg-brand-orange text-white hover:bg-orange-600 shadow-[0_0_20px_rgba(255,92,0,0.3)] hover:shadow-[0_0_30px_rgba(255,92,0,0.6)]",
    outline: "bg-transparent border border-white/20 text-white hover:border-white/50 hover:bg-white/5",
    ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-white/5"
  };

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.98 }}
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {Icon && <Icon size={16} />}
        {children}
      </span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
