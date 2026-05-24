import { DetailCard } from '@components';

const ITEMS: readonly string[] = [
  'Their real age!, marriage/divorce, etc.',
  'Sex Offender Registry',
  'Criminal, Warrants, Arrests, etc.',
  'Bankruptcies, Foreclosures, Tax Liens',
];

export const WhatYoullFindCard = () => {
  return (
    <DetailCard
      title="What you’ll find"
      items={[...ITEMS]}
      className="gap-2 rounded-lg p-4"
      titleClassName="font-lexend-semiBold text-base leading-6 text-text-default"
      itemTextClassName="font-lexend-regular text-xs leading-[18px] text-text-secondary"
    />
  );
};
