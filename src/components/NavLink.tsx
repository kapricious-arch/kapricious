"use client";

import { forwardRef, type ReactNode } from "react";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends LinkProps {
  href: string;
  className?: string;
  activeClassName?: string;
  children: ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, href, ...props }, ref) => {
    const pathname = usePathname();

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, pathname === href && activeClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
