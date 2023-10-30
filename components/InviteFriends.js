import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import { useNavigation } from "@react-navigation/native";
import * as SMS from "expo-sms";
import CachedImage from "react-native-expo-cached-image";

const InviteFriends = (props) => {
  const [error, setError] = useState();
  const [contacts, setContacts] = useState();

  const { userData } = props;

  const navigation = useNavigation();
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.Emails,
            Contacts.Fields.PhoneNumbers,
            Contacts.Fields.FirstName,
            Contacts.Fields.LastName,
            Contacts.Fields.ImageAvailable,
            Contacts.Fields.Image,
          ],
        });

        if (data.length > 0) {
          setContacts(data);
        } else {
          setError("No contacts found");
        }
      }
    })();
  }, []);

  const sendSMS = async (item) => {
    const isAvailable = await SMS.isAvailableAsync();

    if (isAvailable) {
      // do your SMS stuff here
      const { result } = await SMS.sendSMSAsync(
        [item],
        `Hey! Come chat with me on Langiddy, it's free to download and it provides instant translation in over 100 languages to learn from and much more. My username is ${userData.firstLast}, send me a message anytime! https://apps.apple.com/us/app/langiddy/id1672904077`
        // `Hey, I'm using Langiddy to learn ${
        //   (userData.language === "af" && "Africaans") ||
        //   (userData.language === "sq" && "Albanian") ||
        //   (userData.language === "am" && "Amharic") ||
        //   (userData.language === "ar" && "Arabic") ||
        //   (userData.language === "hy" && "Armenian") ||
        //   (userData.language === "az" && "Azerbaijani") ||
        //   (userData.language === "eu" && "Basque") ||
        //   (userData.language === "be" && "Belarusian") ||
        //   (userData.language === "bn" && "Bengali") ||
        //   (userData.language === "bs" && "Bosnian") ||
        //   (userData.language === "bg" && "Bulgarian") ||
        //   (userData.language === "my" && "Burmese") ||
        //   (userData.language === "ca" && "Catalan") ||
        //   (userData.language === "ceb" && "Cebuano") ||
        //   (userData.language === "ny" && "Chichewa") ||
        //   (userData.language === "zh-CN" && "Chinese") ||
        //   (userData.language === "zh-TW" && "Chinese") ||
        //   (userData.language === "co" && "Corsican") ||
        //   (userData.language === "hr" && "Croatian") ||
        //   (userData.language === "cs" && "Czech") ||
        //   (userData.language === "da" && "Danish") ||
        //   (userData.language === "nl" && "Dutch") ||
        //   (userData.language === "en" && "English") ||
        //   (userData.language === "eo" && "Esperanto") ||
        //   (userData.language === "et" && "Estonian") ||
        //   (userData.language === "tl" && "Filipino") ||
        //   (userData.language === "fi" && "Finnish") ||
        //   (userData.language === "fr" && "French") ||
        //   (userData.language === "fy" && "Frisian") ||
        //   (userData.language === "gl" && "Galician") ||
        //   (userData.language === "ka" && "Georgian") ||
        //   (userData.language === "de" && "German") ||
        //   (userData.language === "el" && "Greek") ||
        //   (userData.language === "gu" && "Gujarati") ||
        //   (userData.language === "ht" && "Haitian Creole") ||
        //   (userData.language === "ha" && "Hausa") ||
        //   (userData.language === "haw" && "Hawaiian") ||
        //   (userData.language === "iw" && "Hebrew") ||
        //   (userData.language === "hi" && "Hindi") ||
        //   (userData.language === "hmn" && "Hmong") ||
        //   (userData.language === "hu" && "Hungarian") ||
        //   (userData.language === "is" && "Icelandic") ||
        //   (userData.language === "ig" && "Igbo") ||
        //   (userData.language === "id" && "Indonesian") ||
        //   (userData.language === "ga" && "Irish") ||
        //   (userData.language === "it" && "Italian") ||
        //   (userData.language === "ja" && "Japanese") ||
        //   (userData.language === "jw" && "Javanese") ||
        //   (userData.language === "kn" && "Kannada") ||
        //   (userData.language === "kk" && "Kazakh") ||
        //   (userData.language === "km" && "Khmer") ||
        //   (userData.language === "ko" && "Korean") ||
        //   (userData.language === "ku" && "Kurdish (Kurmanji)") ||
        //   (userData.language === "ky" && "Kyrgyz") ||
        //   (userData.language === "lo" && "Lao") ||
        //   (userData.language === "la" && "Latin") ||
        //   (userData.language === "lv" && "Latvian") ||
        //   (userData.language === "lt" && "Lithuanian") ||
        //   (userData.language === "lb" && "Luxembourgish") ||
        //   (userData.language === "mk" && "Macedonian") ||
        //   (userData.language === "mg" && "Malagasy") ||
        //   (userData.language === "ms" && "Malay") ||
        //   (userData.language === "ml" && "Malayalam") ||
        //   (userData.language === "mt" && "Maltese") ||
        //   (userData.language === "mi" && "Maori") ||
        //   (userData.language === "mr" && "Marathi") ||
        //   (userData.language === "mn" && "Mongolian") ||
        //   (userData.language === "my" && "Myanmar (Burmese)") ||
        //   (userData.language === "ne" && "Nepali") ||
        //   (userData.language === "no" && "Norwegian") ||
        //   (userData.language === "ps" && "Pashto") ||
        //   (userData.language === "fa" && "Persian") ||
        //   (userData.language === "pl" && "Polish") ||
        //   (userData.language === "pt" && "Portuguese") ||
        //   (userData.language === "ma" && "Punjabi") ||
        //   (userData.language === "ro" && "Romanian") ||
        //   (userData.language === "ru" && "Russian") ||
        //   (userData.language === "sm" && "Samoan") ||
        //   (userData.language === "gd" && "Scots Gaelic") ||
        //   (userData.language === "sr" && "Serbian") ||
        //   (userData.language === "st" && "Sesotho") ||
        //   (userData.language === "sn" && "Shona") ||
        //   (userData.language === "sd" && "Sindhi") ||
        //   (userData.language === "si" && "Sinhala") ||
        //   (userData.language === "sk" && "Slovak") ||
        //   (userData.language === "sl" && "Slovenian") ||
        //   (userData.language === "so" && "Somali") ||
        //   (userData.language === "es" && "Spanish") ||
        //   (userData.language === "su" && "Sundanese") ||
        //   (userData.language === "sw" && "Swahili") ||
        //   (userData.language === "sv" && "Swedish") ||
        //   (userData.language === "tg" && "Tajik") ||
        //   (userData.language === "ta" && "Tamil") ||
        //   (userData.language === "te" && "Telugu") ||
        //   (userData.language === "th" && "Thai") ||
        //   (userData.language === "tr" && "Turkish") ||
        //   (userData.language === "uk" && "Ukrainian") ||
        //   (userData.language === "ur" && "Urdu") ||
        //   (userData.language === "uz" && "Uzbek") ||
        //   (userData.language === "vi" && "Vietnamese") ||
        //   (userData.language === "cy" && "Welsh") ||
        //   (userData.language === "xh" && "Xhosa") ||
        //   (userData.language === "yi" && "Yiddish") ||
        //   (userData.language === "yo" && "Yoruba") ||
        //   (userData.language === "zu" && "Zulu")
        // } . Come Join me on my language learning journey and meet new people along the way! https://www.langiddy.com/`
      );
      console.log("result: ", result);

      if (result === "sent") {
        alert("Message sent!");
      }

      if (result === "cancelled") {
        alert("Message cancelled!");
      }

      if (result === "failed") {
        alert("Message failed!");
      }

      if (result === "unknown") {
        alert("Message status unknown!");
      }

      if (result === "notSent") {
        alert("Message not sent!");
      }

      if (result === "notSupported") {
        alert("Message not supported!");
      }

      if (result === "invalidAddress") {
        alert("Message invalid address!");
      }

      if (result === "invalidBody") {
        alert("Message invalid body!");
      }

      if (result === "invalidRecipients") {
        alert("Message invalid recipients!");
      }
    } else {
      // misfortune... there's no SMS available on this device
      alert("SMS not available on this device");
    }
  };

  const getPhoneNumber = (contact) => {
    if (contact.phoneNumbers !== undefined) {
      return contact.phoneNumbers[0].number;
    }
  };
  const getPersonImage = (contact) => {
    if (contact.imageAvailable) {
      return contact.image.uri;
    } else {
      return "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png";
    }
  };

  let getContactRows = () => {
    if (contacts !== undefined) {
      return (
        <FlatList
          // sort by alphabetical order
          data={contacts.sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          })}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => sendSMS(item.phoneNumbers[0].number)}
              >
                <View style={styles.row}>
                  <CachedImage
                    source={{ uri: getPersonImage(item) }}
                    style={styles.pic}
                  />
                  <View>
                    <View style={styles.nameContainer}>
                      <Text
                        style={styles.nameTxt}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={styles.mblPhone}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {getPhoneNumber(item)}
                      </Text>
                    </View>
                    <View style={styles.msgContainer}>
                      <Text style={styles.msgTxt}>{item.status}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      );
    } else {
      return <Text>Awaiting contacts...</Text>;
    }
  };
  return (
    <View>
      <Text>{error}</Text>
      {getContactRows()}
    </View>
  );
};

export default InviteFriends;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#DCDCDC",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    padding: 10,
  },
  mblPhone: {
    fontWeight: "200",
    color: "#008B8B",
    fontSize: 13,
    marginLeft: 15,
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  nameContainer: {
    // justifyContent: "space-between",
    // width: 280,
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: "600",
    color: "#222",
    fontSize: 18,
    width: 170,
    marginTop: 5,
  },
  mblTxt: {
    fontWeight: "200",
    color: "#777",
    fontSize: 13,
  },
  msgContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  msgTxt: {
    fontWeight: "400",
    color: "#008B8B",
    fontSize: 12,
    marginLeft: 15,
  },
});
