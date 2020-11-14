
interface ThreeProp {
  name: string;
  desc: string;
  link: string;
  language?: string[]
}

interface TwoProp {
  subtitle?: string;
  icon?: string | null;
  nav: ThreeProp[]
}

export interface INavProps {
  title: string;
  icon?: string | null;
  nav: TwoProp[]
}
