import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { DATING_ADVICE } from '../../models/datingAdvice';
import { ExploreBody } from '../components/ExploreBody';

/**
 * Connected wrapper for the Explore tab. Owns the drawer-toggle side
 * effect (`useNavigation` + `DrawerActions`) and feeds the static
 * dating-advice list into `ExploreBody` for rendering.
 *
 * Why a thin wrapper: the body's JSX is the source of truth for what the
 * screen looks like, and Storybook renders that body directly. Extracting
 * navigation out of the presentation means there's no parallel preview
 * composition to keep in sync — same pixels in production and in stories.
 */
export const ExploreScreen = () => {
  const navigation = useNavigation();

  return (
    <ExploreBody
      items={DATING_ADVICE}
      onOpenMenu={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    />
  );
};
