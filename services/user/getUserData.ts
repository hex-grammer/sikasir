import AsyncStorage from "@react-native-async-storage/async-storage";
import { getClusterById } from "../cluster/getClusterById";
import { handleServiceError } from "../errorHandler";

export interface iUserData {
    email: string;
    full_name: string;
    cluster: string;
};

const getHeaders = (sessionId: string) => ({
    Cookie: sessionId,
});

export const getUserData = async (): Promise<iUserData> => {
    try {
        const sessionId = await AsyncStorage.getItem('sid');
        if (!sessionId) throw new Error('No session ID found');

        const loggedUserResponse = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/api/method/frappe.auth.get_logged_user`,
            { headers: getHeaders(sessionId) }
        );

        if (!loggedUserResponse.ok) {
            throw loggedUserResponse;
        }

        const loggedUserData = await loggedUserResponse.json();
        const userId = loggedUserData.message;

        const fields = ['email', 'full_name', 'cluster'];
        const filters = [[`name`, `=`, userId]];
        const userUrl = `${process.env.EXPO_PUBLIC_API_URL}/api/resource/User?fields=${JSON.stringify(fields)}&filters=${JSON.stringify(filters)}`;
        const userResponse = await fetch(userUrl, { headers: getHeaders(sessionId) });

        if (!userResponse.ok) {
            throw userResponse;
        }

        const userResponseData = await userResponse.json();
        const userData = userResponseData.data[0];

        const cluster = await getClusterById(userData.cluster);

        return {
            email: userData.email,
            full_name: userData.full_name,
            cluster: cluster.nama_cluster,
        };
    } catch (error) {
        handleServiceError(error, {
            'No session ID found': 'Authentication Error. Please log in again.',
            'Failed to get user data': 'Unable to retrieve user information. Please try again.',
        });
        throw error;
    }
};
