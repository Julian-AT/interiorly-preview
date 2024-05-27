"use server";

import connectMongo from "@/lib/utils";
import ImageBatchModel from "@/models/imageBatch";

export async function saveImageBatch(imageBatch: ImageBatch) {
  try {
    await connectMongo();
    ImageBatchModel.create(imageBatch);
    return {
      message: "Image batch saved successfully",
      success: true,
      data: imageBatch,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: error.message || "An unknown error occured",
      success: false,
    };
  }
}

export async function getImageBatchesByFingerprint(fingerprint: number) {
  try {
    await connectMongo();
    const batches = await ImageBatchModel.find({ fingerprint });
    return {
      message: "Image batches retrieved successfully",
      success: true,
      data: batches,
    };
  } catch (error: any) {
    return {
      message: error.message || "An unknown error occured",
      success: false,
    };
  }
}

export async function clearImageBatches(fingerprint: number) {
  try {
    await connectMongo();
    await ImageBatchModel.deleteMany({ fingerprint });
    return {
      message: "Image batches cleared successfully",
      success: true,
    };
  } catch (error: any) {
    return {
      message: error.message || "An unknown error occured",
      success: false,
    };
  }
}
