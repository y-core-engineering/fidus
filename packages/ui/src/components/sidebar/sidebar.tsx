'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';
import { ChevronRight, ChevronDown } from 'lucide-react';

// Zod schema for props validation
export const sidebarItemSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    label: z.string(),
    href: z.string().optional(),
    icon: z.any().optional(),
    active: z.boolean().optional(),
    children: z.array(sidebarItemSchema).optional(),
  })
);

export const sidebarSectionSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  items: z.array(sidebarItemSchema),
  collapsible: z.boolean().optional(),
  defaultCollapsed: z.boolean().optional(),
});

export const sidebarPropsSchema = z.object({
  sections: z.array(sidebarSectionSchema).optional(),
  items: z.array(sidebarItemSchema).optional(),
  collapsed: z.boolean().optional().default(false),
  onCollapse: z.function().args(z.boolean()).returns(z.void()).optional(),
  position: z.enum(['left', 'right']).default('left'),
  width: z.enum(['sm', 'md', 'lg']).default('md'),
  className: z.string().optional(),
});

export type SidebarItem = z.infer<typeof sidebarItemSchema>;
export type SidebarSection = z.infer<typeof sidebarSectionSchema>;
export type SidebarProps = z.infer<typeof sidebarPropsSchema> & {
  children?: React.ReactNode;
};

const sidebarVariants = cva(
  'flex flex-col border-border bg-background transition-all duration-300',
  {
    variants: {
      position: {
        left: 'border-r',
        right: 'border-l',
      },
      width: {
        sm: 'w-60',
        md: 'w-70',
        lg: 'w-80',
      },
      collapsed: {
        true: 'w-16',
        false: '',
      },
    },
    defaultVariants: {
      position: 'left',
      width: 'md',
      collapsed: false,
    },
  }
);

const sidebarSectionVariants = cva('flex flex-col', {
  variants: {
    collapsible: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    collapsible: false,
  },
});

const sidebarSectionHeaderVariants = cva(
  'flex items-center justify-between px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider',
  {
    variants: {
      collapsible: {
        true: 'cursor-pointer hover:bg-muted transition-colors',
        false: '',
      },
    },
    defaultVariants: {
      collapsible: false,
    },
  }
);

const sidebarItemVariants = cva(
  'flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm mx-2',
  {
    variants: {
      active: {
        true: 'bg-muted text-foreground',
        false: 'text-muted-foreground hover:bg-muted hover:text-foreground',
      },
      nested: {
        true: 'pl-10',
        false: '',
      },
      hasChildren: {
        true: 'cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
      nested: false,
      hasChildren: false,
    },
  }
);

// Composable parts
export const SidebarRoot = React.forwardRef<HTMLElement, SidebarProps>(
  ({ collapsed = false, position = 'left', width = 'md', className, children, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(sidebarVariants({ position, width, collapsed, className }))}
      data-test-id="sidebar-root"
      role="navigation"
      aria-label="sidebar navigation"
      {...props}
    >
      {children}
    </aside>
  )
);
SidebarRoot.displayName = 'SidebarRoot';

export const SidebarSection = React.forwardRef<
  HTMLDivElement,
  {
    section: SidebarSection;
    collapsed?: boolean;
    renderItem: (item: SidebarItem, nested?: boolean) => React.ReactNode;
    className?: string;
  }
>(({ section, collapsed, renderItem, className }, ref) => {
  const [isCollapsed, setIsCollapsed] = React.useState(section.defaultCollapsed || false);

  const toggleCollapse = () => {
    if (section.collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(sidebarSectionVariants({ collapsible: section.collapsible }), className)}
      data-test-id={`sidebar-section-${section.id}`}
    >
      {section.title && !collapsed && (
        <div
          className={cn(sidebarSectionHeaderVariants({ collapsible: section.collapsible }))}
          onClick={toggleCollapse}
          data-test-id={`sidebar-section-header-${section.id}`}
        >
          <span>{section.title}</span>
          {section.collapsible && (
            <span data-test-id={`sidebar-section-toggle-${section.id}`}>
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          )}
        </div>
      )}
      {!isCollapsed && (
        <div className="flex flex-col gap-1 py-2">{section.items.map((item) => renderItem(item))}</div>
      )}
    </div>
  );
});
SidebarSection.displayName = 'SidebarSection';

export const SidebarItem = React.forwardRef<
  HTMLAnchorElement | HTMLDivElement,
  {
    item: SidebarItem;
    collapsed?: boolean;
    nested?: boolean;
    className?: string;
  }
>(({ item, collapsed, nested = false, className }, ref) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const toggleExpand = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const Content = (
    <>
      {item.icon && <span className="inline-flex shrink-0">{item.icon}</span>}
      {!collapsed && <span className="flex-1">{item.label}</span>}
      {!collapsed && hasChildren && (
        <span className="inline-flex shrink-0">
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </span>
      )}
    </>
  );

  const itemClass = cn(sidebarItemVariants({ active: item.active, nested, hasChildren, className }));

  return (
    <>
      {item.href && !hasChildren ? (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={item.href}
          className={itemClass}
          aria-current={item.active ? 'page' : undefined}
          data-test-id={`sidebar-item-${item.id}`}
          title={collapsed ? item.label : undefined}
        >
          {Content}
        </a>
      ) : (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={itemClass}
          onClick={hasChildren ? toggleExpand : undefined}
          data-test-id={`sidebar-item-${item.id}`}
          title={collapsed ? item.label : undefined}
        >
          {Content}
        </div>
      )}
      {!collapsed && hasChildren && isExpanded && (
        <div className="flex flex-col gap-1">
          {item.children?.map((child: SidebarItem) => (
            <SidebarItem key={child.id} item={child} collapsed={collapsed} nested />
          ))}
        </div>
      )}
    </>
  );
});
SidebarItem.displayName = 'SidebarItem';

// Convenience wrapper
export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      sections,
      items,
      collapsed = false,
      onCollapse,
      position = 'left',
      width = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const renderItem = (item: SidebarItem, nested = false) => (
      <SidebarItem key={item.id} item={item} collapsed={collapsed} nested={nested} />
    );

    return (
      <SidebarRoot
        ref={ref}
        collapsed={collapsed}
        position={position}
        width={width}
        className={className}
        {...props}
      >
        {sections
          ? sections.map((section) => (
              <SidebarSection
                key={section.id}
                section={section}
                collapsed={collapsed}
                renderItem={renderItem}
              />
            ))
          : items?.map((item) => renderItem(item))}
      </SidebarRoot>
    );
  }
);
Sidebar.displayName = 'Sidebar';
