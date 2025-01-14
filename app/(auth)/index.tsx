import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	SafeAreaView,
} from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Shield } from 'lucide-react-native';

export default function AuthScreen() {
	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style='dark' />
			<View style={styles.content}>
				<View style={styles.logoContainer}>
					<View style={styles.logoWrapper}>
						<Shield size={32} color='#fff' />
					</View>
					<Text style={styles.logoText}>SkinSense</Text>
				</View>

				<View style={styles.headerContainer}>
					<Text style={styles.title}>Let's get started!</Text>
					<Text style={styles.subtitle}>
						Login to enjoy the features we've provided, and stay healthy!
					</Text>
				</View>

				<View style={styles.buttonContainer}>
					<Link href='/login' asChild>
						<TouchableOpacity style={styles.loginButton}>
							<Text style={styles.loginButtonText}>Login</Text>
						</TouchableOpacity>
					</Link>

					<Link href='/register' asChild>
						<TouchableOpacity style={styles.signUpButton}>
							<Text style={styles.signUpButtonText}>Sign Up</Text>
						</TouchableOpacity>
					</Link>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	content: {
		flex: 1,
		paddingHorizontal: 24,
		justifyContent: 'center',
		alignItems: 'center',
	},
	logoContainer: {
		alignItems: 'center',
		marginBottom: 32,
	},
	logoWrapper: {
		width: 64,
		height: 64,
		borderRadius: 16,
		backgroundColor: '#6C63FF',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
	},
	logoText: {
		fontSize: 32,
		fontWeight: '600',
		color: '#6C63FF',
	},
	headerContainer: {
		alignItems: 'center',
		marginBottom: 32,
	},
	title: {
		fontSize: 24,
		fontWeight: '600',
		color: '#000',
		marginBottom: 8,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
		paddingHorizontal: 24,
	},
	buttonContainer: {
		width: '100%',
		gap: 12,
		marginBottom: 48,
	},
	loginButton: {
		width: '100%',
		height: 56,
		backgroundColor: '#6C63FF',
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loginButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	signUpButton: {
		width: '100%',
		height: 56,
		backgroundColor: '#fff',
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#6C63FF',
	},
	signUpButtonText: {
		color: '#6C63FF',
		fontSize: 16,
		fontWeight: '600',
	},
	dots: {
		flexDirection: 'row',
		gap: 8,
	},
	dot: {
		width: 32,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#E5E7EB',
	},
});
