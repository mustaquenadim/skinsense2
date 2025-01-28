import { Entypo } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Search } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export default function DoctorLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				statusBarStyle: 'dark',
			}}
		>
			<Stack.Screen name='(tabs)' />
			<Stack.Screen
				name='available-time'
				options={{
					title: 'Update Time',
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
				name='patient-details'
				options={{
					title: 'Patient Details',
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
		</Stack>
	);
}
