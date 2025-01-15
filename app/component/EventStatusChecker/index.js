// EventStatusChecker.js
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../config";

const EventStatusChecker = ({ apiUrl, handleSuccess }) => {
  const [status, setStatus] = useState(null);
  const intervalIdRef = useRef(null);

  const checkStatus = async () => {
    try {
      const response = await axios.post(apiUrl);
      setStatus(response.data.message);
      if (response.data.message === "paid") {
        handleSuccess(response.data.data);
        clearInterval(intervalIdRef.current);
      }
    } catch (error) {
      console.error("Error fetching the status:", error);
      setStatus("Error fetching status");
    }
  };

  useEffect(() => {
    // Initial check
    checkStatus();
    // Set up interval to check status every 5 seconds
    intervalIdRef.current = setInterval(() => {
      checkStatus();
    }, 2000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalIdRef.current);
  }, [apiUrl]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Status: {status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  text: {
    fontSize: 18,
    color: COLORS.secondaryLightGreyHex,
  },
});

export default EventStatusChecker;
