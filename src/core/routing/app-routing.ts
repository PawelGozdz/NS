interface ICategoriesRoutes {
  create: string;
  update: string;
  delete: string;
  getMany: string;
}

const categoriesRoot = '/categories';
const CategoryRoutes: { root: string; v1: ICategoriesRoutes } = {
  root: categoriesRoot,
  v1: {
    create: `${categoriesRoot}`,
    getMany: `${categoriesRoot}`,
    update: `${categoriesRoot}/:id`,
    delete: `${categoriesRoot}/:id`,
  },
};

interface ISkillsRoutes {
  create: string;
  update: string;
  delete: string;
  getMany: string;
}

const skillsRoot = '/skills';
const SkillRoutes: { root: string; v1: ISkillsRoutes } = {
  root: skillsRoot,
  v1: {
    create: `${skillsRoot}`,
    getMany: `${skillsRoot}`,
    update: `${skillsRoot}/:id`,
    delete: `${skillsRoot}/:id`,
  },
};

interface IJobUserProfileRoutes {
  create: string;
  update: string;
  getOneByUserId: string;
  getOneById: string;
}

const jobUserProfileRoot = '/job-profiles';
const JobUserProfileRoutes: { root: string; v1: IJobUserProfileRoutes } = {
  root: jobUserProfileRoot,
  v1: {
    create: `${jobUserProfileRoot}`,
    getOneByUserId: `${jobUserProfileRoot}/:id/user`,
    getOneById: `${jobUserProfileRoot}/:id`,
    update: `${jobUserProfileRoot}/:id`,
  },
};

interface IJobPositionRoutes {
  create: string;
  update: string;
  getMany: string;
}

const jobPositionRoot = '/job-positions';
const JobPositionRoutes: { root: string; v1: IJobPositionRoutes } = {
  root: jobPositionRoot,
  v1: {
    create: `${jobPositionRoot}`,
    getMany: `${jobPositionRoot}`,
    update: `${jobPositionRoot}/:id`,
  },
};

interface ICompanyRoutes {
  create: string;
  update: string;
  getMany: string;
}

const companyRoot = '/companies';
const CompanyRoutes: { root: string; v1: ICompanyRoutes } = {
  root: companyRoot,
  v1: {
    create: `${companyRoot}`,
    getMany: `${companyRoot}`,
    update: `${companyRoot}/:id`,
  },
};

interface IUsersRoutes {
  getUsers: string;
  getUser: string;
  update: string;
}

const usersRoot = '/users';
const UserRoutes: { root: string; v1: IUsersRoutes } = {
  root: usersRoot,
  v1: {
    getUsers: `${usersRoot}`,
    getUser: `${usersRoot}/:id`,
    update: `${usersRoot}/:id`,
  },
};

interface IAuthRoutes {
  signup: string;
  signin: string;
  logout: string;
  refresh: string;
}

const authRoot = 'auth';
const AuthRoutes: { root: string; v1: IAuthRoutes } = {
  root: authRoot,
  v1: {
    signup: `/${authRoot}/signup`,
    signin: `/${authRoot}/signin`,
    logout: `/${authRoot}/logout`,
    refresh: `/${authRoot}/refresh`,
  },
};

export const AppRoutes = {
  USERS: UserRoutes,
  AUTH: AuthRoutes,
  CATEGORIES: CategoryRoutes,
  SKILLS: SkillRoutes,
  JOB_USER_PROFILES: JobUserProfileRoutes,
  JOB_POSITIONS: JobPositionRoutes,
  COMPANIES: CompanyRoutes,
};
