"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation } from "@/lib/content";

const headerNavigation = navigation.filter(({ href }) => href !== "/kontak/");

export function Header() {
  const [open, setOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.slice(0, -1));

  useEffect(() => {
    setOpen(false);
    setHidden(false);
  }, [pathname]);

  useEffect(() => {
    let previousY = Math.max(0, window.scrollY);
    const compactScreen = window.matchMedia("(max-width: 1000px)");
    let direction = 0;
    let distance = 0;
    let frame: number | null = null;

    setHidden(false);
    setScrolled(previousY > 8);

    const update = () => {
      frame = null;
      // Clamp overscroll so mobile rubber-banding does not reverse the direction.
      const limit = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const currentY = Math.max(0, Math.min(window.scrollY, limit));
      const delta = currentY - previousY;
      previousY = currentY;
      setScrolled(currentY > 8);

      if (menuMounted || currentY <= 16) {
        setHidden(false);
        distance = 0;
        return;
      }
      if (Math.abs(delta) < 1) return;

      const nextDirection = Math.sign(delta);
      if (nextDirection !== direction) {
        direction = nextDirection;
        distance = 0;
      }
      distance += Math.abs(delta);
      // Hide after a deliberate downward gesture; reveal promptly on the way up.
      const threshold = direction > 0
        ? (compactScreen.matches ? 36 : 32)
        : (compactScreen.matches ? 16 : 14);
      if (distance < threshold) return;

      const focused = document.activeElement;
      const keyboardFocus = focused instanceof HTMLElement &&
        headerRef.current?.contains(focused) && focused.matches(":focus-visible");
      const headerHeight = headerRef.current?.offsetHeight ?? 90;
      setHidden(direction > 0 && currentY > headerHeight && !keyboardFocus);
      distance = 0;
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [pathname, menuMounted]);

  useEffect(() => {
    if (!menuMounted) return;
    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const background = [...document.querySelectorAll<HTMLElement>(
      "body > main, body > footer, body > .skip-link",
    )].map((element) => ({ element, inert: element.inert }));
    background.forEach(({ element }) => { element.inert = true; });
    buttonRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        buttonRef.current?.focus({ preventScroll: true });
      }
      if (event.key !== "Tab") return;
      const items = [...(headerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      ) ?? [])].filter((element) => element.getClientRects().length > 0);
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1001px)");
    const onResize = () => {
      if (desktop.matches) {
        setOpen(false);
        setMenuMounted(false);
        headerRef.current?.querySelector<HTMLElement>(".brand")?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = rootOverflow;
      background.forEach(({ element, inert }) => { element.inert = inert; });
    };
  }, [menuMounted]);

  const closeAfterNavigation = () => {
    setOpen(false);
    setHidden(false);
    buttonRef.current?.focus({ preventScroll: true });
  };

  return (
    <>
      <div className="nav-spacer" aria-hidden="true" />
      <header
        className={`nav${hidden && !menuMounted ? " nav-hidden" : ""}${scrolled ? " nav-scrolled" : ""}${menuMounted ? " nav-open" : ""}${menuMounted && !open ? " nav-closing" : ""}`}
        ref={headerRef}
        role={menuMounted ? "dialog" : undefined}
        aria-modal={menuMounted ? true : undefined}
        aria-label={menuMounted ? "Navigasi situs" : undefined}
        onFocusCapture={() => setHidden(false)}
      >
        <div className="container nav-in">
          <Link
            className="brand"
            href="/"
            prefetch={false}
            aria-label="Beranda LPK J.A.T Banjarnegara"
            onClick={closeAfterNavigation}
          >
            <span className="brand-mark" aria-hidden="true">
              JAT
            </span>
            <span>
              <span className="brand-title">LPK J.A.T BANJARNEGARA</span>

            </span>
          </Link>
          <nav className="nav-links" aria-label="Menu utama">
            {headerNavigation.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                prefetch={false}
                aria-current={isActive(href) ? "page" : undefined}
                onClick={closeAfterNavigation}
              >
                {label}
              </Link>
            ))}
          </nav>
          <button
            ref={buttonRef}
            type="button"
            className="mobile-menu-button"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-controls="mobile-panel"
            aria-expanded={open}
            aria-haspopup="dialog"
            onClick={() => {
              setHidden(false);
              if (open) setOpen(false);
              else {
                setMenuMounted(true);
                setOpen(true);
              }
            }}
          >
            {open ? <X size={22} strokeWidth={1.6} aria-hidden="true" /> : <Menu size={22} strokeWidth={1.6} aria-hidden="true" />}
          </button>
        </div>
        <AnimatePresence onExitComplete={() => { if (!open) setMenuMounted(false); }}>
          {open && (
            <motion.nav
              className="mobile-panel"
              id="mobile-panel"
              aria-label="Menu mobile"
              initial={reducedMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, transition: { duration: reducedMotion ? 0 : 0.18, ease: "easeOut" } }}
              transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {headerNavigation.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  prefetch={false}
                  onClick={closeAfterNavigation}
                  aria-current={isActive(href) ? "page" : undefined}
                >
                  <span>{label}</span>
                  <ArrowUpRight size={20} strokeWidth={1.5} aria-hidden="true" />
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
