import { useEffect, useRef, useState } from 'react';
import {
	View,
	SafeAreaView,
	Text,
	Alert,
	TouchableOpacity,
	StyleSheet,
	Platform,
	PermissionsAndroid,
} from 'react-native';
import AgoraUIKit from 'agora-rn-uikit';
import { useLocalSearchParams, router } from 'expo-router';
import createAgoraRtcEngine, {
	ChannelProfileType,
	ClientRoleType,
	IRtcEngine,
} from 'react-native-agora';
import { ChevronLeft, Mic, MicOff, Video, VideoOff } from 'lucide-react-native';

const appId = '7f6f3d145f8e40a1b2e2d2f07e644705';

export default function VoiceCallScreen() {
	const { id: receiverId } = useLocalSearchParams();
	const agoraEngineRef = useRef<IRtcEngine>();
	const [token, setToken] = useState<string>('');
	const [isJoined, setIsJoined] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [remoteUid, setRemoteUid] = useState(0);
	const [isVideoEnabled, setIsVideoEnabled] = useState(false);

	useEffect(() => {
		fetchToken();
	}, []);

	const fetchToken = async () => {
		try {
			const channelName = `call_${receiverId}`;
			const response = await fetch(
				`http://192.168.160.73:3000/token?channelName=${channelName}`
			);
			const data = await response.json();
			console.log(data);
			setToken(data.token);
			setupVoiceSDKEngine();
		} catch (error) {
			Alert.alert('Error', 'Failed to get call token : ' + error);
			router.back();
		}
	};

	const setupVoiceSDKEngine = async () => {
		try {
			if (Platform.OS === 'android') {
				await getPermission();
			}

			agoraEngineRef.current = createAgoraRtcEngine();
			const agoraEngine = agoraEngineRef.current;

			agoraEngine.initialize({ appId });
			joinChannel();
		} catch (error) {
			console.error('Error initializing voice call:', error);
		}
	};

	const joinChannel = async () => {
		if (!token) return;

		try {
			const channelName = `call_${receiverId}`;
			await agoraEngineRef.current?.joinChannel(token, channelName, 0, {
				channelProfile: ChannelProfileType.ChannelProfileCommunication,
				clientRoleType: ClientRoleType.ClientRoleBroadcaster,
			});
		} catch (error) {
			console.error('Error joining channel:', error);
		}
	};

	const toggleMute = () => {
		agoraEngineRef.current?.enableLocalAudio(!isMuted);
		setIsMuted(!isMuted);
	};

	const toggleVideo = () => {
		agoraEngineRef.current?.enableLocalVideo(!isVideoEnabled);
		setIsVideoEnabled(!isVideoEnabled);
	};

	const endCall = () => {
		try {
			agoraEngineRef.current?.leaveChannel();
			setRemoteUid(0);
			setIsJoined(false);
			router.back();
		} catch (e) {
			console.error('Error leaving channel:', e);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={endCall}>
					<ChevronLeft size={24} color='#1f2937' />
				</TouchableOpacity>
				<Text style={styles.headerText}>Voice Call</Text>
			</View>

			<View style={styles.content}>
				<Text style={styles.statusText}>
					{!isJoined
						? 'Connecting...'
						: remoteUid === 0
						? 'Waiting for other user...'
						: 'Connected'}
				</Text>
			</View>

			<View style={styles.controls}>
				<TouchableOpacity
					style={[styles.controlButton, isMuted && styles.mutedButton]}
					onPress={toggleMute}
				>
					{isMuted ? (
						<MicOff size={24} color='#fff' />
					) : (
						<Mic size={24} color='#fff' />
					)}
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.controlButton, !isVideoEnabled && styles.mutedButton]}
					onPress={toggleVideo}
				>
					{isVideoEnabled ? (
						<Video size={24} color='#fff' />
					) : (
						<VideoOff size={24} color='#fff' />
					)}
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.controlButton, styles.endCallButton]}
					onPress={endCall}
				>
					<Text style={styles.endCallText}>End Call</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
	},
	headerText: {
		fontSize: 18,
		fontWeight: '600',
		marginLeft: 12,
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	statusText: {
		fontSize: 16,
		color: '#4b5563',
	},
	controls: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		gap: 20,
	},
	controlButton: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: '#6C63FF',
		justifyContent: 'center',
		alignItems: 'center',
	},
	mutedButton: {
		backgroundColor: '#ef4444',
	},
	endCallButton: {
		backgroundColor: '#ef4444',
		width: 120,
	},
	endCallText: {
		color: '#fff',
		fontWeight: '600',
	},
});

const getPermission = async () => {
	if (Platform.OS === 'android') {
		await PermissionsAndroid.requestMultiple([
			PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
		]);
	}
};
