const fs=require('fs');
// Function to delete a file
function deleteFile(fileName) {
    const filePath = `public/profile-photos/${fileName}`;
  
    fs.unlink(filePath, (error) => {
      if (error) {
        console.error(`Error deleting file ${fileName}:`, error);
      } else {
        console.log(`File ${fileName} deleted successfully.`);
      }
    });
  }

  module.exports = deleteFile;