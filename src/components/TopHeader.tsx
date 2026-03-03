import { Link } from "react-router-dom";
import { Search, Play } from "lucide-react";

const TopHeader = () => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 px-4 md:px-8 pt-4">
      {/* Logo/Brand */}
      <div className="bg-card/90 neo-bento px-8 py-3 rounded-full border border-border flex items-center gap-4">
        <span className="font-display font-bold tracking-tighter text-lg text-foreground">KAPRICIOUS'26</span>
        <span className="h-4 w-[1px] bg-border"></span>
        <span className="text-xs uppercase tracking-widest text-muted-foreground">National Techfest</span>
      </div>

      {/* Right Side - Search & CTA */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="bg-card/90 neo-bento px-4 py-3 rounded-full border border-border flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search events..."
            className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-32 md:w-48 placeholder:text-muted-foreground/50 text-foreground"
          />
        </div>

        {/* CTA Button */}
        <Link
          to="/register"
          className="bg-foreground text-background px-6 md:px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
        >
          <span className="text-sm hidden sm:inline">START JOURNEY</span>
          <span className="text-sm sm:hidden">START</span>
          <Play className="w-4 h-4 fill-current" />
        </Link>
      </div>
    </header>
  );
};

export default TopHeader;
