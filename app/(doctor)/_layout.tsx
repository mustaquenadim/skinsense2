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
		</Stack>
	);
}
