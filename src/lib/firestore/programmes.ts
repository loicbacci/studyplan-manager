import { useCollection, useDoc, useFunctions } from "./firestoreUtils";

export const useProgrammes = () => {

  return {
    programmes: useCollection<Programme>("programmes"),
    ...useFunctions<Programme>("programmes")
  };
}

export const useProgramme = (programmeId: string) => {
  return {
    programme: useDoc<Programme>(`programmes/${programmeId}`)
  }
}