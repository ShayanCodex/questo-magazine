import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-full cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-editorial-text text-editorial-bg hover:opacity-90',
        outline:
          'border border-editorial-border bg-transparent text-editorial-text hover:border-editorial-text hover:text-editorial-text',
        ghost:
          'text-editorial-text hover:bg-editorial-surface-hover hover:text-editorial-text',
        link:
          'text-editorial-text underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-11 min-h-[44px] px-4 py-2',
        sm: 'h-9 min-h-[36px] px-3 text-xs',
        lg: 'h-12 min-h-[48px] px-6 text-base',
        icon: 'h-11 w-11 min-h-[44px] min-w-[44px] p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const badgeVariants = cva(
  'inline-flex items-center px-2.5 py-0.5 text-xs font-sans font-medium tracking-normal transition-colors rounded-full',
  {
    variants: {
      variant: {
        default:
          'border border-editorial-border bg-editorial-surface text-editorial-muted hover:border-editorial-text hover:text-editorial-text',
        active:
          'border border-editorial-text text-editorial-text font-medium bg-editorial-surface-subtle',
        muted:
          'bg-editorial-surface-subtle text-editorial-muted border-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export const sheetVariants = cva(
  'fixed z-50 gap-4 bg-editorial-surface p-6 sm:p-8 transition-transform duration-200 ease-out flex flex-col justify-between border-editorial-border shadow-2xl',
  {
    variants: {
      side: {
        inlineEnd:
          'top-0 bottom-0 w-full max-w-md h-full ltr:right-0 ltr:border-l rtl:left-0 rtl:border-r ltr:data-[state=closed]:translate-x-full ltr:data-[state=open]:translate-x-0 rtl:data-[state=closed]:-translate-x-full rtl:data-[state=open]:translate-x-0',
        right:
          'inset-y-0 right-0 h-full w-full max-w-md border-l data-[state=closed]:translate-x-full data-[state=open]:translate-x-0',
        left:
          'inset-y-0 left-0 h-full w-full max-w-md border-r data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0',
      },
    },
    defaultVariants: {
      side: 'inlineEnd',
    },
  }
);

