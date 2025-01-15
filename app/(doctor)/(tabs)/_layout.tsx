import { Tabs } from 'expo-router';
import { Home, Mail, Camera, Calendar, User } from 'lucide-react-native';

export default function DoctorTabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: '#fff',
					borderTopWidth: 1,
					borderTopColor: '#f3f4f6',
				},
				tabBarActiveTintColor: '#6C63FF',
				tabBarInactiveTintColor: '#9ca3af',
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Home',
					tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
				}}
			/>
			<Tabs.Screen
				name='messages'
				options={{
					title: 'Messages',
					tabBarIcon: ({ color, size }) => <Mail size={size} color={color} />,
				}}
			/>
			<Tabs.Screen
				name='appointments'
				options={{
					title: 'Appointments',
					tabBarIcon: ({ color, size }) => (
						<Calendar size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					title: 'Profile',
					tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
				}}
			/>
		</Tabs>
	);
}
