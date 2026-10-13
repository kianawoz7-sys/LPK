"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageData {
  id: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface GalleryContextType {
  selectedImage: ImageData | null;
  setSelectedImage: (image: ImageData | null) => void;
  galleryId: string;
  restoreFocus: () => void;
}

const GalleryContext = React.createContext<GalleryContextType | null>(null);

const spring = {
  type: "spring",
  stiffness: 350,
  damping: 35,
  mass: 1,
} as const;

export function Gallery({ children }: { children: React.ReactNode }) {
  const [selectedImage, updateSelectedImage] = React.useState<ImageData | null>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const galleryId = React.useId();

  const setSelectedImage = React.useCallback((image: ImageData | null) => {
    if (image && document.activeElement instanceof HTMLElement) {
      triggerRef.current = document.activeElement;
    }
    updateSelectedImage(image);
  }, []);

  const restoreFocus = React.useCallback(() => {
    if (triggerRef.current?.isConnected) {
      triggerRef.current.focus({ preventScroll: true });
    }
  }, []);

  React.useEffect(() => {
    if (!selectedImage) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // The modal is portaled outside these elements. Preserve existing inert states.
    const background = Array.from(
      document.querySelectorAll<HTMLElement>(
        "body > main, body > header, body > footer, body > .skip-link",
      ),
    ).map((element) => ({ element, inert: element.inert }));
    background.forEach(({ element }) => { element.inert = true; });

    return () => {
      document.body.style.overflow = previousOverflow;
      background.forEach(({ element, inert }) => { element.inert = inert; });
    };
  }, [selectedImage]);

  return (
    <GalleryContext.Provider value={{ selectedImage, setSelectedImage, galleryId, restoreFocus }}>
      {children}
      <GalleryModal />
    </GalleryContext.Provider>
  );
}

export function GalleryGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4", className)}>
      {children}
    </div>
  );
}

export function GalleryImage({
  src,
  alt,
  id,
  width,
  height,
  className,
}: ImageData & { className?: string }) {
  const context = React.useContext(GalleryContext);
  const reducedMotion = useReducedMotion();
  if (!context) throw new Error("GalleryImage must be used within a Gallery");

  return (
    <motion.button
      type="button"
      whileHover="hover"
      whileTap="tap"
      className={cn(
        "relative mb-4 block w-full break-inside-avoid cursor-zoom-in overflow-hidden rounded-xl border-0 bg-transparent p-0",
        className,
      )}
      aria-haspopup="dialog"
      aria-label={`Perbesar foto: ${alt || "Kegiatan LPK J.A.T"}`}
      onClick={(event) => {
        event.currentTarget.focus({ preventScroll: true });
        context.setSelectedImage({ id, src, alt, width, height });
      }}
    >
      <motion.img
        layoutId={reducedMotion ? undefined : `${context.galleryId}-image-${id}`}
        src={src}
        alt={alt || "Kegiatan LPK J.A.T"}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="block h-auto w-full rounded-xl object-cover"
        variants={{
          hover: { scale: reducedMotion ? 1 : 0.98 },
          tap: { scale: reducedMotion ? 1 : 0.95 },
        }}
        transition={reducedMotion ? { duration: 0 } : spring}
      />
      <motion.div
        variants={{ hover: { opacity: 1 }, tap: { opacity: 1 } }}
        initial={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 rounded-xl bg-black/10"
        transition={{ duration: reducedMotion ? 0 : 0.2 }}
        aria-hidden="true"
      />
    </motion.button>
  );
}

function GalleryModal() {
  const context = React.useContext(GalleryContext);
  const [mounted, setMounted] = React.useState(false);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => { setMounted(true); }, []);

  const selectedImage = context?.selectedImage;
  const setSelectedImage = context?.setSelectedImage;

  React.useEffect(() => {
    if (!selectedImage || !setSelectedImage) return;
    closeRef.current?.focus({ preventScroll: true });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelectedImage(null);
      }
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, setSelectedImage]);

  if (!mounted || !context) return null;

  return createPortal(
    <AnimatePresence onExitComplete={context.restoreFocus}>
      {selectedImage && (
        <motion.div
          key="gallery-modal"
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.alt || "Foto kegiatan LPK J.A.T"}
          className="fixed inset-0 z-[200] flex items-center justify-center overscroll-contain"
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
            onClick={() => context.setSelectedImage(null)}
            aria-hidden="true"
          />
          <motion.div
            className="relative z-10 flex h-full w-full cursor-zoom-out items-center justify-center"
            style={{ touchAction: "none" }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.8}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.y) > 100 || Math.abs(info.velocity.y) > 300) {
                context.setSelectedImage(null);
              }
            }}
            onClick={() => context.setSelectedImage(null)}
          >
            <motion.img
              layoutId={reducedMotion ? undefined : `${context.galleryId}-image-${selectedImage.id}`}
              src={selectedImage.src}
              alt={selectedImage.alt || "Foto kegiatan LPK J.A.T"}
              width={selectedImage.width}
              height={selectedImage.height}
              className="h-auto max-h-[90dvh] w-auto max-w-[95vw] rounded-xl object-contain shadow-2xl will-change-transform"
              draggable={false}
              transition={reducedMotion ? { duration: 0 } : spring}
            />
          </motion.div>
          <motion.button
            ref={closeRef}
            type="button"
            initial={{ opacity: 0, y: reducedMotion ? 0 : -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -20 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-white sm:right-6 sm:top-6"
            onClick={() => context.setSelectedImage(null)}
            aria-label="Tutup foto"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
