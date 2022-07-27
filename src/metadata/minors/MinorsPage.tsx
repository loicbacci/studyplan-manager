import { Stack } from "@chakra-ui/react";
import MinorEntry from "./MinorEntry";

interface MinorsPageProps {
  minors: Minor[];
}

const MinorsPage = (props: MinorsPageProps) => {
  const { minors } = props;

  return (
    <Stack>
      {minors && (
        <Stack>
          {minors.map((minor) => (
            <MinorEntry minor={minor} key={minor.id} />
          ))}
        </Stack>
      )}
      <MinorEntry />
    </Stack>
  );
};

export default MinorsPage;
