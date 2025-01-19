import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { auth, db } from '@/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterScreen() {
	const [role, setRole] = useState<'doctor' | 'patient' | null>(null);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({
		role: '',
		name: '',
		email: '',
		password: '',
	});

	const handleRegister = async () => {
		// Reset all errors
		setErrors({
			role: '',
			name: '',
			email: '',
			password: '',
		});

		// Validate fields
		if (!role) {
			setErrors((prev) => ({ ...prev, role: 'Please select a role' }));
			return;
		}

		if (!name) {
			setErrors((prev) => ({ ...prev, name: 'Please enter your name' }));
			return;
		}

		if (!email) {
			setErrors((prev) => ({ ...prev, email: 'Please enter your email' }));
			return;
		}

		if (!password) {
			setErrors((prev) => ({ ...prev, password: 'Please enter a password' }));
			return;
		}

		try {
			setLoading(true);
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			if (userCredential.user) {
				await updateProfile(userCredential.user, {
					displayName: name,
				});

				await setDoc(doc(db, 'users', userCredential.user.uid), {
					name,
					email,
					role,
					createdAt: new Date().toISOString(),
				});

				if (role === 'doctor') {
					router.replace('/(doctor)/(tabs)');
				} else {
					router.replace('/(patient)/(tabs)');
				}
			}
		} catch (error: any) {
			console.log(error);
			if (error.code === 'auth/email-already-in-use') {
				setErrors((prev) => ({ ...prev, email: 'Email already in use' }));
			} else if (error.code === 'auth/invalid-email') {
				setErrors((prev) => ({ ...prev, email: 'Invalid email address' }));
			} else if (error.code === 'auth/weak-password') {
				setErrors((prev) => ({ ...prev, password: 'Password is too weak' }));
			} else {
				alert('Registration failed: ' + error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style='dark' />
			<ScreenHeader title='Sign Up' />
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.keyboardView}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps='handled'
				>
					<View style={styles.form}>
						<View style={styles.roleContainer}>
							<Text style={styles.roleLabel}>I'm a</Text>
							<View style={styles.roleButtons}>
								<Button
									title='Doctor'
									onPress={() => {
										setRole('doctor');
										setErrors((prev) => ({ ...prev, role: '' }));
									}}
									variant={role === 'doctor' ? 'primary' : 'secondary'}
									style={styles.roleButton}
								/>
								<Button
									title='Patient'
									onPress={() => {
										setRole('patient');
										setErrors((prev) => ({ ...prev, role: '' }));
									}}
									variant={role === 'patient' ? 'primary' : 'secondary'}
									style={styles.roleButton}
								/>
							</View>
							{errors.role ? (
								<Text style={styles.errorText}>{errors.role}</Text>
							) : null}
						</View>

						<Input
							placeholder='Enter your name'
							value={name}
							onChangeText={(text) => {
								setName(text);
								setErrors((prev) => ({ ...prev, name: '' }));
							}}
							autoCapitalize='none'
							keyboardType='default'
							icon='user'
							error={errors.name}
						/>

						<Input
							placeholder='Enter your email'
							value={email}
							onChangeText={(text) => {
								setEmail(text);
								setErrors((prev) => ({ ...prev, email: '' }));
							}}
							autoCapitalize='none'
							keyboardType='email-address'
							icon='mail'
							error={errors.email}
						/>

						<Input
							placeholder='Create a password'
							value={password}
							onChangeText={(text) => {
								setPassword(text);
								setErrors((prev) => ({ ...prev, password: '' }));
							}}
							icon='lock'
							error={errors.password}
							isPassword
						/>

						<Button
							title='Sign Up'
							onPress={handleRegister}
							loading={loading}
							style={styles.button}
						/>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	keyboardView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		padding: 24,
	},
	form: {
		flex: 1,
		justifyContent: 'center',
	},
	button: {
		marginTop: 12,
	},
	roleLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 8,
		marginTop: 16,
		textAlign: 'center',
	},
	roleContainer: {
		marginBottom: 24,
	},
	roleButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 8,
	},
	roleButton: {
		flex: 1,
		marginHorizontal: 4,
	},
	errorText: {
		color: '#ef4444',
		fontSize: 12,
		marginTop: 4,
		textAlign: 'center',
	},
});
