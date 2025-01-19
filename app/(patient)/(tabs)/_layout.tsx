import { Tabs } from 'expo-router';
import { Home, Mail, Camera, Calendar, User, House } from 'lucide-react-native';

export default function PatientTabsLayout() {
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
				name='camera'
				options={{
					title: 'Camera',
					tabBarIcon: ({ color, size, focused }) => (
						<Camera strokeWidth={1.5} size={30} color='#fff' />
					),
					tabBarIconStyle: {
						backgroundColor: '#6C63FF',
						borderRadius: 100,
						width: 60,
						height: 60,
					},
					tabBarItemStyle: {
						marginTop: -35,
					},
				}}
			/>
			<Tabs.Screen
				name='schedule'
				options={{
					title: 'Schedule',
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
