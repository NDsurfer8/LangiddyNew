// Date: 18/08/21
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Modal,
  StyleSheet,
} from "react-native";

const ZoomImage = ({ imageUrl, style }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleImagePress = () => {
    setModalVisible(true);
  };

  const ImageModal = () => {
    return (
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: imageUrl }} style={styles.modalImage} />
          <TouchableWithoutFeedback
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleImagePress}>
        <View>
          <Image source={{ uri: imageUrl }} style={style} />
        </View>
      </TouchableWithoutFeedback>
      <ImageModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    position: "absolute",
    top: 88,
    right: 20,
  },
});

export default ZoomImage;
