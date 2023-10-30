import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getFirebase } from "../utils/firebaseHelper";
import { ref, getDatabase, child, update, get } from "firebase/database";

export default function StarRating(props) {
  const { userId, ratingUserId } = props;
  const [starRating, setStarRating] = useState(null);
  const [totalRatings, setTotalRatings] = useState(0);
  const [averageStars, setAverageStars] = useState(0);
  const [lastRatingTime, setLastRatingTime] = useState(null);
  const [raters, setRaters] = useState([]);

  useEffect(() => {
    // Fetch user data from the real-time database
    const app = getFirebase();
    const dbRef = ref(getDatabase(app));
    const childRef = child(dbRef, `users/${userId}`);

    get(childRef).then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setTotalRatings(userData.totalRatings || 0);
        setAverageStars(userData.averageStars || 0);
        setLastRatingTime(userData.lastRatingTime || null);
        if (userData.raters) {
          setRaters(Object.keys(userData.raters));
        }
      }
    });
  }, [userId]);

  const handleRatingPress = (rating) => {
    if (
      !lastRatingTime ||
      is24HoursPassed(lastRatingTime) ||
      !raters.includes(ratingUserId)
    ) {
      const newTotalRatings = totalRatings + 1;
      const newAverageStars =
        (averageStars * totalRatings + rating) / newTotalRatings;

      setTotalRatings(newTotalRatings);
      setAverageStars(newAverageStars);
      setStarRating(rating);
      setLastRatingTime(Date.now());

      // Update the user's data in the real-time database and also the user who is rating
      const app = getFirebase();
      const dbRef = ref(getDatabase(app));
      const childRef = child(dbRef, `users/${userId}`);
      // Update the raters array by adding the new ratingUserId
      const updatedRaters = raters.includes(ratingUserId)
        ? raters
        : [...raters, ratingUserId];
      const updates = {
        starRatingLast: rating,
        totalRatings: newTotalRatings,
        averageStars: newAverageStars,
        lastRatingTime: lastRatingTime || Date.now(),
        raters: updatedRaters.reduce((acc, curr) => {
          acc[curr] = true;
          return acc;
        }, {}),
      };
      update(childRef, updates);
    } else {
      console.log("You can't rate again within 24 hours.");
    }
  };

  const is24HoursPassed = (lastTime) => {
    const currentTime = Date.now();
    const timeDifference = currentTime - lastTime;
    const hoursPassed = timeDifference / (1000 * 60 * 60);
    return hoursPassed >= 24;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <Text
        style={{
          fontSize: 18,
        }}
      >
        Responsiveness Rating: {averageStars.toFixed(2)}
      </Text> */}
      <View style={styles.container}>
        <Text style={styles.heading}>
          {/* {starRating ? `${starRating}` : "Tap to rate responsiveness"} */}
        </Text>

        {lastRatingTime &&
        !is24HoursPassed(lastRatingTime) &&
        raters.includes(ratingUserId) ? (
          <Text>Thank you</Text>
        ) : (
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <TouchableOpacity
                key={rating}
                onPress={() => handleRatingPress(rating)}
              >
                <MaterialIcons
                  name={starRating >= rating ? "star" : "star-border"}
                  size={32}
                  style={
                    starRating >= rating
                      ? styles.starSelected
                      : styles.starUnselected
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  averageRating: {
    fontSize: 18,
    marginBottom: 10,
  },
  stars: {
    display: "flex",
    flexDirection: "row",
  },
  starUnselected: {
    color: "#aaa",
  },
  starSelected: {
    color: "#ffb300",
  },
});
