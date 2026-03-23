export type NavLink = {
  label: string;
  href: string;
};
 
export type MarqueeItem = {
  txt: string;
  color: string;
};
 
export type Service = {
  title: string;
  desc: string;
  bg: string;
  iconBg: string;
  tags: string[];
  tagColor: string;
  tagBg: string;
  icon: React.ReactNode;
};
 
export type Stat = {
  num: string;
  label: string;
  gradient: string;
};
 
export type TeamMember = {
  initials: string;
  name: string;
  role: string;
  roleColor: string;
  avatarFrom: string;
  avatarTo: string;
  avatarText: string;
  bio: string;
  skills: string[];
};