export type VotingProject = {
  slug: string;
  title: string;
  organization?: string;
};

export const VOTING_PROJECTS: VotingProject[] = [
  { slug: "lokomotiv-pobedy", title: "Локомотив Победы", organization: "ООО «Локомотив Кубань»" },
  { slug: "project-2", title: "Проект 2" },
  { slug: "project-3", title: "Проект 3" },
  { slug: "project-4", title: "Проект 4" },
  { slug: "project-5", title: "Проект 5" },
];
