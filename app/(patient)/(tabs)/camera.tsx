import { FontAwesome6 } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { CameraIcon } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
	Button,
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { StatusBar } from 'expo-status-bar';

export default function CameraScreen() {
	const [facing, setFacing] = useState<CameraType>('back');
	const [permission, requestPermission] = useCameraPermissions();
	const [mediaPermission, requestMediaPermission] =
		MediaLibrary.usePermissions();
	const cameraRef = useRef<CameraView | null>(null);
	const router = useRouter();

	if (!permission) {
		// Camera permissions are still loading.
		return <View />;
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet.
		return (
			<View style={styles.container}>
				<Text style={styles.message}>
					We need your permission to show the camera
				</Text>
				<Button onPress={requestPermission} title='grant permission' />
			</View>
		);
	}

	function toggleCameraFacing() {
		setFacing((current) => (current === 'back' ? 'front' : 'back'));
	}

	const takePicture = async () => {
		if (cameraRef.current) {
			try {
				const photo = await cameraRef.current.takePictureAsync();
				if (mediaPermission?.granted) {
					await MediaLibrary.saveToLibraryAsync(photo.uri);
					alert('Photo saved to gallery!');
					router.push({
						pathname: '/(patient)/camera/analysis',
						params: { imageUri: photo.uri },
					});
				} else {
					await requestMediaPermission();
				}
			} catch (error) {
				console.error('Failed to take picture:', error);
			}
		}
	};

	return (
		<SafeAreaView className='flex-1 bg-black'>
			{/* <StatusBar style='auto' /> */}
			<View className='flex-1'>
				<View className='flex-1'>
					<CameraView
						ref={cameraRef}
						style={styles.camera}
						facing={facing}
					></CameraView>
				</View>

				<View className='bg-white p-4'>
					<View className='flex-row justify-around items-center'>
						<TouchableOpacity className='bg-violet-600 w-12 h-12 rounded-full items-center justify-center'>
							<FontAwesome6 name='images' size={16} color='white' />
						</TouchableOpacity>

						<TouchableOpacity
							className='w-20 h-20 rounded-full border-4 border-white'
							onPress={takePicture}
							style={{
								backgroundColor: '#E5E7EB',
							}}
						/>

						<TouchableOpacity onPress={toggleCameraFacing}>
							<View className='w-12 h-12 rounded-full bg-violet-600 items-center justify-center'>
								<FontAwesome6 name='camera-rotate' size={16} color='white' />
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},
	message: {
		textAlign: 'center',
		paddingBottom: 10,
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'transparent',
		margin: 64,
	},
	button: {
		flex: 1,
		alignSelf: 'flex-end',
		alignItems: 'center',
	},
	text: {
		fontSize: 24,
		fontWeight: 'bold',
		color: 'white',
	},
});
