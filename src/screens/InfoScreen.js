import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import PageContainer from "../../components/PageContainer";
import { FontAwesome5 } from "@expo/vector-icons";
import colors from "../../constants/colors";

const InfoScreen = (props) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PageContainer>
        {/* <Text style={styles.header}>Transform Your Language Learning!</Text> */}

        <View style={styles.tipContainer}>
          <Text style={{ ...styles.tipText, paddingBottom: 30 }}>
            Transform everyday conversations into a language learning
            experience! Just chat, tap and learn!
          </Text>
          <View style={styles.tipItem}>
            <Image
              source={require("../../assets/images/trans.png")}
              style={styles.tipIcon}
            />
            <Text style={styles.tipDescription}>
              Change "Translate to" language.
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Image
              source={require("../../assets/images/preview.png")}
              style={styles.tipIcon}
            />
            <Text style={styles.tipDescription}>Preview translations.</Text>
          </View>
          <View>
            <Text style={styles.tipText}>
              Tap on messages to create flashcards.
            </Text>
            <Text style={styles.tipText}>
              Tap on translation to hear pronunciation.
            </Text>
          </View>
        </View>

        <Text style={styles.featuresHeader}>Amazing Features:</Text>
        <FeatureCard
          title="Flashcards"
          description="Master new languages with interactive flashcards. Earn a Gold star for mastery!"
          onPress={() => {
            props.navigation.navigate("Flashcards");
            // Add logic to navigate to flashcard screen
          }}
        />

        <FeatureCard
          title="Parallel Text Reading `Langs`"
          description="Connect with people who share your native language and want to learn your target language with you."
          onPress={() => {
            props.navigation.navigate("Langs");
            // Add logic to navigate to language exchange screen
          }}
        />

        <FeatureCard
          title="Language Exchange `Natives`"
          description="Connect with Native speakers of your target language and learn with them."
          use="search"
          onPress={() => {
            props.navigation.navigate("Langs");
            // Add logic to navigate to language exchange screen
          }}
        />

        {/* Add more features here */}
      </PageContainer>
    </ScrollView>
  );
};

const FeatureCard = ({ title, description, use, onPress }) => {
  return (
    <TouchableOpacity style={styles.featureCard} onPress={onPress}>
      <View style={styles.featureCardHeader}>
        <Text style={styles.featureTitle}>{title}</Text>
      </View>
      <Text style={styles.featureDescription}>{description}</Text>
      {use === "search" && (
        <View style={styles.searchIconContainer}>
          <FontAwesome5 name="search" size={20} color={colors.orange} />
          <Text style={styles.searchText}>
            Tap search icon to find natives.
          </Text>
        </View>
      )}
      {use && use !== "search" && <Text style={styles.featureUse}>{use}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    fontFamily: "bold",
    fontSize: 24,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  tipContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  tipIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  tipDescription: {
    fontFamily: "regular",
    fontSize: 16,
    color: "#666",
  },
  tipText: {
    fontFamily: "regular",
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 15,
  },
  featuresHeader: {
    fontFamily: "bold",
    fontSize: 20,
    color: "#333",
    marginVertical: 20,
  },
  featureCard: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  featureCardHeader: {
    marginBottom: 8,
  },
  featureTitle: {
    fontFamily: "bold",
    fontSize: 18,
    color: "#333",
  },
  featureDescription: {
    fontFamily: "regular",
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  searchIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  searchText: {
    fontFamily: "regular",
    fontSize: 16,
    color: "#666",
    marginLeft: 10,
  },
});

export default InfoScreen;
