interface BaseData {
  id: string;
}

//   Plan
//     |
// Programmes --- Majors
//            \__ Minors
//             \_ Categories -- SubCategories
//                Seasons
//                Semesters
//                Courses

interface Plan extends BaseData {
  name: string
  programme_id: string
  chosen_major_id: string
  chosen_minor_id: string
  chosen_courses_ids: string[],
  notes?: string
}

interface Programme extends BaseData {
  name: string,
  min_credits: number,
  notes?: string
}

interface Major extends BaseData {
  name: string
}

interface Minor extends BaseData {
  name: string
}

interface Category extends BaseData {
  name: string;
  is_major: boolean;
  is_minor: boolean;
  min_credits?: number;
  notes?: string;
  index: number;
}

interface SubCategory extends BaseData {
  name: string;
  min_credits?: number;
  notes?: string;
  index: number
}

interface CategoryData {
  category: Category,
  subCategories?: SubCategory[],
}


interface Season extends BaseData {
  name: string;
}

interface Semester extends BaseData {
  name: string;
  index: number;
  season_id: string;
}

interface Course extends BaseData {
  category_id: string;
  season_id: string;
  subcategory_id?: string;

  credits: number;
  link: string;
  name: string;
  school_course_id: string;

  major_id?: string,
  minor_id?: string
}
