interface BaseData {
  id: string;
}

interface Category extends BaseData {
  name: string;
  min_credits?: number;
  notes?: string;
}

interface Season extends BaseData {
  name: string;
}

interface Semester extends BaseData {
  name: string;
}

interface SubCategory extends BaseData {
  name: string;
  parentId: string;
  min_credits?: number;
  notes?: string;
}

interface Course extends BaseData {
  category_id: string;
  season_id: string;
  subcategory_id: string;

  credits: number;
  link: string;
  name: string;
  school_course_id: string;
}
