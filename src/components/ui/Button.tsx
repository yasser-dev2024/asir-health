import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-[#15508A] text-white shadow-lg shadow-[#15508A]/15 hover:bg-[#283A83]',
  secondary: 'bg-white text-[#283A83] ring-1 ring-[#CCEAF7] hover:bg-[#F4FAFC]',
  ghost: 'bg-transparent text-[#15508A] hover:bg-[#F4FAFC]',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
};

export function Button({ className, children, variant = 'primary', icon, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#2FA9E0] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className
      )}
      type={type}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
