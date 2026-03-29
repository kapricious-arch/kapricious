"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, X, ArrowRight, Award, CalendarCheck2 } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import ScrollRobot from "@/components/ScrollRobot";
import { allDepartmentEvents, sortDepartmentEventsByPrizePool } from "@/data/events/index";
const FEATURED_EVENTS_AUTOPLAY_MS = 4000;

const HeroSection = () => {

  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const topEvents = useMemo(
    () =>
      sortDepartmentEventsByPrizePool(allDepartmentEvents)
        .slice(0, 3)
        .map((event) => ({
          id: event.id,
          title: event.title,
          prize: event.prizePool,
          description: event.details,
          date: event.date,
          link: `/events/${event.id}`,
          department: event.departmentName,
          image: event.image,
        })),
    []
  );

  // Embla carousels
  const [mobileRef, mobileApi] = useEmblaCarousel({ loop: true, align: "start", dragFree: false });
  const [desktopRef, desktopApi] = useEmblaCarousel({ loop: true, align: "start", dragFree: false });
  const [mobileSelected, setMobileSelected] = useState(0);
  const [desktopSelected, setDesktopSelected] = useState(0);

  const onMobileSelect = useCallback(() => {
    if (mobileApi) setMobileSelected(mobileApi.selectedScrollSnap());
  }, [mobileApi]);
  const onDesktopSelect = useCallback(() => {
    if (desktopApi) setDesktopSelected(desktopApi.selectedScrollSnap());
  }, [desktopApi]);

  useEffect(() => {
    if (mobileApi) { mobileApi.on("select", onMobileSelect); onMobileSelect(); }
    if (desktopApi) { desktopApi.on("select", onDesktopSelect); onDesktopSelect(); }
  }, [mobileApi, desktopApi, onMobileSelect, onDesktopSelect]);

  useEffect(() => {
    if (!mobileApi && !desktopApi) return;

    let mobileTimer: number | undefined;
    let desktopTimer: number | undefined;

    const clearMobileTimer = () => {
      if (!mobileTimer) return;
      window.clearTimeout(mobileTimer);
      mobileTimer = undefined;
    };

    const clearDesktopTimer = () => {
      if (!desktopTimer) return;
      window.clearTimeout(desktopTimer);
      desktopTimer = undefined;
    };

    const scheduleMobileAutoplay = () => {
      clearMobileTimer();
      if (!mobileApi || document.hidden) return;
      mobileTimer = window.setTimeout(() => {
        mobileApi.scrollNext();
      }, FEATURED_EVENTS_AUTOPLAY_MS);
    };

    const scheduleDesktopAutoplay = () => {
      clearDesktopTimer();
      if (!desktopApi || document.hidden) return;
      desktopTimer = window.setTimeout(() => {
        desktopApi.scrollNext();
      }, FEATURED_EVENTS_AUTOPLAY_MS);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearMobileTimer();
        clearDesktopTimer();
        return;
      }

      scheduleMobileAutoplay();
      scheduleDesktopAutoplay();
    };

    mobileApi?.on("select", scheduleMobileAutoplay);
    mobileApi?.on("pointerDown", clearMobileTimer);
    mobileApi?.on("settle", scheduleMobileAutoplay);

    desktopApi?.on("select", scheduleDesktopAutoplay);
    desktopApi?.on("pointerDown", clearDesktopTimer);
    desktopApi?.on("settle", scheduleDesktopAutoplay);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    scheduleMobileAutoplay();
    scheduleDesktopAutoplay();

    return () => {
      clearMobileTimer();
      clearDesktopTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      mobileApi?.off("select", scheduleMobileAutoplay);
      mobileApi?.off("pointerDown", clearMobileTimer);
      mobileApi?.off("settle", scheduleMobileAutoplay);
      desktopApi?.off("select", scheduleDesktopAutoplay);
      desktopApi?.off("pointerDown", clearDesktopTimer);
      desktopApi?.off("settle", scheduleDesktopAutoplay);
    };
  }, [mobileApi, desktopApi]);

  const filteredEvents = searchQuery.trim()
    ? allDepartmentEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    <div className="hero-scroll-track relative w-full h-[220vh] md:h-[300vh]">
      <div ref={heroRef} className="sticky top-0 w-full h-screen">
        <div className="absolute inset-0 bg-[#01040f] md:bg-background">
          <div className="app-frame-wrapper">
            {/* TOP-LEFT CUTOUT - Brand */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="cutout-tl hidden md:block"
            >
              <div className="brand-pill-inner">
                <span className="text-base md:text-lg font-bold tracking-wide text-white font-display">
                  KAPRICIOUS'26
                </span>
              </div>
              <div className="cutout-corner cutout-tl-right" />
              <div className="cutout-corner cutout-tl-bottom" />
            </motion.div>

            {/* TOP-RIGHT CUTOUT - Search (desktop only) */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="cutout-tr hidden md:block"
            >
              <div ref={searchRef} className="relative">
                <div className="bg-card/90 neo-bento px-4 py-3 rounded-full border border-border flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-48 placeholder:text-muted-foreground/50 text-foreground"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => { setSearchQuery(""); setIsSearchOpen(false); }}
                      className="text-muted-foreground hover:text-foreground p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {isSearchOpen && filteredEvents.length > 0 && (
                  <div className="absolute top-full mt-2 right-0 bg-card border border-border rounded-2xl shadow-lg overflow-hidden z-50 min-w-[280px]">
                    <div className="max-h-60 overflow-y-auto overscroll-contain">
                      {filteredEvents.slice(0, 6).map((event) => (
                        <button
                          key={event.id}
                          onClick={() => {
                            router.push(`/events/${event.id}`);
                            setSearchQuery("");
                            setIsSearchOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-secondary active:bg-secondary/80 transition-colors flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">{event.department}</p>
                          </div>
                          <span className="text-[9px] px-2 py-1 rounded-full bg-secondary text-muted-foreground uppercase tracking-wider shrink-0">
                            {event.prizePool}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isSearchOpen && searchQuery.trim() && filteredEvents.length === 0 && (
                  <div className="absolute top-full mt-2 right-0 bg-card border border-border rounded-2xl shadow-lg overflow-hidden z-50 min-w-[260px]">
                    <div className="px-4 py-3 text-sm text-muted-foreground text-center">No events found</div>
                  </div>
                )}
              </div>
              <div className="cutout-corner cutout-tr-left" />
              <div className="cutout-corner cutout-tr-bottom" />
            </motion.div>

            {/* BOTTOM-RIGHT CUTOUT - Featured Events (desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="cutout-br hidden md:block"
            >
              <div className="w-[280px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Featured Events</h3>
                  <div className="flex gap-1.5">
                    {topEvents.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => desktopApi?.scrollTo(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${i === desktopSelected ? 'bg-foreground' : 'bg-muted-foreground/30'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="overflow-hidden" ref={desktopRef}>
                  <div className="flex">
                    {topEvents.map((event) => (
                      <Link
                        key={event.id}
                        href={event.link}
                        className="featured-event-card relative min-w-0 flex-[0_0_100%] block group overflow-hidden rounded-[28px] border border-border/80 bg-card p-4 shadow-[0_18px_40px_rgba(2,5,19,0.08)]"
                        aria-label={`Open featured event ${event.title}`}
                        style={{
                          backgroundImage: `linear-gradient(180deg, rgba(2, 6, 23, 0.18) 0%, rgba(2, 6, 23, 0.82) 58%, rgba(2, 6, 23, 0.94) 100%), url(${event.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="inline-flex items-center rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur-sm">
                              Archive
                            </span>
                          </div>
                          <div className="featured-event-card__icon shrink-0 rounded-full border border-white/20 bg-black/30 p-2 text-white backdrop-blur-sm">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-base font-bold text-white font-display tracking-tight transition-colors group-hover:text-white/90">
                            {event.title}
                          </h4>
                          <p className="text-sm text-white/75 leading-relaxed mt-1.5 line-clamp-2">
                            {event.description}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs px-2 py-1 rounded-full bg-black/30 text-white/85 whitespace-nowrap backdrop-blur-sm">{event.prize}</span>
                            <span className="text-xs text-white/70 truncate">{event.department}</span>
                          </div>
                          <span className="text-[11px] font-medium text-white/70 whitespace-nowrap">{event.date}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="cutout-corner cutout-br-left" />
              <div className="cutout-corner cutout-br-top" />
            </motion.div>

            {/* DARK INNER CANVAS */}
            <div ref={canvasRef} className="main-inner-canvas">
              <div className="absolute inset-0 pointer-events-none z-0">
                <ScrollRobot className="w-full h-full" />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute bottom-10 left-4 right-4 z-10 text-center md:hidden"
              >
                <h1 className="text-3xl font-bold font-display leading-[1.1] hero-gradient-text">
                  KAPRICIOUS'26
                </h1>
                <p className="mx-auto mt-2 max-w-xs text-[11px] uppercase tracking-[0.22em] text-white/55">
                  Official Event Archive
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute bottom-6 left-0 right-0 hidden md:block md:bottom-10 md:left-10 md:right-auto z-10 text-left"
              >
                <div className="mb-4 inline-flex max-w-2xl items-start gap-3 rounded-[26px] border border-white/10 bg-white/8 px-4 py-3 text-left backdrop-blur-md">
                  <CalendarCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent">Festival Concluded</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/80">
                      Kapricious 2026 concluded on March 28, 2026. Thank you for being part of it.
                    </p>
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.1] hero-gradient-text">
                  KAPRICIOUS'26
                </h1>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/70 md:mx-0 md:text-base">
                  The flagship tech fest of KMEA Engineering College has wrapped up after two vibrant days of flagship
                  challenges, department competitions, sports events, and cultural showcases. The site now serves as the
                  official archive for events and certificates.
                </p>
                <div className="mt-5 flex flex-col items-center gap-3 md:flex-row md:items-start">
                  <Link
                    href="/certificate"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-xs font-bold tracking-[0.18em] text-background transition-all hover:opacity-90 active:scale-95 md:px-6"
                  >
                    <Award className="h-4 w-4" />
                    Download Certificates
                  </Link>
                  <Link
                    href="/events"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-xs font-bold tracking-[0.18em] text-white transition-all hover:bg-white/10 active:scale-95 md:px-6"
                  >
                    View Event Archive
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>

      <div className="md:hidden relative z-10 -mt-16 px-4 pb-4">
        <div className="rounded-[28px] border border-border bg-card/95 p-5 shadow-[0_20px_50px_rgba(2,5,19,0.12)] backdrop-blur">
          <div className="inline-flex items-start gap-3 rounded-[22px] border border-accent/20 bg-accent/5 px-4 py-3 text-left">
            <CalendarCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent">Festival Concluded</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Kapricious 2026 concluded on March 28, 2026. Thank you for being part of it.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The site now serves as the official archive for events and certificates.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/certificate"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-xs font-bold tracking-[0.18em] text-background transition-all hover:opacity-90 active:scale-95"
            >
              <Award className="h-4 w-4" />
              Download Certificates
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-xs font-bold tracking-[0.18em] text-foreground transition-all hover:opacity-90 active:scale-95"
            >
              View Event Archive
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Featured Events - swipeable single card */}
      <div className="md:hidden relative z-10 pb-6 px-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Featured Events</h3>
          <div className="flex gap-1.5">
            {topEvents.map((_, i) => (
              <button
                key={i}
                onClick={() => mobileApi?.scrollTo(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === mobileSelected ? 'bg-foreground' : 'bg-muted-foreground/30'}`}
              />
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl" ref={mobileRef}>
          <div className="flex">
            {topEvents.map((event) => (
              <Link
                key={event.id}
                href={event.link}
                className="featured-event-card relative min-w-0 flex-[0_0_100%] block overflow-hidden rounded-[24px] border border-border bg-card p-4 shadow-[0_18px_36px_rgba(2,5,19,0.08)] active:scale-[0.985] transition-all duration-300"
                aria-label={`Open featured event ${event.title}`}
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(2, 6, 23, 0.18) 0%, rgba(2, 6, 23, 0.82) 58%, rgba(2, 6, 23, 0.94) 100%), url(${event.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur-sm">
                    Archive Pick
                  </span>
                  <div className="featured-event-card__icon shrink-0 rounded-full border border-white/20 bg-black/30 p-2 text-white backdrop-blur-sm">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-bold text-white font-display tracking-tight">{event.title}</h4>
                  <p className="text-xs text-white/75 mt-1.5 line-clamp-2 leading-relaxed">{event.description}</p>
                </div>
                <div className="flex items-center justify-between gap-2 mt-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/30 text-white/85 whitespace-nowrap backdrop-blur-sm">{event.prize}</span>
                    <span className="text-[10px] text-white/70 truncate">{event.department}</span>
                  </div>
                  <span className="text-[10px] font-medium text-white/70 whitespace-nowrap">{event.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;



