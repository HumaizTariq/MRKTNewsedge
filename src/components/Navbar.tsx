"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/gold", label: "Gold" },
  { href: "/nq", label: "NQ" },
  { href: "/btc", label: "BTC" },
  { href: "/news", label: "News" },
  { href: "/calendar", label: "Calendar" },
  { href: "/cot", label: "COT" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/dashboard" className="text-lg font-bold text-yellow-400 tracking-tight">
          MRKT NewsEdge
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  isActive ? "bg-yellow-400/10 text-yellow-400 font-medium" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                }`}>
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
