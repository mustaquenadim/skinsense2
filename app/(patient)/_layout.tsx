import { Entypo } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function PatientLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				statusBarStyle: 'dark',
			}}
		>
			<Stack.Screen name='(tabs)' />
			<Stack.Screen
				name='top-doctors'
				options={{
					title: 'Top Doctors',
					presentation: 'modal',
					animation: 'slide_from_bottom',
					headerShown: true,
					headerTitleAlign: 'center',
					headerTitleStyle: {
						fontSize: 16,
						fontWeight: 'medium',
					},
				}}
			/>
			<Stack.Screen
				name='doctor/[id]'
				options={{
					title: 'Doctor Detail',
					headerShown: true,
					presentation: 'card',
					headerTitleAlign: 'center',
					headerRight(props) {
						return (
							<TouchableOpacity>
								<Entypo name='dots-three-vertical' size={20} color='black' />
							</TouchableOpacity>
						);
					},
				}}
			/>
			<Stack.Screen
				name='appointment'
				options={{
					title: 'Appointment',
					headerShown: true,
					presentation: 'card',
					headerTitleAlign: 'center',
				}}
			/>
			<Stack.Screen
				name='chat/[id]'
				options={{
					title: 'Chat',
					headerShown: false,
					presentation: 'card',
					headerTitleAlign: 'center',
				}}
			/>
			<Stack.Screen
				name='call/[id]'
				options={{
					title: 'Call',
					headerShown: false,
					presentation: 'card',
					headerTitleAlign: 'center',
				}}
			/>
		</Stack>
	);
}
