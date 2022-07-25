interface BaseData {
  id: string
}

interface Category extends BaseData {
  min_credits?: number,
  name: string
}

interface Season extends BaseData {
  name: string
}

interface Semester extends BaseData {
  name: string
}

interface SubCategory extends BaseData {
  min_credits?: number,
  name: string
}

interface Course extends BaseData {
  category_id: string,
  season_id: string,
  subcategory_id: string,

  credits: number,
  link: string,
  name: string
}