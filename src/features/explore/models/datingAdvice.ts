type DatingAdvice = {
  readonly id: string;
  readonly title: string;
  readonly statistic: string;
  readonly source: string;
  readonly advice: readonly string[];
};

/**
 * Static content for the explore tab's dating-advice cards. Order
 * matches the Figma layout. Edits land here, not on the screen.
 */
export const DATING_ADVICE: readonly DatingAdvice[] = [
  {
    id: 'verify-identity',
    title: 'Verify your date’s identity',
    statistic:
      'Statistics: A study by the Online Dating Association found that verifying online dates’ identities reduces the risk of deceptive situations by 50%.',
    source:
      'Source: Online Dating Association, “Identity Verification and Online Dating,” Online Dating Association',
    advice: [
      'Before meeting anyone for the first time in-person, always search for them in the Buzz Badge community. If they’re not there, ask them to get verified by us before meeting them in-person.',
      'If you feel uncomfortable asking, simply go to mydatingangel.com to run a quick identity & criminal background check.',
    ],
  },
  {
    id: 'public-place',
    title: 'Meet in a public place',
    statistic:
      'STATISTICS: A Pew Research Center survey found that 43% of women have experienced online harassment. Meeting in public spaces can mitigate these risks.',
    source:
      'SOURCE: Pew Research Center, “Online Harassment 2017,” Pew Research Center.',
    advice: [
      'DO NOT meet for the first time in a park or for a walk, or at a hiking trailhead... and definitely, NOT AT THEIR HOME!',
    ],
  },
  {
    id: 'personal-info-private',
    title: 'Keep your personal information private',
    statistic:
      'Statistics: The National Institute of Justice reports that women using their own transportation are 40% less likely to face coercive situations.',
    source: 'Source: CISA, “Cybersecurity and Personal Safety,” CISA',
    advice: [
      'NEVER GIVE OUT YOUR PHONE NUMBER before meeting someone in-person.',
      'Get a Google Voice number, it’s free and easy to use. Signal also offers the ability to communicate without disclosing any of your personal information. For dating apps, use their communication service until you meet in-person.',
      'Pro-tip: Saying “no” to a phone number request can reveal if they respect your boundaries',
    ],
  },
  {
    id: 'share-plans',
    title: 'Share your plans with someone',
    statistic:
      'Statistics: A study by the University of Washington showed that women who inform someone about their plans are 50% less likely to experience violent incidents.',
    source:
      'Source: University of Washington, “Safety Strategies for Dating,” University of Washington',
    advice: [
      'Not only should you share your plans (date, time and location) with a couple trusted friends and/or family members, we also recommend sharing your device location with them.',
    ],
  },
  {
    id: 'own-transportation',
    title: 'Arrange your own transportation',
    statistic:
      'Statistics: The National Institute of Justice reports that women using their own transportation are 40% less likely to face coercive situations.',
    source:
      'Source: National Institute of Justice, “Transportation and Personal Safety,” NIJ',
    advice: [
      'If someone offers to pick you up, please respectfully decline. DO NOT GET INTO ANYONE’S CAR! Same if someone offers to call you a ride share (Uber, Lift, etc.). DO NOT GIVE THEM YOUR HOME ADDRESS! (even if its a couple blocks away, it’s not worth it).',
      'It’s also smart to have the control to leave anytime. Ask yourself, “how many times have I wanted a second date, let alone, wanted to have sexual relations before the date was over?” Unless your track record is a 10/10, easiest way to avoid this situation is by arranging your own transportation.',
    ],
  },
  {
    id: 'time-limit',
    title: 'Set a time limit',
    statistic:
      'Statistics: Research in the Journal of Interpersonal Violence indicates that setting a clear time limit reduces negative encounters by 35%.',
    source:
      'Source: Journal of Interpersonal Violence, “Time Limit and Date Safety,” SAGE Journals',
    advice: [
      'The first date should be long enough to know if you want to see them again. Consider it a “vibe check,” to see if the attraction is mutual. This is why I always recommend a happy hour or a coffee date... casual, inexpensive and low pressure if the attraction is not there.',
      'Pro-tip: You shouldn’t feel like you’re in a relationship by the end or your first meeting. “Marathon dates” give a false impression of trust and intimacy.',
    ],
  },
  {
    id: 'trust-instincts',
    title: 'Trust your instincts',
    statistic:
      'Statistics: The American Psychological Association highlights that trusting instincts can help women avoid dangerous situations 60% of the time.',
    source:
      'Source: American Psychological Association, “Instinct and Personal Safety,” APA',
    advice: [
      'Your body never lies! If you feel anxious or something feels off... pause and ask yourself, “what advice would I give my best friend right now?” Be honest with yourself and take the advice.',
    ],
  },
  {
    id: 'avoid-alcohol',
    title: 'Avoid consuming excessive alcohol',
    statistic:
      'Statistics: The CDC found that 70% of women experiencing sexual assault reported alcohol involvement.',
    source:
      'Source: Centers for Disease Control and Prevention (CDC), “Alcohol and Sexual Violence,” CDC',
    advice: [
      'This is obvious. For a first date, 2 drinks max! And make sure you never leave your drink unattended.',
      'How much is “one” drink?',
      '1 shot (~40%, 80-proof) = 1.5 ounces\n1 glass of wine (~12%) = 5 ounces\n1 regular beer (~5%) = 12 ounces\n1 malt liquor (~7%) = 8 ounces',
    ],
  },
  {
    id: 'phone-near',
    title: 'Keep your phone near you',
    statistic:
      'Statistics: The Department of Justice found that keeping a phone accessible increases the likelihood of contacting help by 25%.',
    source:
      'Source: Department of Justice, “Mobile Phones and Personal Safety,” DOJ',
    advice: [
      'Never go on a date without your phone. I’m not sure I even have to say this, pretty obvious.',
      'Pro-tip: Do NOT put your phone on silent, do not disturb or sleep mode. Text a friend and/or family member to let them know when your date started. And text them again when it ends. And always check your phone if someone texts you.',
    ],
  },
  {
    id: 'physical-contact',
    title: 'Be cautious with physical contact',
    statistic:
      'Statistics: RAINN data indicates that 30% of women who reported unwanted physical contact felt uncomfortable setting boundaries.',
    source: 'Source: RAINN, “Unwanted Physical Contact Statistics,” RAINN',
    advice: [
      'Check in with yourself. If you feel uncomfortable, at any time, it’s ok to end the date early. If you have a difficult time setting boundaries, do not feel bad or embarrassed, this is actually very common... you’re not alone and it’s never your fault!',
      'Even if you have weak boundaries, it’s not your responsibility to teach others how to respect one another. This is a lack of character on their part, not a lack of boundary on yours.',
      'There are many anonymous resources online and on mydatingangel.com',
    ],
  },
  {
    id: 'exit-strategy',
    title: 'Have an exit strategy',
    statistic:
      'Statistics: The National Domestic Violence Hotline reports that having a planned exit strategy can reduce the risk of harassment or violence by 45%.',
    source:
      'Source: National Domestic Violence Hotline, “Exit Strategies and Safety,” National Domestic Violence Hotline',
    advice: [
      'Have a plan and stick to it! Have something scheduled or a place to be after the date. Make something up if you have to. Even if the date is going well, sticking to a schedule is very attractive. Shows commitment and integrity.',
      'Pro-tip: Get a friend or family member to call you 20-30 minutes into the date. Fake a family emergency, etc. if things aren’t going well.',
    ],
  },
];
