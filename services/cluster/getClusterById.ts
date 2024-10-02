import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const FRAPPE_BASE_URL = 'http://157.245.58.91:8080'; // Replace with your Frappe instance

export type ClusterData = {
    nama_cluster: string;
};

const getHeaders = (sessionId: string) => ({
    headers: { Cookie: sessionId },
});

export const getClusterById = async (clusterId: string): Promise<ClusterData> => {
    try {
        const sessionId = await AsyncStorage.getItem('sid');
        if (!sessionId) throw new Error('No session ID found');

        const clusterFields = ['nama_cluster'];
        const clusterFilters = [[`name`, `=`, clusterId]];
        const clusterUrl = `${FRAPPE_BASE_URL}/api/resource/Cluster?fields=${JSON.stringify(clusterFields)}&filters=${JSON.stringify(clusterFilters)}`;

        const { data: clusterResponse } = await axios.get(clusterUrl, getHeaders(sessionId));
        const clusterData = clusterResponse.data[0];

        return {
            nama_cluster: clusterData.nama_cluster,
        };
    } catch (error) {
        console.error('Failed to get cluster data:', error);
        throw error;
    }
};
