import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })

        // file has been uploaded successfully
        // console.log("file is uploaded successfully on cloudinary", response.url);
        // console.log("all data about cloudinary response", response);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath); // remove locally saved temporry file as the upload operation got failed
        return null;
    }
}

const deleteOnCloudinary = async (resourceUrl) => {
    try {
        if (!resourceUrl) return null;

        // Extract the public ID from the URL
        const publicId = resourceUrl.substring(resourceUrl.lastIndexOf('/') + 1, resourceUrl.lastIndexOf('.'));

        // Delete resources with the specified public ID
        const response = await cloudinary.v2.api.delete_resources_by_prefix(publicId);

        if (response && response.deleted && response.deleted[publicId]) {
            return response;
        } else {
            throw new Error("Cloudinary resource deletion failed.");
        }
    } catch (error) {
        console.error("Error deleting resource from Cloudinary:", error);
        return null;
    }
}


export { uploadOnCloudinary , deleteOnCloudinary};