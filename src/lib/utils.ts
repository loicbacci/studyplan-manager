export const sortByIndex = <T extends { index: number }>(obj1: T, obj2: T) => {
  return obj1.index - obj2.index;
}

export const sortById = <T extends { id: string }>(obj1: T, obj2: T) => {
  return obj1.id.localeCompare(obj2.id)
}

export const sortBySchoolCourseId = <T extends { school_course_id: string }>(obj1: T, obj2: T) => {
  return obj1.school_course_id.localeCompare(obj2.school_course_id)
}

export const objEqual = (obj1: object, obj2: object) => {
  const ks1 = Object.keys(obj1);
  const ks2 = Object.keys(obj2);

  if (ks1.length !== ks2.length) return false;

  for (const key of ks1) {
    // @ts-ignore
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
}