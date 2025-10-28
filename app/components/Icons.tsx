import Github from "@/public/icons/github.svg";
import Article from "@/public/icons/article.svg";
import Download from "@/public/icons/download.svg";
import Demo from "@/public/icons/demo.svg";
import Gitlab from "@/public/icons/gitlab.svg";
import Linkedin from "@/public/icons/linkedin.svg";
import Missing from "@/public/icons/missing.svg";
import ChevronRight from "@/public/icons/chevron-right.svg";
import X from "@/public/icons/x.svg";
import YouTube from "@/public/icons/youtube.svg";
import Instagram from "@/public/icons/instagram.svg";
import Medium from "@/public/icons/medium.svg";

export const iconSize = 24;

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  article: Article,
  download: Download,
  demo: Demo,
  github: Github,
  gitlab: Gitlab,
  linkedin: Linkedin,
  chevronRight: ChevronRight,
  x: X,
  youtube: YouTube,
  instagram: Instagram,
  medium: Medium,
};

export const getIcon = (icon: keyof typeof iconMap) => {
  return iconMap[icon] || Missing;
};
export const icons = Object.keys(iconMap);
