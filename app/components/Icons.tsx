import Github from "@/app/assets/icons/github.svg";
import Article from "@/app/assets/icons/article.svg";
import Download from "@/app/assets/icons/download.svg";
import Demo from "@/app/assets/icons/demo.svg";
import Gitlab from "@/app/assets/icons/gitlab.svg";
import Linkedin from "@/app/assets/icons/linkedin.svg";
import Missing from "@/app/assets/icons/missing.svg";
import ChevronRight from "@/app/assets/icons/chevron-right.svg";
import X from "@/app/assets/icons/x.svg";
import YouTube from "@/app/assets/icons/youtube.svg";
import Instagram from "@/app/assets/icons/instagram.svg";
import Medium from "@/app/assets/icons/medium.svg";

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
