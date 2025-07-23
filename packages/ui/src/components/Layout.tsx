import React from 'react';
import { clsx } from 'clsx';

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className={clsx('min-h-screen bg-gray-50', className)}>
      {children}
    </div>
  );
}

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
}

const containerSizes = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

export function Container({
  size = 'lg',
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={clsx(
        'mx-auto px-4 sm:px-6 lg:px-8',
        containerSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  sticky?: boolean;
}

export function Header({
  sticky = false,
  className,
  children,
  ...props
}: HeaderProps) {
  return (
    <header
      className={clsx(
        'bg-white shadow-sm border-b border-gray-200',
        sticky && 'sticky top-0 z-40',
        className
      )}
      {...props}
    >
      {children}
    </header>
  );
}

export interface MainProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Main({ className, children, ...props }: MainProps) {
  return (
    <main className={clsx('flex-1', className)} {...props}>
      {children}
    </main>
  );
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Footer({ className, children, ...props }: FooterProps) {
  return (
    <footer
      className={clsx(
        'bg-gray-900 text-white',
        className
      )}
      {...props}
    >
      {children}
    </footer>
  );
} 