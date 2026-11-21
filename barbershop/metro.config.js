// Izinkan Metro membundel file .tflite sebagai aset aplikasi.
// Tanpa baris push di bawah, require("../../../assets/ai/model.tflite") gagal
// dengan "Unable to resolve module".
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push("tflite");

module.exports = config;
