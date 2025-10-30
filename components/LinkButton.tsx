import Link from 'next/link';
import { RippleButton } from './micro-interactions';

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

export default function LinkButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
}: LinkButtonProps) {
  return (
    <Link href={href} className={className}>
      <RippleButton variant={variant} size={size} className="w-full">
        {icon && <span>{icon}</span>}
        {children}
      </RippleButton>
    </Link>
  );
}

