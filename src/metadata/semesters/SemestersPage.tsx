import { Stack } from "@chakra-ui/react";
import SemesterEntry from "./SemesterEntry";

interface SemestersPageProps {
  semesters: Semester[];
}

const SemestersPage = (props: SemestersPageProps) => {
  const { semesters } = props;

  return (
    <Stack>
      {semesters && (
        <Stack>
          {semesters.map((semester) => (
            <SemesterEntry semester={semester} key={semester.id} />
          ))}
        </Stack>
      )}
      <SemesterEntry />
    </Stack>
  );
};

export default SemestersPage;
