// services/user/getUserData.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { getClusterById } from "../cluster/getClusterById";

const FRAPPE_BASE_URL = 'http://157.245.58.91:8080'; // Replace with your Frappe instance

export type UserData = {
    full_name: string;
    cluster: string;
};

const getHeaders = (sessionId: string) => ({
    headers: { Cookie: sessionId },
});

export const getUserData = async (): Promise<UserData> => {
    try {
        const sessionId = await AsyncStorage.getItem('sid');
        if (!sessionId) throw new Error('No session ID found');

        const { data: loggedUserResponse } = await axios.get(
            `${FRAPPE_BASE_URL}/api/method/frappe.auth.get_logged_user`, 
            getHeaders(sessionId)
        );

        // Check for a 403 error in the loggedUserResponse
        if (loggedUserResponse.code === 403) {
            throw new Error('Forbidden access');
        }

        const userId = loggedUserResponse.message;

        const fields = ['full_name', 'cluster'];
        const filters = [[`name`, `=`, userId]];
        const userUrl = `${FRAPPE_BASE_URL}/api/resource/User?fields=${JSON.stringify(fields)}&filters=${JSON.stringify(filters)}`;
        const { data: userResponse } = await axios.get(userUrl, getHeaders(sessionId));
        const userData = userResponse.data[0];

        const cluster = await getClusterById(userData.cluster);

        return {
            full_name: userData.full_name,
            cluster: cluster.nama_cluster,
        };
    } catch (error) {
        console.error('Failed to get user data:', error);
        throw error; // Rethrow the error to be caught in the HomeScreen
    }
};