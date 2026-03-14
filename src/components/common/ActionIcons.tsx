import type { LucideIcon, LucideProps } from 'lucide-react';
import {
  ArrowRight,
  Download,
  Eraser,
  Eye,
  EyeOff,
  FileCode2,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Menu,
  MessageCircle,
  Printer,
  Save,
  Settings,
  Sparkles,
  Undo2,
  Upload,
  X,
} from 'lucide-react';

type IconProps = LucideProps;

const withDefaults = (Icon: LucideIcon) => (props: IconProps) => (
  <Icon strokeWidth={1.8} aria-hidden {...props} />
);

export const PrinterIcon = withDefaults(Printer);
export const SettingsIcon = withDefaults(Settings);
export const SaveIcon = withDefaults(Save);
export const DownloadIcon = withDefaults(Download);
export const UploadIcon = withDefaults(Upload);
export const MailIcon = withDefaults(Mail);
export const WhatsappIcon = withDefaults(MessageCircle);
export const FileCodeIcon = withDefaults(FileCode2);
export const EraserIcon = withDefaults(Eraser);
export const SparkIcon = withDefaults(Sparkles);
export const UndoIcon = withDefaults(Undo2);
export const ArrowRightIcon = withDefaults(ArrowRight);
export const EyeIcon = withDefaults(Eye);
export const EyeOffIcon = withDefaults(EyeOff);
export const XIcon = withDefaults(X);
export const MenuIcon = withDefaults(Menu);
export const InstagramIcon = withDefaults(Instagram);
export const GithubIcon = withDefaults(Github);
export const LinkedinIcon = withDefaults(Linkedin);
