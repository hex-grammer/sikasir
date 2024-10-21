import { handleServiceError } from './errorHandler';

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

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/method/upload_file`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.ok) {
      throw response;
    }

    const data = await response.json();
    return data.message;
  } catch (error: any) {
    handleServiceError(error, {
      'Failed to upload file': 'There was an error uploading the file. Please try again.',
    });
  }
};
