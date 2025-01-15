import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
	SafeAreaView,
	ActivityIndicator,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import {
	Settings,
	FileText,
	Bell,
	CreditCard,
	Lock,
	HelpCircle,
	ChevronRight,
	Shield,
	LogOut,
} from 'lucide-react-native';
import { getAuth } from '@firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage, db } from '@/firebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const menuItems = [
	{
		icon: FileText,
		label: 'Medical Records',
		href: '/medical-records',
	},
	{
		icon: Bell,
		label: 'Notifications',
		href: '/notifications',
	},
	{
		icon: CreditCard,
		label: 'Payment Methods',
		href: '/payments',
	},
	{
		icon: Lock,
		label: 'Security',
		href: '/security',
	},
	{
		icon: HelpCircle,
		label: 'Help Center',
		href: '/help',
	},
];

interface UserData {
	name: string;
	email: string;
	role: string;
	profileImage?: string;
	createdAt: string;
}

export default function ProfileScreen() {
	const router = useRouter();
	const [userData, setUserData] = useState<any>(null);
	const [profilePicture, setProfilePicture] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		loadUserProfile();
		loadUserData();
	}, []);

	useEffect(() => {
		const unsubscribe = getAuth().onAuthStateChanged((user) => {
			if (!user) {
				console.log('Logging out...');
				router.replace('/(auth)');
			}
		});

		return () => unsubscribe();
	}, []);

	const loadUserData = async () => {
		try {
			setLoading(true);
			if (!auth.currentUser) return;

			const docRef = doc(db, 'users', auth.currentUser.uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const data = docSnap.data() as UserData;
				setUserData(data);
				setProfilePicture(data.profileImage || null);
			}
		} catch (error) {
			console.error('Error loading user data:', error);
		} finally {
			setLoading(false);
		}
	};

	const loadUserProfile = async () => {
		if (!auth.currentUser) return;
		const docRef = doc(db, 'users', auth.currentUser.uid);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			setProfilePicture(docSnap.data().profileImage);
		}
	};

	const pickImage = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.5,
			});

			if (!result.canceled && result.assets[0].uri) {
				await uploadImage(result.assets[0].uri);
			}
		} catch (error) {
			console.error('Error picking image:', error);
		}
	};

	const uploadImage = async (uri: string) => {
		if (!auth.currentUser) return;

		try {
			setLoading(true);
			const response = await fetch(uri);
			const blob = await response.blob();

			const storageRef = ref(
				storage,
				`profileImages/${auth.currentUser.uid}/profile.jpg`
			);
			await uploadBytes(storageRef, blob);

			const downloadURL = await getDownloadURL(storageRef);

			await updateDoc(doc(db, 'users', auth.currentUser.uid), {
				profileImage: downloadURL,
			});

			setProfilePicture(downloadURL);
		} catch (error) {
			console.error('Error uploading image:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView className='flex-1 bg-white'>
			<ScrollView className='flex-1'>
				<View className='px-4 pt-4'>
					<View className='flex-row justify-between items-center mb-6'>
						<Text className='text-2xl font-semibold'>Profile</Text>
						<TouchableOpacity>
							<Settings color='#7c3aed' size={24} />
						</TouchableOpacity>
					</View>

					<View className='items-center mb-6'>
						<TouchableOpacity onPress={pickImage} disabled={loading}>
							<View className='relative'>
								<Image
									source={
										profilePicture
											? { uri: profilePicture }
											: { uri: 'https://i.pravatar.cc/150?img=36' }
									}
									className='w-24 h-24 rounded-full'
								/>
								{loading && (
									<View className='absolute inset-0 bg-black/30 rounded-full items-center justify-center'>
										<ActivityIndicator color='white' />
									</View>
								)}
							</View>
						</TouchableOpacity>
						{/* <View className='relative'>
							<Image
								source={{ uri: 'https://i.pravatar.cc/150?img=36' }}
								className='w-24 h-24 rounded-full'
							/>
							<View className='absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white' />
						</View> */}
						{userData ? (
							<>
								<Text className='mt-4 text-xl font-semibold'>
									{userData?.name}
								</Text>
								<Text className='text-gray-500'>{userData?.email}</Text>
							</>
						) : (
							<ActivityIndicator style={{ marginTop: 20 }} />
						)}
					</View>

					{/* <View className='flex-row justify-between bg-violet-50 rounded-xl p-4 mb-6'>
						<View className='items-center flex-1'>
							<Text className='text-gray-600 mb-1'>Age</Text>
							<Text className='text-lg font-semibold'>28</Text>
						</View>
						<View className='items-center flex-1 border-x border-violet-200'>
							<Text className='text-gray-600 mb-1'>Weight</Text>
							<Text className='text-lg font-semibold'>65kg</Text>
						</View>
						<View className='items-center flex-1'>
							<Text className='text-gray-600 mb-1'>Height</Text>
							<Text className='text-lg font-semibold'>168cm</Text>
						</View>
					</View> */}

					{/* <View className='bg-gray-50 rounded-xl p-4 mb-6'>
						<View className='flex-row items-center mb-2'>
							<Shield size={20} className='text-violet-600' />
							<Text className='ml-2 font-semibold'>Insurance Plan</Text>
						</View>
						<Text className='text-gray-600'>Premium Health Coverage</Text>
						<Text className='text-violet-600'>Valid until Dec 2024</Text>
					</View> */}

					{/* <View className='space-y-4'>
						{menuItems.map((item, index) => {
							const Icon = item.icon;
							return (
								<Link href={item.href} key={index} asChild>
									<TouchableOpacity className='flex-row items-center justify-between bg-gray-50 p-4 rounded-xl'>
										<View className='flex-row items-center'>
											<Icon size={20} className='text-violet-600' />
											<Text className='ml-3 font-medium'>{item.label}</Text>
										</View>
										<ChevronRight size={20} className='text-gray-400' />
									</TouchableOpacity>
								</Link>
							);
						})}
					</View> */}

					<TouchableOpacity
						className='flex-row items-center justify-center gap-x-2 bg-red-50 p-4 rounded-xl mt-6 mb-8'
						onPress={() => auth.signOut()}
					>
						<LogOut size={20} color='#dc2626' />
						<Text className='ml-2 text-red-600 font-medium'>Sign Out</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
