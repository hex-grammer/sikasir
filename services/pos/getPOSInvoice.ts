import { iPOSInvoice } from "@/interfaces/posInvoice/iPOSInvoice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleServiceError } from "../errorHandler";

export interface iCustomer {
  custom_id_outlet: string;
  custom_npwp: string;
  custom_ktp: string;
  custom_alamat: string;
}

export interface iUser {
  full_name: string;
  cluster: string;
}

export interface iCluster {
  nama_cluster: string;
  alamat_cluster: string;
  telpon: string;
  nomor_cluster: string;
}

export interface iPOSInvoiceDetails extends iPOSInvoice {
  customer_details: iCustomer;
  owner_details: iUser;
  cluster_details?: iCluster;
}

export const getPOSInvoiceDetails = async (noInvoice: string, keys: string[] = []): Promise<iPOSInvoiceDetails | null> => {
  try {
    const sessionId = await AsyncStorage.getItem('sid');
    if (!sessionId) throw new Error('No session ID found. Please log in again.');

    const URL = `${process.env.EXPO_PUBLIC_API_URL}/api/resource/POS%20Invoice/${noInvoice}`;
    
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionId,
      },
    });

    if (!response.ok) {
      throw response;
    }

    const { data } = await response.json();

    const filteredData = keys.length > 0 
      ? Object.fromEntries(Object.entries(data).filter(([key]) => keys.includes(key))) 
      : data;

    let customerDetails: iCustomer | undefined;
    let ownerDetails: iUser | undefined;
    let clusterDetails: iCluster | undefined;

    if (keys.length === 0) {
      customerDetails = await getCustomerDetails(data.customer);
      ownerDetails = await getUserDetails(data.owner);

      if (ownerDetails.cluster) {
        clusterDetails = await getClusterDetails(ownerDetails.cluster);
      }
    }

    return {
      ...filteredData,
      customer_details: customerDetails,
      owner_details: ownerDetails,
      cluster_details: clusterDetails,
    };
  } catch (error: any) {
    handleServiceError(error);
    return null;
  }
};

const getCustomerDetails = async (customerId: string): Promise<iCustomer> => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/resource/Customer/${customerId}`);
  const customerData = await response.json();
  return customerData.data;
};

const getUserDetails = async (userId: string): Promise<iUser> => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/resource/User/${userId}`);
  const userData = await response.json();
  return userData.data;
};

const getClusterDetails = async (clusterId: string): Promise<iCluster> => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/resource/Cluster/${clusterId}`);
  const clusterData = await response.json();
  return clusterData.data;
};