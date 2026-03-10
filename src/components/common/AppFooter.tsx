import { GithubIcon, InstagramIcon, LinkedinIcon } from './ActionIcons';

interface AppFooterProps {
  className?: string;
}

const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/rahhulsark/',
  github: 'https://github.com/irahulsarkar',
  linkedin: 'https://www.linkedin.com/in/rahhulsark/',
};

const socialButtonClassName = 'inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#3a3a3d] bg-[#1f1f22] text-[#f2f2f4] transition hover:border-[#7b90ba] hover:text-[#9cb4e0]';

export const AppFooter = ({ className = '' }: AppFooterProps) => {
  return (
    <footer className={`mt-6 rounded-2xl border border-[#2c2c30] bg-[#141416] px-4 py-2.5 text-[#d9d9de] shadow-[0_14px_32px_rgba(0,0,0,0.32)] sm:px-5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-medium sm:text-sm">
          <span className="text-[#9cb4e0]">QuikInvoice</span> • Developed by Rahul Sarkar. • Made with ❤️ in India, for Indians. • &copy; 2026 All rights reserved.
        </p>

        <div className="flex items-center gap-2">
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer me"
            className={socialButtonClassName}
            aria-label="Rahul Sarkar on Instagram"
          >
            <InstagramIcon className="h-4 w-4" />
          </a>
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer me"
            className={socialButtonClassName}
            aria-label="Rahul Sarkar on GitHub"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer me"
            className={socialButtonClassName}
            aria-label="Rahul Sarkar on LinkedIn"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};
