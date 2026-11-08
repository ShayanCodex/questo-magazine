import { Link } from 'react-router-dom';
import type { BreadcrumbItem as BreadcrumbItemType } from '../lib/types';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

export interface BreadcrumbsProps {
  items: BreadcrumbItemType[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <Breadcrumb className="mb-8">
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <span key={index} className="inline-flex items-center gap-1.5 sm:gap-2.5">
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

