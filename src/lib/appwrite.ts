import { Client, ID, Storage } from "appwrite";

const appwriteConfig = {
    endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
    filesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!,
    bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
    secretKey: process.env.NEXT_APPWRITE_SECRET!,
};

const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl) // Use environment variables
    .setProject(appwriteConfig.projectId);

const storage = new Storage(client);

export async function uploadFile(file: File, setProgress?: (progress: number) => void): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            if(setProgress) setProgress(0);
            const uniqueId = ID.unique(); 
            const uploadPromise = storage.createFile(
                appwriteConfig.bucketId, 
                uniqueId, 
                file,
                [],
                (progress) => {
                    // console.log(progress.progress)
                    if(setProgress) setProgress(progress.progress)
                    // setProgress(progress.progress)
                }
            ).then(
                (response) => {
                    const fileUrl = storage.getFileView(appwriteConfig.bucketId, response.$id);
                    resolve(fileUrl);
                },
                (error) => {
                    console.error("File upload failed:", error);
                    reject(error);
                }
            );
        } catch (error) {
            console.error("Error uploading file:", error);
            reject(error);
        }
    });
}
