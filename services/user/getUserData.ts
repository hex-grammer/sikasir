import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { getClusterById } from "../cluster/getClusterById";

export interface iUserData {
    email: string;
    full_name: string;
    cluster: string;
};

const getHeaders = (sessionId: string) => ({
    headers: { Cookie: sessionId },
});

export const getUserData = async (): Promise<iUserData> => {
    try {
        const sessionId = await AsyncStorage.getItem('sid');
        if (!sessionId) throw new Error('No session ID found');

        const { data: loggedUserResponse } = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/api/method/frappe.auth.get_logged_user`, 
            getHeaders(sessionId)
        );

        // Check for a 403 error in the loggedUserResponse
        if (loggedUserResponse.code === 403) {
            throw new Error('Forbidden access');
        }

        const userId = loggedUserResponse.message;

        const fields = ['email','full_name', 'cluster'];
        const filters = [[`name`, `=`, userId]];
        const userUrl = `${process.env.EXPO_PUBLIC_API_URL}/api/resource/User?fields=${JSON.stringify(fields)}&filters=${JSON.stringify(filters)}`;
        const { data: userResponse } = await axios.get(userUrl, getHeaders(sessionId));
        const userData = userResponse.data[0];

        const cluster = await getClusterById(userData.cluster);

        return {
            email: userData.email,
            full_name: userData.full_name,
            cluster: cluster.nama_cluster,
        };
    } catch (error) {
        console.error('Failed to get user data:', error);
        throw error; 
    }
};