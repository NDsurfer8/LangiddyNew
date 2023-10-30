import axios from "axios";
//Nlp-translation.p.rapidapi.com
import { transliterate as tr } from "transliteration";

export const translateText = async (enteredText, languageFrom, languageTo) => {
  const options = {
    method: "GET",
    url: "https://nlp-translation.p.rapidapi.com/v1/translate",
    params: { text: enteredText, to: languageTo, from: languageFrom },
    headers: {
      "X-RapidAPI-Key": "f519fc13bbmshd84a80354a2b4e2p122a16jsn8981d4fbfcfd",
      "X-RapidAPI-Host": "nlp-translation.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);

    if (response.status !== 200) {
      console.log(response);
      throw new Error("Error translating text");
    }

    const translatedText = response.data.translated_text;

    // Check if translatedText is not empty or undefined before transliteration
    if (translatedText) {
      // Access the first key in the object and use its value for transliteration
      const firstKey = Object.keys(translatedText)[0];
      const romanizedText = tr(translatedText[firstKey]);
      console.log("romanizedText: ", romanizedText);
      return romanizedText;
    } else {
      throw new Error("Translated text is empty or undefined");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error during translation");
  }
};

// export const translateTextMessage = async (
//   messageText,
//   languageFrom,
//   languageTo
// ) => {
//   const options = {
//     method: "GET",
//     url: "https://nlp-translation.p.rapidapi.com/v1/translate",
//     params: { text: messageText, to: languageTo, from: languageFrom },
//     headers: {
//       "X-RapidAPI-Key": "f519fc13bbmshd84a80354a2b4e2p122a16jsn8981d4fbfcfd",
//       "X-RapidAPI-Host": "nlp-translation.p.rapidapi.com",
//     },
//   };

//   const response = await axios.request(options).catch(function (error) {
//     console.error(error);
//   });
//   if (response.status !== 200) {
//     console.log(response);
//     throw new Error("Error translating text");
//   }
//   return response.data;
// };

export const translateTextMessage = async (
  messageText,
  languageFrom,
  languageTo
) => {
  const options = {
    method: "GET",
    url: "https://nlp-translation.p.rapidapi.com/v1/translate",
    params: { text: messageText, to: languageTo, from: languageFrom },
    headers: {
      "X-RapidAPI-Key": "f519fc13bbmshd84a80354a2b4e2p122a16jsn8981d4fbfcfd",
      "X-RapidAPI-Host": "nlp-translation.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);

    if (response.status !== 200) {
      console.log(response);
      throw new Error("Error translating text");
    }

    const translatedText = response.data.translated_text;

    // Check if translatedText is not empty or undefined before transliteration
    if (translatedText) {
      // Access the first key in the object and use its value for transliteration
      const firstKey = Object.keys(translatedText)[0];
      const romanizedText = tr(translatedText[firstKey]);
      console.log("romanizedText: ", romanizedText);
      return romanizedText;
    } else {
      throw new Error("Translated text is empty or undefined");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error translating text");
  }
};

export const translateTextNonRoman = async (
  enteredText,
  languageFrom,
  languageTo
) => {
  const options = {
    method: "GET",
    url: "https://nlp-translation.p.rapidapi.com/v1/translate",
    params: { text: enteredText, to: languageTo, from: languageFrom },
    headers: {
      "X-RapidAPI-Key": "f519fc13bbmshd84a80354a2b4e2p122a16jsn8981d4fbfcfd",
      "X-RapidAPI-Host": "nlp-translation.p.rapidapi.com",
    },
  };

  const response = await axios.request(options).catch(function (error) {
    console.error(error);
  });
  if (response.status !== 200) {
    console.log(response);
    throw new Error("Error translating text");
  }
  return response.data;
};

export const translateTextMessageNonRoman = async (
  messageText,
  languageFrom,
  languageTo
) => {
  const options = {
    method: "GET",
    url: "https://nlp-translation.p.rapidapi.com/v1/translate",
    params: { text: messageText, to: languageTo, from: languageFrom },
    headers: {
      "X-RapidAPI-Key": "f519fc13bbmshd84a80354a2b4e2p122a16jsn8981d4fbfcfd",
      "X-RapidAPI-Host": "nlp-translation.p.rapidapi.com",
    },
  };

  const response = await axios.request(options).catch(function (error) {
    console.error(error);
  });
  if (response.status !== 200) {
    console.log(response);
    throw new Error("Error translating text");
  }
  return response.data;
};
