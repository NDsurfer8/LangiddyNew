import {
  child,
  get,
  getDatabase,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { setHistoryItem } from "../../store/historySlice";
import { getFirebase } from "../firebaseHelper";

export const createPhraseCard = async (loggedInUserId, cardData) => {
  const newCardData = {
    ...cardData,
    createdBy: loggedInUserId,
    updatedBy: loggedInUserId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const app = getFirebase();
  const dbRef = ref(getDatabase(app));
  const newCard = await push(child(dbRef, `phrases`), newCardData);
  const newCardKey = newCard.key;
  const cardUsers = newCardData.users;
  for (let i = 0; i < cardUsers.length; i++) {
    const userId = cardUsers[i];

    await update(child(dbRef, `userPhrases/${userId}/${newCardKey}`), {
      ...newCardData,
      key: newCardKey,
    });
  }

  return newCard.key;
};

export const getPhraseCardsFromUserByLanguage = async (
  loggedInUserId,
  languageFrom,
  languageTo
) => {
  const app = getFirebase();
  const dbRef = ref(getDatabase(app));
  const userPhraseCards = await get(
    child(dbRef, `userPhrases/${loggedInUserId}`)
  );

  if (userPhraseCards.exists()) {
    const phraseCards = Object.values(userPhraseCards.val());
    const filteredPhraseCards = phraseCards.filter(
      (card) => card.to === languageTo
    );

    return filteredPhraseCards;
  }

  return [];
};

export const getPhraseCardsFromUser = async (loggedInUserId) => {
  const app = getFirebase();
  const dbRef = ref(getDatabase(app));
  const userPhraseCards = await get(
    child(dbRef, `userPhrases/${loggedInUserId}`)
  );

  if (userPhraseCards.exists()) {
    const phraseCards = Object.values(userPhraseCards.val());

    return phraseCards;
  }

  return [];
};

// get all phrases from the user that match the language they are learning.
export const getPhraseCardsLanguage = async (loggedInUserId, language) => {
  const app = getFirebase();
  const dbRef = ref(getDatabase(app));
  const userPhraseCards = await get(
    child(dbRef, `userPhrases/${loggedInUserId}`)
  );

  if (userPhraseCards.exists()) {
    const phraseCards = Object.values(userPhraseCards.val());
    const filteredPhraseCards = phraseCards.filter(
      (card) => card.to === language
    );

    return filteredPhraseCards;
  }

  return [];
};

export const getPhraseCardsLanguageTwo = async (
  loggedInUserId,
  languageTwo
) => {
  const app = getFirebase();
  const dbRef = ref(getDatabase(app));
  const userPhraseCards = await get(
    child(dbRef, `userPhrases/${loggedInUserId}`)
  );

  if (userPhraseCards.exists()) {
    const phraseCards = Object.values(userPhraseCards.val());
    const filteredPhraseCards = phraseCards.filter(
      (card) => card.to === languageTwo
    );

    return filteredPhraseCards;
  }

  return [];
};

// deletes  from the user
export const deletePhraseCard = async (loggedInUserId, item) => {
  const app = getFirebase();
  const dbRef = ref(getDatabase(app));
  const userPhraseCards = await get(
    child(dbRef, `userPhrases/${loggedInUserId}`)
  );
  console.log("userPhraseCards", userPhraseCards);
  if (userPhraseCards.exists()) {
    const phraseCards = Object.values(userPhraseCards.val());
    const filteredPhraseCards = phraseCards.filter(
      (card) => card.key === item.key
    );
    console.log("filteredPhraseCards", filteredPhraseCards);

    const deleted = await remove(
      child(dbRef, `userPhrases/${loggedInUserId}/${item.key}`)
    );
    console.log("deletedTrue", deleted);
    return deleted;
  }
};

// star a phrase card because it has been used multiple times

export const starPhraseCard = async (loggedInUserId, item) => {
  const app = getFirebase();
  const dbRef = ref(getDatabase(app));
  const userPhraseCards = await get(
    child(dbRef, `userPhrases/${loggedInUserId}`)
  );
  console.log("userPhraseCards", userPhraseCards);
  if (userPhraseCards.exists()) {
    const phraseCards = Object.values(userPhraseCards.val());
    const filteredPhraseCards = phraseCards.filter(
      (card) => card.key === item.key
    );
    console.log("filteredPhraseCards", filteredPhraseCards);

    const starred = await update(
      child(dbRef, `userPhrases/${loggedInUserId}/${item.key}`),
      {
        starred: true,
      }
    );
    console.log("starredTrue", starred);
    return starred;
  }
};

// master a phrase card because it has been used multiple times

export const masterPhraseCard = async (loggedInUserId, item) => {
  const app = getFirebase();
  const dbRef = ref(getDatabase(app));
  const userPhraseCards = await get(
    child(dbRef, `userPhrases/${loggedInUserId}`)
  );
  console.log("userPhraseCards", userPhraseCards);
  if (userPhraseCards.exists()) {
    const phraseCards = Object.values(userPhraseCards.val());
    const filteredPhraseCards = phraseCards.filter(
      (card) => card.key === item.key
    );
    console.log("filteredPhraseCards", filteredPhraseCards);

    const mastered = await update(
      child(dbRef, `userPhrases/${loggedInUserId}/${item.key}`),
      {
        mastered: true,
      }
    );
    console.log("masteredTrue", mastered);
    return mastered;
  }
};

// get all mastered phrases from the user that match the language they are learning.

export const getMasteredPhraseCardsLanguage = async (
  loggedInUserId,
  language
) => {
  const app = getFirebase();
  const dbRef = ref(getDatabase(app));
  const userPhraseCards = await get(
    child(dbRef, `userPhrases/${loggedInUserId}`)
  );

  if (userPhraseCards.exists()) {
    const phraseCards = Object.values(userPhraseCards.val());
    const filteredPhraseCards = phraseCards.filter(
      (card) => card.to === language && card.mastered === true
    );

    return filteredPhraseCards;
  }

  return [];
};

export const getMasteredPhraseCardsLanguageTwo = async (
  loggedInUserId,
  languageTwo
) => {
  const app = getFirebase();
  const dbRef = ref(getDatabase(app));
  const userPhraseCards = await get(
    child(dbRef, `userPhrases/${loggedInUserId}`)
  );

  if (userPhraseCards.exists()) {
    const phraseCards = Object.values(userPhraseCards.val());
    const filteredPhraseCards = phraseCards.filter(
      (card) => card.to === languageTwo && card.mastered === true
    );

    return filteredPhraseCards;
  }

  return [];
};
