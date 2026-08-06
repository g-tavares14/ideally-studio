import HeroInstitucional from './HeroInstitucional';
import ExperienceStageClient from './ExperienceStageClient';
import ShowroomCopy from './ShowroomCopy';

export default function HomeExperience() {
  return <ExperienceStageClient hero={<HeroInstitucional />} showroom={<ShowroomCopy />} />;
}
