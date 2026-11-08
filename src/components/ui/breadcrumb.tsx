import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { cn } from '../../lib/utils';

export const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'nav'> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="Breadcrumb" {...props} />);
Breadcrumb.displayName = 'Breadcrumb';

export const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<'ol'>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      'flex flex-wrap items-center gap-1.5 break-words text-sm text-editorial-muted sm:gap-2.5',
      className
    )}
    {...props}
  />
));
BreadcrumbList.displayName = 'BreadcrumbList';

export const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn('inline-flex items-center gap-1.5', className)}
    {...props}
  />
));
BreadcrumbItem.displayName = 'BreadcrumbItem';

export const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a';
  return (
    <Comp
      ref={ref}
      className={cn('transition-colors hover:text-accent font-medium', className)}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = 'BreadcrumbLink';

export const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn('font-normal text-editorial-text truncate max-w-[280px] sm:max-w-md', className)}
    {...props}
  />
));
BreadcrumbPage.displayName = 'BreadcrumbPage';

export const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('[&>svg]:size-3.5 text-editorial-muted/60 rtl:rotate-180', className)}
    {...props}
  >
    {children ?? <ChevronRightIcon />}
  </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

