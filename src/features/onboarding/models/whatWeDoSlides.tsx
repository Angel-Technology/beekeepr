import { IdCard, Search, ShieldCheck } from 'lucide-react-native';

import type { PaperOnboardingItemType } from '@components';
import OnlineFriendsIllustration from '@assets/svg/OnlineFriendsIllustration';
import ProfileInterfaceIllustration from '@assets/svg/ProfileInterfaceIllustration';
import SearchIllustration from '@assets/svg/SearchIllustration';

import { WhatWeDoSlide } from '../presentation/components/WhatWeDoSlide';

const ILLUSTRATION_SIZE = 280;

export const whatWeDoSlides: readonly PaperOnboardingItemType[] = [
  {
    backgroundColor: '#FFBF00',
    icon: IdCard,
    content: () => (
      <WhatWeDoSlide
        illustration={
          <ProfileInterfaceIllustration
            width={ILLUSTRATION_SIZE}
            height={ILLUSTRATION_SIZE}
          />
        }
        badgeLabel="ID verified"
        title="First, we’ll verify your identity."
      />
    ),
  },
  {
    backgroundColor: '#FDD301',
    icon: Search,
    content: () => (
      <WhatWeDoSlide
        illustration={
          <SearchIllustration
            width={ILLUSTRATION_SIZE * 1.5}
            height={ILLUSTRATION_SIZE}
          />
        }
        badgeLabel="No criminal records found"
        title="Then, we’ll search our criminal database."
      />
    ),
  },
  {
    backgroundColor: '#E5AC03',
    icon: ShieldCheck,
    content: () => (
      <WhatWeDoSlide
        illustration={
          <OnlineFriendsIllustration
            width={ILLUSTRATION_SIZE}
            height={ILLUSTRATION_SIZE}
          />
        }
        badgeLabel="ID verified / No criminal records"
        title="Share your results and start connecting!"
      />
    ),
  },
];
