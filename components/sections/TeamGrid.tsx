import Image from 'next/image';
import StaggerGroup from '../motion/StaggerGroup';

export interface TeamMemberCard {
  id: string;
  name: string;
  role: string;
  image?: string;
  bio?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
}

export interface TeamGridProps {
  members: TeamMemberCard[];
  onDark?: boolean;
  className?: string;
}

/**
 * The template's team grid: a portrait at the card radius, the name in the
 * condensed display face, and the role in accent orange.
 */
export default function TeamGrid({ members, onDark = false, className = '' }: TeamGridProps) {
  if (members.length === 0) return null;

  return (
    <StaggerGroup className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {members.map(member => (
        <div key={member.id} className="group">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-surface">
            {member.image ? (
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 640px) 100vw, 25vw"
                className="object-cover transition-transform duration-[400ms] ease-brand group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span aria-hidden="true" className="font-display ghost-numeral uppercase">
                  {member.name.slice(0, 1)}
                </span>
              </div>
            )}
          </div>

          <h3
            className={`font-display mt-5 text-d5 uppercase leading-display tracking-display ${
              onDark ? 'text-white' : 'text-navy'
            }`}
          >
            {member.name}
          </h3>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-accent">{member.role}</p>

          {member.bio && (
            <p className={`mt-3 text-sm leading-[1.6] ${onDark ? 'text-white/80' : 'text-ink'}`}>
              {member.bio}
            </p>
          )}

          {(member.email || member.phone || member.linkedin) && (
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              {member.phone && (
                <a
                  href={`tel:${member.phone.replace(/\s/g, '')}`}
                  className={`transition-colors duration-300 ease-brand hover:text-accent ${
                    onDark ? 'text-white/60' : 'text-muted'
                  }`}
                >
                  {member.phone}
                </a>
              )}
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className={`transition-colors duration-300 ease-brand hover:text-accent ${
                    onDark ? 'text-white/60' : 'text-muted'
                  }`}
                >
                  {member.email}
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-colors duration-300 ease-brand hover:text-accent ${
                    onDark ? 'text-white/60' : 'text-muted'
                  }`}
                >
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      ))}
    </StaggerGroup>
  );
}
