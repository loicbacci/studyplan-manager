import { setDoc, doc, addDoc, collection } from "firebase/firestore";
import { db } from "./database";
import { auth } from "./config";


/**
 * Updates a course
 * @param course updated course info
 * @returns the promise of the update
 */
export const updateCourse = (course: Course) => {
  const newCourse: Partial<Category> = course;
  delete newCourse.id;
  
  if (!auth.currentUser) return Promise.reject("The user is not authentificated");

  return setDoc(doc(db, "users", auth.currentUser.uid, "courses", course.id), newCourse);
};

/**
 * Adds a course
 * @param credits the number of credits
 * @param link the link to the course's webpage
 * @param name the name of the course
 * @param school_course_id the school's course id
 * @param category_id the id of the category
 * @param season_id the id of the season
 * @param subcategory_id the id of the subcategory
 * @returns the promise
 */
export const addCourse = (
  credits: number,
  link: string,
  name: string,
  school_course_id: string,
  category_id: string,
  season_id: string,
  subcategory_id: string
) => {
  const toAdd: Partial<Course> = {
    credits,
    link,
    name,
    school_course_id,
    category_id,
    season_id,
    subcategory_id,
  };

  if (!auth.currentUser) return Promise.reject("The user is not authentificated");

  return addDoc(collection(db, "users", auth.currentUser.uid, "courses"), toAdd);
};
