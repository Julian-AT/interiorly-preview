import { model, models, Schema } from "mongoose";

const ImageBatchSchema = new Schema<ImageBatch>(
  {
    batch: [String],
    prompt: String,
    timestamp: Number,
    fingerprint: Number,
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
      },
    },
  }
);

const ImageBatch = models.ImageBatch || model("ImageBatch", ImageBatchSchema);
export default ImageBatch;
