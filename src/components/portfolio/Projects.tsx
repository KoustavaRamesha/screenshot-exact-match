import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "./data";

/**
 * Project showcase, Apple product-page style: generous whitespace, neutral type,
 * one large "app window" per project revealed on scroll, specs set like a keynote
 * slide. Color lives only in a soft per-project glow behind the artwork.
 * Clicking a card opens the live project in a new tab.
 */
export function Projects() {
  return (
    <section id="work" className="relative px-6 py-40">
      <div className="mx-auto max-w-6xl">
        <header className="mb-40 text-center">
          <p className="eyebrow mb-5">Selected work</p>
          <h2 className="title">
            Three products.
            <br />
            All shipped.
          </h2>
        </header>

        <div className="space-y-48">
          {projects.map((p, i) => (
            <Showcase key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        const e = es[0];
        if (e && e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, on };
}

function Showcase({ project, index }: { project: Project; index: number }) {
  const { ref, on } = useReveal<HTMLElement>();
  const art = useRef<HTMLAnchorElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, on: false });
  const flip = index % 2 === 1;

  const rise = (delay: number) => ({
    opacity: on ? 1 : 0,
    transform: on ? "none" : "translateY(48px)",
    transition: `opacity 900ms var(--ease-spring) ${delay}ms, transform 900ms var(--ease-spring) ${delay}ms`,
  });

  return (
    <article ref={ref} className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
      {/* Artwork - clicking opens live project */}
      <div className={`relative ${flip ? "md:order-2" : ""}`} style={rise(0)}>
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[60%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[90px]"
          style={{ background: project.hue }}
        />
        <a
          ref={art}
          href={project.live || "#"}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="Open ↗"
          aria-label={`Open ${project.name} live site`}
          onPointerMove={(e) => {
            const r = art.current!.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            setT({ rx: (0.5 - y) * 7, ry: (x - 0.5) * 7, gx: x * 100, gy: y * 100, on: true });
          }}
          onPointerLeave={() => setT({ rx: 0, ry: 0, gx: 50, gy: 50, on: false })}
          className="group relative block aspect-[16/10] w-full overflow-hidden rounded-[28px] border border-hairline bg-card text-left transition-all duration-700 ease-spring hover:border-foreground/30 hover:scale-[1.01]"
          style={{
            transform: `perspective(1200px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) translateY(${t.on ? -8 : 0}px)`,
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <div className="absolute inset-5 flex flex-col overflow-hidden rounded-[18px] border border-hairline bg-background/80 backdrop-blur">
            <div className="flex items-center gap-2 border-b border-hairline px-4 py-2.5">
              <span className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-foreground/25" />
                ))}
              </span>
              <span className="mx-auto flex items-center gap-1 rounded-full bg-secondary/70 px-3 py-0.5 text-[10px] text-muted-foreground transition-colors group-hover:text-foreground">
                {project.name}
                <span className="text-[9px] opacity-70">↗</span>
              </span>
              <span className="w-10" />
            </div>
            <Art project={project} />
          </div>
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{ opacity: t.on ? 1 : 0, background: `radial-gradient(600px circle at ${t.gx}% ${t.gy}%, oklch(1 0 0 / 12%), transparent 45%)` }}
          />
        </a>
      </div>

      {/* Copy */}
      <div className={flip ? "md:order-1" : ""}>
        <p className="eyebrow mb-4" style={rise(80)}>
          0{index + 1}
        </p>
        <h3 className="text-4xl font-semibold tracking-tight md:text-5xl" style={rise(140)}>
          {project.name}
        </h3>
        <p className="mt-4 text-xl leading-snug text-muted-foreground" style={rise(200)}>
          {project.tagline}
        </p>
        <div className="mt-10 border-y border-hairline py-6" style={rise(260)}>
          <dl className="grid grid-cols-3 gap-6">
            {project.stats.map((s) => (
              <div key={s.k}>
                <dt className="text-2xl font-semibold tracking-tight">{s.v}</dt>
                <dd className="mt-1.5 text-xs leading-snug text-muted-foreground">{s.k}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-6 flex flex-wrap gap-2" style={rise(320)}>
          {project.tech.map((tech) => (
            <span key={tech} className="rounded-full border border-hairline px-3 py-1 text-xs text-muted-foreground">
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3" style={rise(380)}>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-all duration-300 hover:text-primary"
            >
              <span>{project.id === "safety" ? "View source & demo" : "Visit live site"}</span>
              <span className="text-xs transition-transform duration-500 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/** Real screenshot when available, else minimal CSS-art inside each project's window. */
function Art({ project }: { project: Project }) {
  if (project.shot) {
    return <img src={project.shot} alt={`${project.name} — live site`} className="h-full w-full object-cover object-top" loading="lazy" draggable={false} />;
  }
  const id = project.id;
  if (id === "safety") {
    return (
      <div className="grid flex-1 grid-cols-2 gap-2 p-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="relative overflow-hidden rounded-lg bg-secondary/70">
            <div className="absolute left-2 top-2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
              <span className="text-[8px] font-semibold tracking-wider text-muted-foreground">CAM {i + 1}</span>
            </div>
            <div
              className="absolute inset-x-3 h-[2px] bg-foreground/25"
              style={{ top: `${30 + i * 10}%`, animation: `floaty ${5 + i}s ease-in-out infinite` }}
            />
          </div>
        ))}
      </div>
    );
  }
  if (id === "aether") {
    return (
      <div className="flex flex-1 flex-col justify-end gap-2.5 p-4">
        {[
          { w: "55%", me: false },
          { w: "42%", me: true },
          { w: "62%", me: false },
          { w: "35%", me: true },
        ].map((m, i) => (
          <div
            key={i}
            className={`h-5 rounded-full ${m.me ? "bg-foreground/30" : "bg-foreground/10"}`}
            style={{ width: m.w, alignSelf: m.me ? "flex-end" : "flex-start" }}
          />
        ))}
      </div>
    );
  }
  // dashboard (STR Mix)
  return (
    <div className="flex flex-1">
      <div className="w-1/4 space-y-2 border-r border-hairline p-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-2 rounded-full bg-foreground/15" style={{ width: `${85 - i * 12}%` }} />
        ))}
      </div>
      <div className="flex-1 p-3">
        <div className="mb-3 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg bg-secondary/70 p-2">
              <div className="h-2 w-3/4 rounded-full bg-foreground/20" />
              <div className="mt-1.5 h-3 w-1/2 rounded-full bg-foreground/40" />
            </div>
          ))}
        </div>
        <div className="flex h-16 items-end gap-1.5">
          {[40, 65, 50, 80, 60, 90, 70, 55].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-foreground/25" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
