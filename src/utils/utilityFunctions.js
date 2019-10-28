import axios from "axios";

// used to upload files to a server
export function uploadFiles(fileArray, url, progressCallback) {
  const data = new FormData();
  //used for allowing multiple uploads (selected file can be an array!
  // NOT looping through bytes)

  for (var x = 0; x < fileArray.length; x++) {
    data.append("file", fileArray[x]);
  }
  return axios
    .post(url, data, {
      // receive two parameter endpoint url ,form data
      onUploadProgress: ProgressEvent => {
        progressCallback && progressCallback(ProgressEvent);
      }
    })
    .then(response => {
      return response;
    });
}
