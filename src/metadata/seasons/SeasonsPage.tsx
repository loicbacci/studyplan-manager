import { Stack } from "@chakra-ui/react";
import SeasonEntry from "./SeasonEntry";

interface SeasonsPageProps {
  seasons: Season[];
}

const SeasonsPage = (props: SeasonsPageProps) => {
  const { seasons } = props;

  return (
    <Stack>
      {seasons && (
        <Stack>
          {seasons.map((season) => (
            <SeasonEntry season={season} key={season.id} />
          ))}
        </Stack>
      )}
      <SeasonEntry />
    </Stack>
  );
};

export default SeasonsPage;
