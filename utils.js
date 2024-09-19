export function getThumbnailUrl(googleDriveUrl) {
    // Regular expression to extract the file ID from the Google Drive URL
    const idPattern = /id=([a-zA-Z0-9_-]+)/;
    const match = googleDriveUrl.match(idPattern);
  
    if (match && match[1]) {
      const fileId = match[1];
      // Format the thumbnail URL with the extracted file ID
      return fileId;
    } else {
      // Return an error message if ID extraction fails
      return googleDriveUrl
    }
  }