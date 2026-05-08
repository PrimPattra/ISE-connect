import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps } from 'react';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const MAP: Record<string, IoniconName> = {
  logo: 'globe-outline',
  search: 'search-outline',
  filter: 'options-outline',
  pin: 'location-outline',
  briefcase: 'briefcase-outline',
  building: 'business-outline',
  star: 'star-outline',
  'star-fill': 'star',
  plus: 'add-outline',
  send: 'send-outline',
  check: 'checkmark-outline',
  x: 'close-outline',
  'arrow-right': 'arrow-forward-outline',
  'arrow-left': 'arrow-back-outline',
  eye: 'eye-outline',
  lock: 'lock-closed-outline',
  mail: 'mail-outline',
  user: 'person-outline',
  users: 'people-outline',
  doc: 'document-text-outline',
  image: 'image-outline',
  play: 'play-circle-outline',
  github: 'logo-github',
  link: 'link-outline',
  tag: 'pricetag-outline',
  spark: 'sparkles-outline',
  bookmark: 'bookmark-outline',
  bell: 'notifications-outline',
  chat: 'chatbubble-outline',
  money: 'cash-outline',
  'eye-off': 'eye-off-outline',
  logout: 'log-out-outline',
  grid: 'grid-outline',
  list: 'list-outline',
  compass: 'compass-outline',
  globe: 'globe-outline',
  edit: 'pencil-outline',
  trash: 'trash-outline',
  upload: 'cloud-upload-outline',
  down: 'chevron-down-outline',
  up: 'chevron-up-outline',
  sliders: 'options-outline',
};

interface Props {
  name: string;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 18, color = 'currentColor' }: Props) {
  const iconName = MAP[name] ?? 'help-circle-outline';
  return <Ionicons name={iconName} size={size} color={color} />;
}
