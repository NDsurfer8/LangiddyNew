import React from "react";
import { TextInput, StyleSheet } from "react-native";
import colors from "../constants/colors";

const MultilineInput = (props) => {
  const { style, messageText, languageTo, setHeight, setMessageText } = props;

  return (
    <TextInput
      value={messageText}
      onChangeText={(text) => setMessageText(text)}
      contentEditable={true}
      style={
        messageText === ""
          ? styles.textBox
          : {
              ...styles.textBox,
              height: Math.max(35, height + 5),
              maxHeight: 211,
            }
      }
      autoCorrect={true}
      autoCapitalize="sentences"
      placeholder={`Translating to ${
        (languageTo === "af" && "Afrikaans") ||
        (languageTo === "ar" && "Arabic") ||
        (languageTo === "sq" && "Albanian") ||
        (languageTo === "am" && "Amharic") ||
        (languageTo === "hy" && "Armenian") ||
        (languageTo === "az" && "Azerbaijani") ||
        (languageTo === "eu" && "Basque") ||
        (languageTo === "be" && "Belarusian") ||
        (languageTo === "bn" && "Bengali") ||
        (languageTo === "bs" && "Bosnian") ||
        (languageTo === "bg" && "Bulgarian") ||
        (languageTo === "ca" && "Catalan") ||
        (languageTo === "ceb" && "Cebuano") ||
        (languageTo === "ny" && "Chichewa") ||
        (languageTo === "zh-CN" && "Chinese") ||
        (languageTo === "zh-TW" && "Chinese") ||
        (languageTo === "co" && "Corsican") ||
        (languageTo === "hr" && "Croatian") ||
        (languageTo === "cs" && "Czech") ||
        (languageTo === "da" && "Danish") ||
        (languageTo === "nl" && "Dutch") ||
        (languageTo === "en" && "English") ||
        (languageTo === "eo" && "Esperanto") ||
        (languageTo === "et" && "Estonian") ||
        (languageTo === "tl" && "Filipino") ||
        (languageTo === "fi" && "Finnish") ||
        (languageTo === "fr" && "French") ||
        (languageTo === "fy" && "Frisian") ||
        (languageTo === "gl" && "Galician") ||
        (languageTo === "ka" && "Georgian") ||
        (languageTo === "de" && "German") ||
        (languageTo === "el" && "Greek") ||
        (languageTo === "gu" && "Gujarati") ||
        (languageTo === "ht" && "Haitian Creole") ||
        (languageTo === "ha" && "Hausa") ||
        (languageTo === "haw" && "Hawaiian") ||
        (languageTo === "iw" && "Hebrew") ||
        (languageTo === "hi" && "Hindi") ||
        (languageTo === "hmn" && "Hmong") ||
        (languageTo === "hu" && "Hungarian") ||
        (languageTo === "is" && "Icelandic") ||
        (languageTo === "ig" && "Igbo") ||
        (languageTo === "id" && "Indonesian") ||
        (languageTo === "ga" && "Irish") ||
        (languageTo === "it" && "Italian") ||
        (languageTo === "ja" && "Japanese") ||
        (languageTo === "jw" && "Javanese") ||
        (languageTo === "kn" && "Kannada") ||
        (languageTo === "kk" && "Kazakh") ||
        (languageTo === "km" && "Khmer") ||
        (languageTo === "ko" && "Korean") ||
        (languageTo === "ku" && "Kurdish (Kurmanji)") ||
        (languageTo === "ky" && "Kyrgyz") ||
        (languageTo === "lo" && "Lao") ||
        (languageTo === "la" && "Latin") ||
        (languageTo === "lv" && "Latvian") ||
        (languageTo === "lt" && "Lithuanian") ||
        (languageTo === "lb" && "Luxembourgish") ||
        (languageTo === "mk" && "Macedonian") ||
        (languageTo === "mg" && "Malagasy") ||
        (languageTo === "ms" && "Malay") ||
        (languageTo === "ml" && "Malayalam") ||
        (languageTo === "mt" && "Maltese") ||
        (languageTo === "mi" && "Maori") ||
        (languageTo === "mr" && "Marathi") ||
        (languageTo === "mn" && "Mongolian") ||
        (languageTo === "my" && "Myanmar (Burmese)") ||
        (languageTo === "ne" && "Nepali") ||
        (languageTo === "no" && "Norwegian") ||
        (languageTo === "ny" && "Nyanja (Chichewa)") ||
        (languageTo === "ps" && "Pashto") ||
        (languageTo === "fa" && "Persian") ||
        (languageTo === "pl" && "Polish") ||
        (languageTo === "pt" && "Portuguese") ||
        (languageTo === "pa" && "Punjabi") ||
        (languageTo === "ro" && "Romanian") ||
        (languageTo === "ru" && "Russian") ||
        (languageTo === "sm" && "Samoan") ||
        (languageTo === "gd" && "Scots Gaelic") ||
        (languageTo === "sr" && "Serbian") ||
        (languageTo === "st" && "Sesotho") ||
        (languageTo === "sn" && "Shona") ||
        (languageTo === "sd" && "Sindhi") ||
        (languageTo === "si" && "Sinhala") ||
        (languageTo === "sk" && "Slovak") ||
        (languageTo === "sl" && "Slovenian") ||
        (languageTo === "so" && "Somali") ||
        (languageTo === "es" && "Spanish") ||
        (languageTo === "su" && "Sundanese") ||
        (languageTo === "sw" && "Swahili") ||
        (languageTo === "sv" && "Swedish") ||
        (languageTo === "tg" && "Tajik") ||
        (languageTo === "ta" && "Tamil") ||
        (languageTo === "te" && "Telugu") ||
        (languageTo === "th" && "Thai") ||
        (languageTo === "tr" && "Turkish") ||
        (languageTo === "uk" && "Ukrainian") ||
        (languageTo === "ur" && "Urdu") ||
        (languageTo === "uz" && "Uzbek") ||
        (languageTo === "vi" && "Vietnamese") ||
        (languageTo === "cy" && "Welsh") ||
        (languageTo === "xh" && "Xhosa") ||
        (languageTo === "yi" && "Yiddish") ||
        (languageTo === "yo" && "Yoruba") ||
        (languageTo === "zu" && "Zulu")
      }`}
      placeholderTextColor="grey"
      onContentSizeChange={(event) => {
        setHeight(event.nativeEvent.contentSize.height);
      }}
      scrollEnabled
      multiline
      maxLength={170}
    />
  );
};

export default MultilineInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },

  bubbleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    marginLeft: 8,
  },
  image: {
    flex: 1,
    resizeMode: "contain",
  },
  image2: {
    flex: 2,
    resizeMode: "contain",
    width: "71%",
    height: "71%",
  },

  errorBanner: {
    backgroundColor: "red",
  },
  popupTitleStyle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.orange,
  },
  uploadImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    resizeMode: "contain",
  },
  imageText: {
    marginLeft: 10,
    color: colors.orange,
  },
  name: {
    fontFamily: "regular",
    color: colors.grey,
    position: "absolute",
    top: -5,
    left: 35,
    fontSize: 12,
  },
  bubblelast: {
    marginBottom: 10,
  },
  trigger: {
    width: 20,
    height: 20,
    fontSize: 20,
    color: colors.defaultTextColor,
    fontFamily: "regular",
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    height: 50,
    alignItems: "flex-end",
    backgroundColor: "transparent",
  },
  textBox: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    height: 35,
    fontSize: 16,
    fontFamily: "regular",
    color: colors.defaultTextColor,
    textAlignVertical: "center",
  },
  globeButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingBottom: 4,
  },
});
