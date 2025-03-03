import Github from "../../public/icons/github.svg";
import Article from "../../public/icons/article.svg";
import Download from "../../public/icons/download.svg";
import Demo from "../../public/icons/demo.svg";
import Gitlab from "../../public/icons/gitlab.svg";
import Linkedin from "../../public/icons/linkedin.svg";
import Missing from "../../public/icons/missing.svg";
import ChevronRight from "../../public/icons/chevron-rigt.svg";

export const iconSize = 24;

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  article: Article,
  download: Download,
  demo: Demo,
  github: Github,
  gitlab: Gitlab,
  linkedin: Linkedin,
  chevronRight: ChevronRight,
};

export const getIcon = (icon: string) => {
  return iconMap[icon] || Missing;
};
export const icons = Object.keys(iconMap);
