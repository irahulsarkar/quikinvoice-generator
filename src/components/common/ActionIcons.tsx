import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const baseIconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export const PrinterIcon = (props: IconProps) => (
  <svg {...baseIconProps} {...props}>
    <path d="M6 9V4h12v5" />
    <rect x="6" y="14" width="12" height="6" rx="1.5" />
    <path d="M6 17H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
    <circle cx="17.5" cy="11.5" r="0.5" />
  </svg>
);

export const SettingsIcon = (props: IconProps) => (
  <svg {...baseIconProps} {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1.8 1.8 0 0 1 0 2.5 1.8 1.8 0 0 1-2.5 0l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a1.8 1.8 0 0 1-1.8 1.8 1.8 1.8 0 0 1-1.8-1.8v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1.8 1.8 0 0 1-2.5 0 1.8 1.8 0 0 1 0-2.5l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a1.8 1.8 0 0 1-1.8-1.8A1.8 1.8 0 0 1 4 11.4h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1.8 1.8 0 0 1 0-2.5 1.8 1.8 0 0 1 2.5 0l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4A1.8 1.8 0 0 1 10.9 2.2 1.8 1.8 0 0 1 12.7 4v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1.8 1.8 0 0 1 2.5 0 1.8 1.8 0 0 1 0 2.5l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.2a1.8 1.8 0 0 1 1.8 1.8A1.8 1.8 0 0 1 18 15h-.2a1 1 0 0 0-.9.6Z" />
  </svg>
);

export const SaveIcon = (props: IconProps) => (
  <svg {...baseIconProps} {...props}>
    <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h9.8L20 7.7V17.5A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11Z" />
    <path d="M8 4v5h8V4" />
    <path d="M8 20v-6h8v6" />
  </svg>
);

export const DownloadIcon = (props: IconProps) => (
  <svg {...baseIconProps} {...props}>
    <path d="M12 4v11" />
    <path d="M8.5 11.5 12 15l3.5-3.5" />
    <path d="M5 19h14" />
  </svg>
);

export const UploadIcon = (props: IconProps) => (
  <svg {...baseIconProps} {...props}>
    <path d="M12 20V9" />
    <path d="m8.5 12.5 3.5-3.5 3.5 3.5" />
    <path d="M5 5h14" />
  </svg>
);

export const MailIcon = (props: IconProps) => (
  <svg {...baseIconProps} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2.2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const WhatsappIcon = (props: IconProps) => (
  <svg {...baseIconProps} {...props}>
    <path d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L4 21l4.9-1.3A8.5 8.5 0 1 0 12 3.5Z" />
    <path d="M9.1 9.3c.2-.5.4-.5.6-.5h.6c.2 0 .4.1.5.3l.9 2c.1.2.1.4 0 .6l-.4.6c-.1.2-.1.3 0 .5.3.6 1.2 1.8 2.6 2.4.2.1.3.1.5 0l.7-.6a.6.6 0 0 1 .6-.1l1.9.8c.3.1.4.3.3.6l-.2.9c-.1.3-.3.5-.6.5-.6.1-1.4.1-2.3-.4-1-.5-2.4-1.5-3.4-3.1-1-1.5-1.3-2.8-1.3-3.4 0-.3 0-.5.1-.7Z" />
  </svg>
);

export const FileCodeIcon = (props: IconProps) => (
  <svg {...baseIconProps} {...props}>
    <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    <path d="M14 3v5h5" />
    <path d="m10 14-2 2 2 2" />
    <path d="m14 14 2 2-2 2" />
  </svg>
);

export const EraserIcon = (props: IconProps) => (
  <svg {...baseIconProps} {...props}>
    <path d="m7 15 7.6-7.6a2.2 2.2 0 0 1 3.1 0l1.8 1.8a2.2 2.2 0 0 1 0 3.1L11.9 20H7a3 3 0 0 1-3-3v-.9L7 15Z" />
    <path d="M13 20h7" />
  </svg>
);

export const SparkIcon = (props: IconProps) => (
  <svg {...baseIconProps} {...props}>
    <path d="m12 3 1.9 4.8L19 9.7l-4.3 2.6L13 17l-1.7-4.7L7 9.7l5.1-1.9L12 3Z" />
    <path d="m5 14 .8 2 .2.8.2-.8.8-2 .8-.2-.8-.2-.8-2-.2-.8-.2.8-.8 2-.8.2.8.2Z" />
  </svg>
);

export const UndoIcon = (props: IconProps) => (
  <svg {...baseIconProps} {...props}>
    <path d="M9 8H4v5" />
    <path d="M4 13a8 8 0 1 0 2.3-5.7L4 8" />
  </svg>
);

export const ArrowRightIcon = (props: IconProps) => (
  <svg {...baseIconProps} {...props}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const EyeIcon = (props: IconProps) => (
  <svg {...baseIconProps} {...props}>
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOffIcon = (props: IconProps) => (
  <svg {...baseIconProps} {...props}>
    <path d="M3 3 21 21" />
    <path d="M10.6 6.2A10.3 10.3 0 0 1 12 6c6.5 0 10 6 10 6a17.8 17.8 0 0 1-4.3 4.8" />
    <path d="M6.4 8.1A17.6 17.6 0 0 0 2 12s3.5 6 10 6a10 10 0 0 0 2.4-.3" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </svg>
);

export const XIcon = (props: IconProps) => (
  <svg {...baseIconProps} {...props}>
    <path d="m18 6-12 12" />
    <path d="m6 6 12 12" />
  </svg>
);

export const MenuIcon = (props: IconProps) => (
  <svg {...baseIconProps} {...props}>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </svg>
);

export const InstagramIcon = (props: IconProps) => (
  <svg {...baseIconProps} {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5.2" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export const GithubIcon = (props: IconProps) => (
  <svg {...baseIconProps} {...props}>
    <path d="M12 3.2a8.8 8.8 0 0 0-2.8 17.1c.4.1.6-.2.6-.5v-2c-2.4.5-2.9-1-2.9-1-.4-.9-1-1.2-1-1.2-.8-.5.1-.5.1-.5.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .5-1.2-1.9-.2-3.9-1-3.9-4.2 0-.9.3-1.7.9-2.3-.1-.2-.4-1.1.1-2.2 0 0 .8-.2 2.5.9a8.7 8.7 0 0 1 4.6 0c1.7-1.1 2.5-.9 2.5-.9.5 1.1.2 2 .1 2.2.6.6.9 1.4.9 2.3 0 3.2-2 4-3.9 4.2.3.2.6.7.6 1.5v2.2c0 .3.2.6.6.5A8.8 8.8 0 0 0 12 3.2Z" />
  </svg>
);

export const LinkedinIcon = (props: IconProps) => (
  <svg {...baseIconProps} {...props}>
    <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="2.8" />
    <path d="M8 10.1v6.2" />
    <circle cx="8" cy="7.7" r="1.1" fill="currentColor" stroke="none" />
    <path d="M11.8 16.3v-3.5a2 2 0 0 1 4 0v3.5" />
    <path d="M11.8 12.8V10.1h4v2.7" />
  </svg>
);
