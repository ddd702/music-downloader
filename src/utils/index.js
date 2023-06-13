export default {
  byteConvert(bytes, j = 0) {
    if (bytes < 1000 && !j) return bytes + 'B';
    const k = 1024; // 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let i = 0;
    if (j) {
      i = j;
      return parseFloat((bytes / Math.pow(k, i)).toPrecision()).toFixed(2);
    } else {
      i = Math.floor(Math.log(bytes) / Math.log(k));
    }
    return parseFloat((bytes / Math.pow(k, i)).toPrecision()).toFixed(2) + ' ' + sizes[i];
  }
};
