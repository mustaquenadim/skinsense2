import { Tabs } from 'expo-router';
import { Home, Mail, Camera, Calendar, User } from 'lucide-react-native';

export default function DoctorTabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: '#fff',
					borderTopWidth: 0.5,
					borderTopColor: '#f3f4f6',
					shadowColor: '#000',
					shadowOffset: {
						width: 0,
						height: 2,
					},
					shadowOpacity: 0.25,
					shadowRadius: 3.84,
					elevation: 5,
					boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
					height: 60,
					paddingVertical: 10,
				},
				tabBarActiveTintColor: '#6C63FF',
				tabBarInactiveTintColor: '#ADADAD',
				tabBarShowLabel: false,
				tabBarIconStyle: {
					marginTop: 8,
				},
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Home',
					tabBarIcon: ({ color, size, focused }) => (
						<Home
							size={size}
							color={color}
							fill={focused ? color : '#fff'}
							fillOpacity={0.7}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='messages'
				options={{
					title: 'Messages',
					tabBarIcon: ({ color, size, focused }) => (
						<Mail
							size={size}
							color={color}
							fill={focused ? color : '#fff'}
							fillOpacity={0.7}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='appointments'
				options={{
					title: 'Appointments',
					tabBarIcon: ({ color, size, focused }) => (
						<Calendar
							size={size}
							color={color}
							fill={focused ? color : '#fff'}
							fillOpacity={0.7}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					title: 'Profile',
					tabBarIcon: ({ color, size, focused }) => (
						<User
							size={size}
							color={color}
							fill={focused ? color : '#fff'}
							fillOpacity={0.7}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
