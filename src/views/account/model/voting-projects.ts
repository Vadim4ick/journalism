export type VotingProject = {
  slug: string;
  title: string;
  organization?: string;
  description?: string;
};

export const VOTING_PROJECTS: VotingProject[] = [
  {
    slug: "lokomotiv-pobedy",
    title: "Локомотив Победы",
    organization: "ООО «Локомотив Кубань»",
  },
  { slug: "project-2", title: "Проект 2" },
  { slug: "project-3", title: "Проект 3" },
  { slug: "project-4", title: "Проект 4" },
  { slug: "project-5", title: "Проект 5" },
  { slug: "project-6", title: "Проект 6" },
  { slug: "project-7", title: "Проект 7" },
  { slug: "project-8", title: "Проект 8" },
  { slug: "project-9", title: "Проект 9" },
  { slug: "project-10", title: "Проект 10" },
];
