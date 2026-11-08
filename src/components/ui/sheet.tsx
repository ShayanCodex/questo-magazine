import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import type { VariantProps } from 'class-variance-authority';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';
import { sheetVariants } from '../../lib/ui-variants';

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetPortal = SheetPrimitive.Portal;

export const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-200 data-[state=open]:opacity-100 data-[state=closed]:opacity-0',
      className
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = 'inlineEnd', className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close
        className="absolute top-6 inline-end-6 ltr:right-6 rtl:left-6 rounded-sm opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
        aria-label="Close navigation menu"
      >
        <XMarkIcon className="h-6 w-6 text-editorial-text" />
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

export const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-start', className)} {...props} />
);
SheetHeader.displayName = 'SheetHeader';

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold text-editorial-text font-display', className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-sm text-editorial-muted', className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
