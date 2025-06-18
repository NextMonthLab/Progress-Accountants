import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Progress Accountants</h3>
            <p className="text-sm text-muted-foreground">
              Expert accounting services in Banbury, Oxford and surrounding areas.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="text-muted-foreground hover:text-foreground">All Services</Link></li>
              <li><Link href="/services/tax-planning" className="text-muted-foreground hover:text-foreground">Tax Planning</Link></li>
              <li><Link href="/services/bookkeeping" className="text-muted-foreground hover:text-foreground">Bookkeeping</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Industries</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/industries/film" className="text-muted-foreground hover:text-foreground">Film</Link></li>
              <li><Link href="/industries/music" className="text-muted-foreground hover:text-foreground">Music</Link></li>
              <li><Link href="/industries/construction" className="text-muted-foreground hover:text-foreground">Construction</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link href="/team" className="text-muted-foreground hover:text-foreground">Team</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Progress Accountants. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
            <Link href="/cookie-policy" className="text-sm text-muted-foreground hover:text-foreground">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}