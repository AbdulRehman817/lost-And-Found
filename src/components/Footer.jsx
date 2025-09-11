import { Link } from "react-router-dom";
import { ReuniteLogo } from "../components/icons";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import { Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background text-foreground border-t">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center gap-2">
              <ReuniteLogo className="h-8 w-8 text-primary" />
              <span className="font-headline text-2xl font-bold text-primary">
                Reunite
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting communities, one found item at a time.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="GitHub">
                  <Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-headline font-semibold">Quick Links</h4>
            <nav className="flex flex-col gap-1">
              <Link
                href="/feed"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Browse Items
              </Link>
              <Link
                href="/submit"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Post an Item
              </Link>
              <Link
                href="/profile"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                My Dashboard
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                About
              </Link>
            </nav>
          </div>
          <div className="space-y-2">
            <h4 className="font-headline font-semibold">Legal</h4>
            <nav className="flex flex-col gap-1">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Cookie Policy
              </Link>
            </nav>
          </div>
          <div className="space-y-2">
            <h4 className="font-headline font-semibold">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for updates and success stories.
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Enter your email" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Reunite. Crafted by a passionate
          developer.
        </div>
      </div>
    </footer>
  );
}
