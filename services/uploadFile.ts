import axios from 'axios';

export const uploadFile = async (fileUri: string) => {
  try {
    const fileName = fileUri.split('/').pop();

    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: 'image/jpeg', 
    } as any);
    formData.append('is_private', '1');
    formData.append('folder', 'Home/Foto KTP Customer');

    const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/method/upload_file`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.message;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
