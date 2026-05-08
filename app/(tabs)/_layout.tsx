import { Tabs } from 'expo-router';
import { useAppContext } from '@/context/app-context';
import { HapticTab } from '@/components/haptic-tab';
import Ionicons from '@expo/vector-icons/Ionicons';
import { C } from '@/constants/theme';

export default function TabsLayout() {
  const { user } = useAppContext();
  const isRecruiter = user?.role === 'recruiter';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.teal500,
        tabBarInactiveTintColor: C.muted,
        tabBarStyle: { backgroundColor: C.paper, borderTopColor: C.line },
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="recruiter"
        options={{
          title: 'Recruiter',
          href: isRecruiter ? undefined : null,
          tabBarIcon: ({ color, size }) => <Ionicons name="briefcase-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Board',
          tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Reviews',
          tabBarIcon: ({ color, size }) => <Ionicons name="star-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="showcase"
        options={{
          title: 'Showcase',
          tabBarIcon: ({ color, size }) => <Ionicons name="image-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          href: isRecruiter ? null : undefined,
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
