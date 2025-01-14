import { Entypo } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Search } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export default function PatientLayout() {
	return (
		<Stack>
			<Stack.Screen
				name='(tabs)'
				options={{
					headerShown: false,
					statusBarBackgroundColor: 'light',
					statusBarStyle: 'light',
				}}
			/>
			<Stack.Screen
				name='top-doctors'
				options={{
					title: 'Top Doctors',
					presentation: 'modal',
					animation: 'slide_from_bottom',
					headerShown: true,
					headerTitleAlign: 'center',
					statusBarStyle: 'dark',
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
				name='doctor/[id]'
				options={{
					title: 'Doctor Detail',
					headerShown: true,
					presentation: 'card',
					headerTitleAlign: 'center',
					statusBarStyle: 'dark',
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
					statusBarStyle: 'dark',
				}}
			/>
			<Stack.Screen
				name='chat/[id]'
				options={{
					title: 'Chat',
					headerShown: false,
					presentation: 'card',
					headerTitleAlign: 'center',
					statusBarStyle: 'light',
				}}
			/>
		</Stack>
	);
}
