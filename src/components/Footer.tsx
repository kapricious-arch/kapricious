import Link from "next/link";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_0.8fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8">
              <img src="/logo.png" alt="Kapricious Logo" className="w-full h-full object-contain dark:invert-0 invert" />
            </div>
            <span className="font-display font-bold tracking-tighter text-sm">KAPRICIOUS'26</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            KMEA Engineering College's premier national techfest. Where human creativity meets synthetic intelligence.
          </p>
        </div>
        <div>
          <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">Navigate</h4>
          <div className="grid gap-2">
            {[
              { l: "Events", p: "/events" },
              { l: "Register", p: "/register" },
              { l: "Certificates", p: "/certificate" },
            ].map((x) => (
              <Link key={x.p} href={x.p} className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                {x.l}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">Contact</h4>
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-background/40 p-4">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">Campus</p>
              <div className="space-y-1 text-sm text-foreground/60">
                <p>KMEA Engineering College</p>
                <p>Aluva, Ernakulam, Kerala</p>
                <p className="pt-1">kapricious@kmeacollege.ac.in</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-3">Student Coordinators</p>
                <div className="space-y-3 text-sm text-foreground/70">
                  <div>
                    <p className="font-medium text-foreground">Ihlas N Jabbar</p>
                    <p>7736268220</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Aslaha Farhath</p>
                    <p>9846508582</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-3">Staff Coordinators</p>
                <div className="space-y-3 text-sm text-foreground/70">
                  <div>
                    <p className="font-medium text-foreground">Prof. Veena K Viswam</p>
                    <p>9946446857</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Prof. Aju Philip</p>
                    <p>9961714323</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          © 2026 Kapricious — KMEA Engineering College
        </p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">All Systems Operational</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
