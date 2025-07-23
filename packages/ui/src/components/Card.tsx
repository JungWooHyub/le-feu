import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const cardVariants = {
  default: 'bg-white shadow-sm border border-gray-200',
  elevated: 'bg-white shadow-lg border border-gray-100',
  outlined: 'bg-white border-2 border-gray-200',
};

const cardPadding = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  variant = 'default',
  padding = 'md',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        // 기본 스타일
        'rounded-lg',
        // 변형별 스타일
        cardVariants[variant],
        // 패딩
        cardPadding[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div
      className={clsx('mb-4 border-b border-gray-200 pb-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function CardTitle({
  as: Component = 'h3',
  className,
  children,
  ...props
}: CardTitleProps) {
  return (
    <Component
      className={clsx('text-lg font-semibold text-gray-900', className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={clsx('text-gray-600', className)} {...props}>
      {children}
    </div>
  );
} 