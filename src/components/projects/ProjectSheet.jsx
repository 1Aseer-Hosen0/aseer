import React from 'react';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';

export function ProjectSheet({
  project,
  index,
  total,
  contourBg,
  onStageEnter,
  onStageMove,
  onStageLeave
}) {
  const pad = (n) => String(n).padStart(2, '0');
  const link = project.live ? project.url : project.repo;
  const host = project.live
    ? new URL(project.url).host
    : project.repo.replace('https://', '');

  return (
    <article
      className="art relative bg-void lg:absolute lg:inset-0 py-10 lg:py-0 lg:pb-20 border-b border-hair lg:border-0"
      data-i={index}
    >
      <div className="pin-in h-full grid lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Left Column */}
        <div className="relative lg:col-span-6 flex flex-col justify-between gap-10 lg:py-4">
          <span
            className="numeral absolute -left-1 top-6 lg:top-10 text-[clamp(200px,24vw,380px)] pointer-events-none select-none"
            aria-hidden="true"
          >
            {pad(index + 1)}
          </span>

          <div className="pm relative flex items-center gap-4 mono text-dim">
            {project.live ? (
              <Chip status>Live</Chip>
            ) : (
              <Chip repo>Repository</Chip>
            )}
            <span>
              {project.year} · {project.type}
            </span>
          </div>

          <div className="relative mt-28 lg:mt-0">
            <h3 className="h2 text-[clamp(64px,10.5vw,176px)]" aria-label={project.name}>
              {project.name.split(' ').map((word, wi) => (
                <span key={wi} className="w" aria-hidden="true">
                  {[...word].map((char, ci) => (
                    <span key={ci} className="ch">
                      {char}
                    </span>
                  ))}
                  {wi < project.name.split(' ').length - 1 ? ' ' : ''}
                </span>
              ))}
            </h3>
            <p className="pm mt-6 max-w-[38ch] text-mute leading-relaxed text-[16px] md:text-[17px]">
              {project.desc}
            </p>
          </div>

          <div className="relative flex flex-col gap-7">
            <div className="pm grid grid-cols-[88px_1fr] gap-y-3 items-center border-t border-hair pt-5 mono text-dim">
              <span>Role</span>
              <span className="text-ink normal-case tracking-normal text-[13px] font-sans">
                {project.role}
              </span>
              <span>Stack</span>
              <span className="flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <Chip key={s} stack>
                    {s}
                  </Chip>
                ))}
              </span>
            </div>

            <div className="pm flex flex-wrap gap-3">
              <Button
                as="a"
                size="project"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                magnetic
              >
                {project.live ? 'Visit live ↗' : 'View repository ↗'}
              </Button>
              {project.live && project.repo && (
                <Button
                  as="a"
                  variant="ghost"
                  size="project"
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  magnetic
                >
                  Source ↗
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Stage Preview */}
        <a
          className="stg group relative lg:col-span-6 block overflow-hidden rounded-lg border border-hair bg-base aspect-[4/3.3] lg:aspect-auto lg:h-full"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          data-label={project.live ? 'Visit live ↗' : 'Open repo ↗'}
          aria-label={`${project.name}: ${project.live ? 'visit live site' : 'open repository'}`}
          onMouseEnter={(e) => onStageEnter?.(e, project.live ? 'Visit live ↗' : 'Open repo ↗')}
          onMouseMove={onStageMove}
          onMouseLeave={onStageLeave}
        >
          <div className="absolute inset-x-0 top-0 h-10 z-10 flex items-center justify-between px-4 border-b border-hair bg-base/80 backdrop-blur mono text-dim">
            <span className="normal-case tracking-normal font-mono text-[11px] text-mute">
              {host}
            </span>
            <span>{project.live ? 'online' : 'main'}</span>
          </div>

          <div className="absolute inset-x-0 top-10 bottom-0 overflow-hidden">
            <div
              className="shot absolute -inset-[7%]"
              style={{
                backgroundColor: '#0A0A0A',
                backgroundImage: project.shot ? `url(${project.shot})` : contourBg,
                backgroundSize: 'cover',
                backgroundPosition: 'top'
              }}
            />
            {!project.shot && (
              <span className="absolute bottom-4 left-4 mono text-[10px] text-dim">
                Preview · add assets/{project.name.toLowerCase()}.jpg
              </span>
            )}
          </div>
        </a>
      </div>
    </article>
  );
}
