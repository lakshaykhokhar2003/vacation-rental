import Link from "next/link"
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {footerCompanyItems, footerExploreItems, footerSocialItems, footerSupportItems} from "@/lib/footerUtils";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Image src={"/logo.svg"} alt="Logo" width={40} height={40} className="h-8 w-8" />
              <span className="text-xl font-bold text-primary">StayHere</span>
            </Link>
            <p className="mb-4 text-muted-foreground">
              Find and book the perfect vacation rental for your next getaway.
            </p>
            <div className="flex gap-4">
              {footerSocialItems.map((item) => (
                <Button key={item.label} variant="ghost" size="icon" aria-label={item.label}>
                  {item.icon}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Explore</h3>
            <ul className="space-y-2">
              {footerExploreItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-muted-foreground hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              {footerCompanyItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-muted-foreground hover:text-primary">
                    {item.label}
                    </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Subscribe</h3>
            <p className="mb-4 text-muted-foreground">
              Sign up for our newsletter to receive special offers and travel inspiration.
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Your email" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} StayHere. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm">
              {footerSupportItems.map((item) => (
                  <Link href={item.href} key={item.label} className="text-muted-foreground hover:text-primary">
                    {item.label}
                    </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}