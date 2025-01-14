import { Entypo } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Search } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export default function DoctorLayout() {
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
		</Stack>
	);
}
