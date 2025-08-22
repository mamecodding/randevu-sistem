const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create a file to stream archive data to
const output = fs.createWriteStream('tutoring-platform.zip');
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level
});

// Listen for all archive data to be written
output.on('close', function() {
  console.log('Arşiv başarıyla oluşturuldu!');
  console.log(archive.pointer() + ' toplam byte');
});

// Good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn('Uyarı:', err);
  } else {
    throw err;
  }
});

// Good practice to catch this error explicitly
archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add files and directories, excluding specified folders
const excludeDirs = ['node_modules', '.git', 'dist', '.bolt'];
const excludeFiles = ['package-lock.json', 'tutoring-platform.zip', 'export-project.js'];

function shouldExclude(filePath) {
  const relativePath = path.relative('.', filePath);
  const parts = relativePath.split(path.sep);
  
  // Check if any part of the path matches excluded directories
  for (const excludeDir of excludeDirs) {
    if (parts.includes(excludeDir)) {
      return true;
    }
  }
  
  // Check if filename matches excluded files
  const filename = path.basename(filePath);
  return excludeFiles.includes(filename);
}

function addDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    
    if (shouldExclude(fullPath)) {
      continue;
    }
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      addDirectory(fullPath);
    } else {
      const relativePath = path.relative('.', fullPath);
      archive.file(fullPath, { name: relativePath });
    }
  }
}

// Add all files from current directory
addDirectory('.');

// Finalize the archive
archive.finalize();