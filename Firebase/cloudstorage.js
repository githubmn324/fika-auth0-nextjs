
// // Import Gooogle Client Library　→　使えない
// const {Storage} = require('@google-cloud/storage');

// // Creates a client
// const storage = new Storage();

// export async function downloadIntoMemory() {
//   // Downloads the file into a buffer in memory.
//   const contents = await storage.bucket(bucketName).file(fileName).download();

//   console.log(
//     `Contents of gs://${bucketName}/${fileName} are ${contents.toString()}.`
//   );
// }

// // // cloud storage for firebase
// // export async function createBucket() {
// //     // Creates the new bucket
// //     await storage.createBucket(bucketName);
// //     console.log(`Bucket ${bucketName} created.`);
// // }
  