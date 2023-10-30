import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Platform,
  Image,
  Button,
  Linking,
} from "react-native";
import React, { useCallback, useReducer, useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import colors from "../../constants/colors";
import Input from "../../components/Input";
import {
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { reducer } from "../../utils/reducers/formReducer";
import { validateInput } from "../../utils/actions/formActions";
import { useSelector } from "react-redux";
import {
  updateSignedInUserData,
  userLogout,
} from "../../utils/actions/authActions";
import { useDispatch } from "react-redux";
import { updateLoggedInUserData } from "../../store/authSlice";
import ProfileImage from "../../components/ProfileImage";
import { ScrollView } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";
import InputAbout from "../../components/InputAbout";
import ProfileImageNonCached from "../../components/ProfileImageNonCached";
import Purchases from "react-native-purchases";
import SubmitButtonLogin from "../../components/SubmitButtonLogin";
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import { searchUsersLanguage } from "../../utils/actions/userActions";
import { setStoredUsers } from "../../store/userSlice";
import MainProfilePic from "../../components/MainProfilePic";
import ImageSettingsHelper from "../../components/ImageSettingsHelper";

const SettingsScreen = (props) => {
  // getting all the translations from localizations.js

  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const params = props.route.params || {};

  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);

  //TODO: new 4 things
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const selectedUser = props.route?.params?.selectedUserId;
  const selectedUserList = props.route?.params?.selectedUsers;
  const chatName = props.route?.params?.chatName;
  const userChats = useSelector((state) => {
    const chatsData = state.chats.chatsData;

    return Object.values(chatsData).sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  });

  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [value, setValue] = React.useState(userData.languageFrom || "en");
  const [value2, setValue2] = React.useState(userData.language || "es");
  const [value3, setValue3] = React.useState(userData.languageTwo || "es");
  const [editName, setEditName] = React.useState(true);
  // ! start of localization
  const [locale, setLocale] = React.useState(Localization.locale);
  const i18n = new I18n({
    enableFallback: true,
    "en-US": {
      appName: "Langiddy",
      welcome: "Welcome to Langiddy",
      "Connect with native speakers in": "Connect with native speakers in",
      "Please, upload a photo": "Please, upload a photo",
      "Select the language you want to learn":
        "Select the language you want to learn",
      "Select your native language": "Select your native language",
      "Select languages below, tap Done to confirm":
        "Select languages below, tap Done to confirm",
      "Invite a friend": "Invite a friend",
      Online: "Online!",
      Hidden: "Hidden",
      "Info saved, Happy chatting!": "Info saved. Happy chatting!",
      Help: "Help",
      Home: "Home",
      "Invite friends": "Invite friends",
      "My native language is": "My native language is",

      "I'm learning": "I'm learning",
      "Find native speakers in": "Find native speakers in",
      "Update Langs status": "Update Langs status",
      "About me": "About me",
      "Share your language goals and more with other people!":
        "Share your language goals and more with other people!",
      "Restore purchases": "Restore purchases",
      "Next trip (optional)": "Next trip (optional)",
      "Restore purchases": "Restore purchases",
      "Account settings": "Account settings",
      "Hide profile or make it visible to other users":
        "Hide profile or make it visible to other users",
      "Tap to edit your name": "Tap to edit your name",
      "First name": "First name",
      "Last name": "Last name",
      "Fluent language is the language you are most comfortable speaking or born speaking":
        "Fluent language is the language you are most comfortable speaking or born speaking",
      Done: "Done",
      "Select the language you are fluent in (required)":
        "Select the language you are fluent in (required)",
      "Select the language you want to learn (required)":
        "Select the language you want to learn (required)",
      "Select an additional language you want to learn (optional)":
        "Select an additional language you want to learn (optional)",
      Africkaans: "Africkaans",
      Albanian: "Albanian",
      Amharic: "Amharic",
      Arabic: "Arabic",
      Armenian: "Armenian",
      Azerbaijani: "Azerbaijani",
      Bashkir: "Bashkir",
      Basque: "Basque",
      Belarusian: "Belarusian",
      Bengali: "Bengali",
      Bosnian: "Bosnian",
      Bulgarian: "Bulgarian",
      Catalan: "Catalan",
      Cebuano: "Cebuano",
      Chichewa: "Chichewa",
      "Chinese Simplified": "Chinese Simplified",
      "Chinese Traditional": "Chinese Traditional",
      Corsican: "Corsican",
      Croatian: "Croatian",
      Czech: "Czech",
      Danish: "Danish",
      Dutch: "Dutch",
      English: "English",
      Esperanto: "Esperanto",
      Estonian: "Estonian",
      Finnish: "Finnish",
      French: "French",
      Frisian: "Frisian",
      Galician: "Galician",
      Georgian: "Georgian",
      German: "German",
      Greek: "Greek",
      Gujarati: "Gujarati",
      "Haitian Creole": "Haitian Creole",
      Haitian: "Haitian",
      Hausa: "Hausa",
      Hawaiian: "Hawaiian",
      Hebrew: "Hebrew",
      Hindi: "Hindi",
      Hmong: "Hmong",
      Hungarian: "Hungarian",
      Icelandic: "Icelandic",
      Igbo: "Igbo",
      Indonesian: "Indonesian",
      Irish: "Irish",
      Italian: "Italian",
      Japanese: "Japanese",
      Javanese: "Javanese",
      Kannada: "Kannada",
      Kazakh: "Kazakh",
      Khmer: "Khmer",
      Kinyarwanda: "Kinyarwanda",
      Korean: "Korean",
      Kurdish: "Kurdish",
      Kyrgyz: "Kyrgyz",
      Lao: "Lao",
      Latin: "Latin",
      Latvian: "Latvian",
      Lithuanian: "Lithuanian",
      Luxembourgish: "Luxembourgish",
      Macedonian: "Macedonian",
      Malagasy: "Malagasy",
      Malay: "Malay",
      Malayalam: "Malayalam",
      Maltese: "Maltese",
      Maori: "Maori",
      Marathi: "Marathi",
      Mongolian: "Mongolian",
      Myanmar: "Myanmar",
      Nepali: "Nepali",
      Norwegian: "Norwegian",
      Nyanja: "Nyanja",
      Pashto: "Pashto",
      Persian: "Persian",
      Polish: "Polish",
      Portuguese: "Portuguese",
      Punjabi: "Punjabi",
      Romanian: "Romanian",
      Russian: "Russian",
      Samoan: "Samoan",
      "Scots Gaelic": "Scots Gaelic",
      Serbian: "Serbian",
      Sesotho: "Sesotho",
      Shona: "Shona",
      Sindhi: "Sindhi",
      Sinhala: "Sinhala",
      Slovak: "Slovak",
      Slovenian: "Slovenian",
      Somali: "Somali",
      Spanish: "Spanish",
      Sundanese: "Sundanese",
      Swahili: "Swahili",
      Swedish: "Swedish",
      Tagalog: "Tagalog",
      Tajik: "Tajik",
      Tamil: "Tamil",
      Telugu: "Telugu",
      Thai: "Thai",
      Turkish: "Turkish",
      Ukrainian: "Ukrainian",
      Urdu: "Urdu",
      Uzbek: "Uzbek",
      Vietnamese: "Vietnamese",
      Welsh: "Welsh",
      Xhosa: "Xhosa",
      Yiddish: "Yiddish",
      Yoruba: "Yoruba",
      Zulu: "Zulu",
      "Invite people to chat with you": "Invite people to chat with you",
      "introduce yourself and explain your goals with the language you are learning":
        "introduce yourself and explain your goals with the language you are learning",
      "Occupation (optional)": "Occupation (optional)",
      "My interests (optional)": "My interests (optional)",
      "What do you do for a living?": "What do you do for a living?",
      "Account settings": "Account settings",
    },
    "en-MX": {
      appName: "Langiddy",

      welcome: "Bienvenido a Langiddy",
      "Select the language you want to learn":
        "Seleccione el idioma que desea aprender",
      "Connect with native speakers in": "Conéctese con hablantes nativos en",
      "Select your native language": "Ingrese su idioma nativo",
      "Select languages below, tap Done to confirm":
        "Seleccione los idiomas a continuación, toque Hecho para confirmar",
      "My interests (optional)": "Mis intereses (opcional)",
      Online: "Emocionado!",
      Hidden: "Oculto",
      "Invite a friend": "Invitar a un amigo",
      "Info saved, Happy chatting!": "Información guardada. ¡Feliz charla!",
      Help: "Tutoriales",
      Home: "Casa",
      "Please, upload a photo": "Por favor, sube una foto",
      "Invite friends": "Invitar amigos",
      "My native language is": "Mi idioma nativo es",
      "I'm learning": "Estoy aprendiendo",
      "Find native speakers in": "Encuentra hablantes nativos en",
      "Update Langs status": "Actualizar estado de Langs",
      "Restore purchases": "Restaurar compras",
      "Account settings": "Configuraciones de la cuenta",
      "Hide profile or make it visible to other users":
        "Ocultar perfil o hacerlo visible para otros usuarios",
      "Tap to edit your name": "Toque para editar su nombre",
      "First name": "Editar primer nombre",
      "Last name": "Editar apellido",
      "Fluent language is the language you are most comfortable speaking or born speaking":
        "El idioma fluido es el idioma que más cómodo habla o nace hablando",
      Done: "Hecho",
      "Select the language you are fluent in (required)":
        "Seleccione el idioma en el que es fluido (requerido)",
      "Select the language you want to learn (required)":
        "Seleccione el idioma que desea aprender (requerido)",
      "Select an additional language you want to learn (optional)":
        "Seleccione un idioma adicional que desee aprender (opcional)",
      Africkaans: "Africkaans",
      Albanian: "Albanés",
      Amharic: "Amárico",
      Arabic: "Arábica",
      Armenian: "Armenio",
      Azerbaijani: "Azerbaiyano",
      Bashkir: "Bashkir",
      Basque: "Vasco",
      Belarusian: "Bielorruso",
      Bengali: "Bengalí",
      Bosnian: "Bosnio",
      Bulgarian: "Búlgaro",
      Burmese: "Birmano",
      Catalan: "Catalán",
      Cebuano: "Cebuano",
      Chichewa: "Chichewa",
      "Chinese Simplified": "Chino simplificado",
      "Chinese Traditional": "Chino tradicional",
      Corsican: "Corso",
      Croatian: "Croata",
      Czech: "Checo",
      Danish: "Danés",
      Dutch: "Holandés",
      English: "Inglés",
      Esperanto: "Esperanto",
      Estonian: "Estonio",
      Finnish: "Finlandés",
      French: "Francés",
      Frisian: "Frisón",
      Galician: "Gallego",
      Georgian: "Georgiano",
      German: "Alemán",
      Greek: "Griego",
      Gujarati: "Guyaratí",
      "Haitian Creole": "Criollo haitiano",
      Hausa: "Hausa",
      Hawaiian: "Hawaiano",
      Hebrew: "Hebreo",
      Hindi: "Hindi",
      Hmong: "Hmong",
      Hungarian: "Húngaro",
      Icelandic: "Islandés",
      Igbo: "Igbo",
      Indonesian: "Indonesio",
      Irish: "Irlandés",
      Italian: "Italiano",
      Japanese: "Japonés",
      Javanese: "Javanés",
      Kannada: "Canarés",
      Kazakh: "Kazajo",
      Khmer: "Jemer",
      Korean: "Coreano",
      Kurdish: "Kurdo",
      Kyrgyz: "Kirguís",
      Lao: "Lao",
      Latin: "Latín",
      Latvian: "Letón",
      Lithuanian: "Lituano",
      Luxembourgish: "Luxemburgués",
      Macedonian: "Macedonio",
      Malagasy: "Malgache",
      Malay: "Malayo",
      Malayalam: "Malayalam",
      Maltese: "Maltés",
      Maori: "Maorí",
      Marathi: "Marathi",
      Mongolian: "Mongol",
      Myanmar: "Myanmar",
      Nepali: "Nepalí",
      Norwegian: "Noruego",
      Pashto: "Pastún",
      Persian: "Persa",
      Polish: "Polaco",
      Portuguese: "Portugués",
      Punjabi: "Panyabí",
      Romanian: "Rumano",
      Russian: "Ruso",
      Samoan: "Samoano",
      "Scots Gaelic": "Gaélico escocés",
      Serbian: "Serbio",
      Sesotho: "Sesotho",
      Shona: "Shona",
      Sindhi: "Sindhi",
      Sinhala: "Cingalés",
      Slovak: "Eslovaco",
      Slovenian: "Esloveno",
      Somali: "Somalí",
      Spanish: "Español",
      Sundanese: "Sundanés",
      Swahili: "Swahili",
      Swedish: "Sueco",
      Tagalog: "Tagalo",
      Tajik: "Tayiko",
      Tamil: "Tamil",
      Tatar: "Tártaro",
      Telugu: "Telugu",
      Thai: "Tailandés",
      Turkish: "Turco",
      Turkmen: "Turcomano",
      Ukrainian: "Ucranio",
      Urdu: "Urdu",
      Uyghur: "Uigur",
      Uzbek: "Uzbeko",
      Vietnamese: "Vietnamita",
      Welsh: "Galés",
      Xhosa: "Xhosa",
      Yiddish: "Yiddish",
      Yoruba: "Yoruba",
      Zulu: "Zulú",
      "Invite people to chat with you": "Invita a la gente a chatear contigo",
      "introduce yourself and explain your goals with the language you are learning":
        "Haz que sea un tema de conversación fácil :)",
      "About me": "Sobre mí",
      "Account settings": "Configuración de la cuenta",
      "Share your language goals and more with other people!":
        "¡Comparte tus objetivos de idioma y más con otras personas!",
      "Occupation (optional)": "Ocupación (opcional)",
      "What do you do for a living?": "¿A qué te dedicas?",
    },
    "es-MX": {
      appName: "Langiddy",
      welcome: "Bienvenido a Langiddy",
      "Select the language you want to learn":
        "Seleccione el idioma que desea aprender",
      "Select your native language": "Ingrese su idioma nativo",
      "Select languages below, tap Done to confirm":
        "Seleccione los idiomas a continuación, toque Listo para confirmar",
      Online: "Emocionado!",
      "Please, upload a photo": "Por favor, sube una foto",
      "My interests (optional)": "Mis intereses (opcional)",
      Hidden: "Oculto",
      "Info saved, Happy chatting!": "Información guardada. ¡Feliz charla!",
      Help: "Tutoriales",
      Home: "Casa",
      "Connect with native speakers in": "Conéctate con hablantes nativos en",
      "Invite a friend": "Invitar a un amigo",
      "Invite friends": "Invitar amigos",
      "My native language is": "Mi idioma nativo es",
      "I'm learning": "Estoy aprendiendo",
      "Find native speakers in": "Encuentra hablantes nativos en",
      "Update Langs status": "Actualizar estado de Langs",
      "Restore purchases": "Restaurar compras",
      "Account settings": "Configuraciones de la cuenta",
      "Hide profile or make it visible to other users":
        "Ocultar perfil o hacerlo visible para otros usuarios",
      "Tap to edit your name": "Toque para editar su nombre",
      "First name": "Editar primer nombre",
      "Last name": "Editar apellido",
      "Fluent language is the language you are most comfortable speaking or born speaking":
        "El idioma fluido es el idioma que más cómodo habla o nace hablando",
      Done: "Hecho",
      "Select the language you are fluent in (required)":
        "Seleccione el idioma en el que es fluido (requerido)",
      "My interests (optional)": "Mis intereses (opcional)",
      "Select the language you want to learn (required)":
        "Seleccione el idioma que desea aprender (requerido)",
      "Select an additional language you want to learn (optional)":
        "Seleccione un idioma adicional que desee aprender (opcional)",
      Africkaans: "Africkaans",
      Albanian: "Albanés",
      Amharic: "Amárico",
      Arabic: "Arábica",
      Armenian: "Armenio",
      Azerbaijani: "Azerbaiyano",
      Bashkir: "Bashkir",
      Basque: "Vasco",
      Belarusian: "Bielorruso",
      Bengali: "Bengalí",
      Bosnian: "Bosnio",
      Bulgarian: "Búlgaro",
      Burmese: "Birmano",
      Catalan: "Catalán",
      Cebuano: "Cebuano",
      Chichewa: "Chichewa",
      "Chinese Simplified": "Chino simplificado",
      "Chinese Traditional": "Chino tradicional",
      Corsican: "Corso",
      Croatian: "Croata",
      Czech: "Checo",
      Danish: "Danés",
      Dutch: "Holandés",
      English: "Inglés",
      Esperanto: "Esperanto",
      Estonian: "Estonio",
      Finnish: "Finlandés",
      French: "Francés",
      Frisian: "Frisón",
      Galician: "Gallego",
      Georgian: "Georgiano",
      German: "Alemán",
      Greek: "Griego",
      Gujarati: "Guyaratí",
      "Haitian Creole": "Criollo haitiano",
      Hausa: "Hausa",
      Hawaiian: "Hawaiano",
      Hebrew: "Hebreo",
      Hindi: "Hindi",
      Hmong: "Hmong",
      Hungarian: "Húngaro",
      Icelandic: "Islandés",
      Igbo: "Igbo",
      Indonesian: "Indonesio",
      Irish: "Irlandés",
      Italian: "Italiano",
      Japanese: "Japonés",
      Javanese: "Javanés",
      Kannada: "Canarés",
      Kazakh: "Kazajo",
      Khmer: "Jemer",
      Korean: "Coreano",
      Kurdish: "Kurdo",
      Kyrgyz: "Kirguís",
      Lao: "Lao",
      Latin: "Latín",
      Latvian: "Letón",
      Lithuanian: "Lituano",
      Luxembourgish: "Luxemburgués",
      Macedonian: "Macedonio",
      Malagasy: "Malgache",
      Malay: "Malayo",
      Malayalam: "Malayalam",
      Maltese: "Maltés",
      Maori: "Maorí",
      Marathi: "Marathi",
      Mongolian: "Mongol",
      Myanmar: "Myanmar",
      Nepali: "Nepalí",
      Norwegian: "Noruego",
      Pashto: "Pastún",
      Persian: "Persa",
      Polish: "Polaco",
      Portuguese: "Portugués",
      Punjabi: "Panyabí",
      Romanian: "Rumano",
      Russian: "Ruso",
      Samoan: "Samoano",
      "Scots Gaelic": "Gaélico escocés",
      Serbian: "Serbio",
      Sesotho: "Sesotho",
      Shona: "Shona",
      Sindhi: "Sindhi",
      Sinhala: "Cingalés",
      Slovak: "Eslovaco",
      Slovenian: "Esloveno",
      Somali: "Somalí",
      Spanish: "Español",
      Sundanese: "Sundanés",
      Swahili: "Swahili",
      Swedish: "Sueco",
      Tagalog: "Tagalo",
      Tajik: "Tayiko",
      Tamil: "Tamil",
      Tatar: "Tártaro",
      Telugu: "Telugu",
      Thai: "Tailandés",
      Turkish: "Turco",
      Turkmen: "Turcomano",
      Ukrainian: "Ucranio",
      Urdu: "Urdu",
      Uyghur: "Uigur",
      Uzbek: "Uzbeko",
      Vietnamese: "Vietnamita",
      Welsh: "Galés",
      Xhosa: "Xhosa",
      Yiddish: "Yiddish",
      Yoruba: "Yoruba",
      Zulu: "Zulú",
      "Invite people to chat with you": "Invita a la gente a chatear contigo",
      "introduce yourself and explain your goals with the language you are learning":
        "Haz que sea un tema de conversación fácil :)",
      "About me": "Sobre mí",
      "Account settings": "Configuración de la cuenta",
      "Share your language goals and more with other people!":
        "¡Comparte tus objetivos de idioma y más con otras personas!",
      "Occupation (optional)": "Ocupación (opcional)",
      "What do you do for a living?": "¿A qué te dedicas?",
    },
    "en-JP": {
      appName: "Langiddy",
      welcome: "Langiddyへようこそ",
      "Connect with native speakers in": "ネイティブスピーカーとつながる",
      "Select the language you want to learn": "学びたい言語を選択してください",
      "Select your native language": "母国語を入力してください",
      "Select languages below, tap Done to confirm":
        "以下の言語を選択して、完了をタップして確認してください",
      Online: "ワクワク！",
      "Please, upload a photo": "写真をアップロードしてください",
      "My interests (optional)": "私の興味（オプション）",
      Hidden: "隠し",
      "Info saved, Happy chatting!":
        "情報が保存されました。 チャットを楽しんで！",
      Help: "チュートリアル",
      Home: "ホーム",
      "Invite a friend": "友達を招待する",
      "Invite friends": "友達を招待する",
      "My native language is": "私の母国語は",
      "I'm learning": "私は学んでいます",
      "Find native speakers in": "ネイティブスピーカーを見つける",
      "Update Langs status": "Langsのステータスを更新する",
      "Account settings": "アカウント設定",
      "Restore purchases": "購入を復元する",
      "Account settings": "アカウント設定",
      "Hide profile or make it visible to other users":
        "プロフィールを非表示にするか、他のユーザーに表示する",
      "Tap to edit your name": "名前を編集するにはタップしてください",
      "First name": "名を編集する",
      "Last name": "姓を編集する",
      "Fluent language is the language you are most comfortable speaking or born speaking":
        "流暢な言語は、最も快適に話すか、生まれながらにして話す言語です",
      Done: "完了",
      "Select the language you are fluent in (required)":
        "流暢な言語を選択してください。 （必須）",
      "Select the language you want to learn (required)":
        "学びたい言語を選択してください。 （必須）",
      "Select an additional language you want to learn (optional)":
        "学びたい追加の言語を選択してください。 （任意）",
      Africkaans: "アフリカーンス語",
      Albanian: "アルバニア語",
      Amharic: "アムハラ語",
      Arabic: "アラビア語",
      Armenian: "アルメニア語",
      Azerbaijani: "アゼルバイジャン語",
      Bashkir: "バシキール語",
      Basque: "バスク語",
      Belarusian: "ベラルーシ語",
      Bengali: "ベンガル語",
      Bosnian: "ボスニア語",
      Bulgarian: "ブルガリア語",
      Burmese: "ビルマ語",
      Catalan: "カタルーニャ語",
      Cebuano: "セブアノ語",
      Chichewa: "チェワ語",
      "Chinese Simplified": "中国語簡体字",
      "Chinese Traditional": "中国語繁体字",
      Corsican: "コルシカ語",
      Croatian: "クロアチア語",
      Czech: "チェコ語",
      Danish: "デンマーク語",
      Dutch: "オランダ語",
      English: "英語",
      Esperanto: "エスペラント語",
      Estonian: "エストニア語",
      Finnish: "フィンランド語",
      French: "フランス語",
      Frisian: "フリジア語",
      Galician: "ガリシア語",
      Georgian: "ジョージア語",
      German: "ドイツ語",
      Greek: "ギリシャ語",
      Gujarati: "グジャラート語",
      "Haitian Creole": "ハイチ語",
      Hausa: "ハウサ語",
      Hawaiian: "ハワイ語",
      Hebrew: "ヘブライ語",
      Hindi: "ヒンディー語",
      Hmong: "モン族",
      Hungarian: "ハンガリー語",
      Icelandic: "アイスランド語",
      Igbo: "イボ語",
      Indonesian: "インドネシア語",
      Irish: "アイルランド語",
      Italian: "イタリア語",
      Japanese: "日本語",
      Javanese: "ジャワ語",
      Kannada: "カンナダ語",
      Kazakh: "カザフ語",
      Khmer: "クメール語",
      Kinyarwanda: "ルワンダ語",
      Korean: "韓国語",
      Kurdish: "クルド語",
      Kyrgyz: "キルギス語",
      Lao: "ラオス語",
      Latin: "ラテン語",
      Latvian: "ラトビア語",
      Lithuanian: "リトアニア語",
      Luxembourgish: "ルクセンブルク語",
      Macedonian: "マケドニア語",
      Malagasy: "マダガスカル語",
      Malay: "マレー語",
      Malayalam: "マラヤーラム語",
      Maltese: "マルタ語",
      Maori: "マオリ語",
      Marathi: "マラーティー語",
      Mongolian: "モンゴル語",
      Myanmar: "ミャンマー",
      Nepali: "ネパール語",
      Norwegian: "ノルウェー語",
      Pashto: "パシュトゥー語",
      Persian: "ペルシャ語",
      Polish: "ポーランド語",
      Portuguese: "ポルトガル語",
      Punjabi: "パンジャブ語",
      Romanian: "ルーマニア語",
      Russian: "ロシア語",
      Samoan: "サモア語",
      "Scots Gaelic": "スコットランドゲール語",
      Serbian: "セルビア語",
      Sesotho: "セソト語",
      Shona: "ショナ語",
      Sindhi: "シンド語",
      Sinhala: "シンハラ語",
      Slovak: "スロバキア語",
      Slovenian: "スロベニア語",
      Somali: "ソマリ語",
      Spanish: "スペイン語",
      Sundanese: "スンダ語",
      Swahili: "スワヒリ語",
      Swedish: "スウェーデン語",
      Tagalog: "タガログ語",
      Tajik: "タジク語",
      Tamil: "タミル語",
      Telugu: "テルグ語",
      Thai: "タイ語",
      Turkish: "トルコ語",
      Ukrainian: "ウクライナ語",
      Urdu: "ウルドゥー語",
      Uzbek: "ウズベク語",
      Vietnamese: "ベトナム語",
      Welsh: "ウェールズ語",
      Xhosa: "コサ語",
      Yiddish: "イディッシュ語",
      Yoruba: "ヨルバ語",
      Zulu: "ズールー語",
      "Invite people to chat with you": "あなたとチャットする人を招待する",
      "introduce yourself and explain your goals with the language you are learning":
        "それを簡単な会話のスターターにしてください :)",
      "About me": "私について",
      "Share your language goals and more with other people!":
        "他の人とあなたの言語の目標やその他のことを共有してください！",
      "Occupation (optional)": "職業（任意）",
      "What do you do for a living?": "あなたはどんな仕事をしていますか？",
    },
    "ja-JP": {
      appName: "Langiddy",
      welcome: "Langiddyへようこそ",
      "Please, upload a photo": "写真をアップロードしてください",
      "Select the language you want to learn": "学びたい言語を選択してください",
      "Select your native language": "母国語を入力してください",
      "Select languages below, tap Done to confirm":
        "下の言語を選択して、完了をタップして確認してください",
      "My interests (optional)": "私の興味（任意）",
      Online: "ワクワク！",
      Hidden: "隠し",
      "Connect with native speakers in": "ネイティブスピーカーとつながる",
      "Invite a friend": "友達を招待する",
      "Info saved, Happy chatting!":
        "情報が保存されました。 チャットを楽しんで！",
      Help: "チュートリアル",
      Home: "ホーム",
      "Invite friends": "友達を招待する",
      "My native language is": "私の母国語は",
      "I'm learning": "私は学んでいます",
      "Find native speakers in": "ネイティブスピーカーを見つける",
      "Update Langs status": "Langsのステータスを更新する",
      "Account settings": "アカウント設定",
      "Restore purchases": "購入を復元する",
      "Account settings": "アカウント設定",
      "Hide profile or make it visible to other users":
        "プロフィールを非表示にするか、他のユーザーに表示する",
      "Tap to edit your name": "名前を編集するにはタップしてください",
      "First name": "名を編集する",
      "Last name": "姓を編集する",
      "Fluent language is the language you are most comfortable speaking or born speaking":
        "流暢な言語は、最も快適に話すか、生まれながらにして話す言語です",
      Done: "完了",
      "Select the language you are fluent in (required)":
        "流暢な言語を選択してください。 （必須）",
      "Select the language you want to learn (required)":
        "学びたい言語を選択してください。 （必須）",
      "Select an additional language you want to learn (optional)":
        "学びたい追加の言語を選択してください。 （任意）",
      Africkaans: "アフリカーンス語",
      Albanian: "アルバニア語",
      Amharic: "アムハラ語",
      Arabic: "アラビア語",
      Armenian: "アルメニア語",
      Azerbaijani: "アゼルバイジャン語",
      Bashkir: "バシキール語",
      Basque: "バスク語",
      Belarusian: "ベラルーシ語",
      Bengali: "ベンガル語",
      Bosnian: "ボスニア語",
      Bulgarian: "ブルガリア語",
      Burmese: "ビルマ語",
      Catalan: "カタルーニャ語",
      Cebuano: "セブアノ語",
      Chichewa: "チェワ語",
      "Chinese Simplified": "中国語簡体字",
      "Chinese Traditional": "中国語繁体字",
      Corsican: "コルシカ語",
      Croatian: "クロアチア語",
      Czech: "チェコ語",
      Danish: "デンマーク語",
      Dutch: "オランダ語",
      English: "英語",
      Esperanto: "エスペラント語",
      Estonian: "エストニア語",
      Finnish: "フィンランド語",
      French: "フランス語",
      Frisian: "フリジア語",
      Galician: "ガリシア語",
      Georgian: "ジョージア語",
      German: "ドイツ語",
      Greek: "ギリシャ語",
      Gujarati: "グジャラート語",
      "Haitian Creole": "ハイチ語",
      Hausa: "ハウサ語",
      Hawaiian: "ハワイ語",
      Hebrew: "ヘブライ語",
      Hindi: "ヒンディー語",
      Hmong: "モン族",
      Hungarian: "ハンガリー語",
      Icelandic: "アイスランド語",
      Igbo: "イボ語",
      Indonesian: "インドネシア語",
      Irish: "アイルランド語",
      Italian: "イタリア語",
      Japanese: "日本語",
      Javanese: "ジャワ語",
      Kannada: "カンナダ語",
      Kazakh: "カザフ語",
      Khmer: "クメール語",
      Kinyarwanda: "ルワンダ語",
      Korean: "韓国語",
      Kurdish: "クルド語",
      Kyrgyz: "キルギス語",
      Lao: "ラオス語",
      Latin: "ラテン語",
      Latvian: "ラトビア語",
      Lithuanian: "リトアニア語",
      Luxembourgish: "ルクセンブルク語",
      Macedonian: "マケドニア語",
      Malagasy: "マダガスカル語",
      Malay: "マレー語",
      Malayalam: "マラヤーラム語",
      Maltese: "マルタ語",
      Maori: "マオリ語",
      Marathi: "マラーティー語",
      Mongolian: "モンゴル語",
      Myanmar: "ミャンマー",
      Nepali: "ネパール語",
      Norwegian: "ノルウェー語",
      Pashto: "パシュトゥー語",
      Persian: "ペルシャ語",
      Polish: "ポーランド語",
      Portuguese: "ポルトガル語",
      Punjabi: "パンジャブ語",
      Romanian: "ルーマニア語",
      Russian: "ロシア語",
      Samoan: "サモア語",
      "Scots Gaelic": "スコットランドゲール語",
      Serbian: "セルビア語",
      Sesotho: "セソト語",
      Shona: "ショナ語",
      Sindhi: "シンド語",
      Sinhala: "シンハラ語",
      Slovak: "スロバキア語",
      Slovenian: "スロベニア語",
      Somali: "ソマリ語",
      Spanish: "スペイン語",
      Sundanese: "スンダ語",
      Swahili: "スワヒリ語",
      Swedish: "スウェーデン語",
      Tagalog: "タガログ語",
      Tajik: "タジク語",
      Tamil: "タミル語",
      Telugu: "テルグ語",
      Thai: "タイ語",
      Turkish: "トルコ語",
      Ukrainian: "ウクライナ語",
      Urdu: "ウルドゥー語",
      Uzbek: "ウズベク語",
      Vietnamese: "ベトナム語",
      Welsh: "ウェールズ語",
      Xhosa: "コサ語",
      Yiddish: "イディッシュ語",
      Yoruba: "ヨルバ語",
      Zulu: "ズールー語",
      "Invite people to chat with you": "あなたとチャットする人を招待する",
      "introduce yourself and explain your goals with the language you are learning":
        "それを簡単な会話のスターターにしてください :)",
      "About me": "私について",
      "Share your language goals and more with other people!":
        "他の人とあなたの言語の目標やその他のことを共有してください！",
      "Occupation (optional)": "職業（任意）",
      "What do you do for a living?": "あなたはどんな仕事をしていますか？",
    },
    "en-CN": {
      "Invite a friend": "邀请朋友",

      "Invite people to chat with you": "与社区分享您的兴趣",
      "introduce yourself and explain your goals with the language you are learning":
        "让它成为一个简单的对话开始者 :)",
      "My interests (optional)": "我的兴趣（可选）",
      "About me": "关于我",
      "Please, upload a photo": "请上传照片",
      "Connect with native speakers in": "在找",
      "Share your language goals and more with other people!":
        "与其他人分享您的语言目标和更多内容！",
      "Occupation (optional)": "职业（可选）",
      "What do you do for a living?": "你是做什么的？",
      "Select your native language": "输入您的母语",
      appName: "Langiddy",
      Online: "Online",
      "Select the language you want to learn": "选择您想学习的语言",
      Hidden: "隐藏",
      Home: "首页",
      Help: "教程",
      "My native language is": "我的母语是",
      "I'm learning": "我在学习",
      "Find native speakers in": "在找",
      "Update Langs status": "更新语言状态",
      "Restore purchases": "恢复购买",
      "Account settings": "账户设置",
      "Hide profile or make it visible to other users":
        "隐藏个人资料或使其对其他用户可见",
      "Tap to edit your name": "点击编辑你的名字",
      "First name": "编辑名字",
      "Last name": "编辑姓氏",
      Done: "完成",
      "Select languages below, tap Done to confirm":
        "在下面选择语言，点击完成以确认",
      Africkaans: "南非荷兰语",
      Albanian: "阿尔巴尼亚语",
      Amharic: "阿姆哈拉语",
      Arabic: "阿拉伯语",
      Armenian: "亚美尼亚语",
      Azerbaijani: "阿塞拜疆语",
      Bashkir: "巴什基尔语",
      Basque: "巴斯克语",
      Belarusian: "白俄罗斯语",
      Bengali: "孟加拉语",
      Bosnian: "波斯尼亚语",
      Bulgarian: "保加利亚语",
      Burmese: "缅甸语",
      Catalan: "加泰罗尼亚语",
      Cebuano: "宿雾语",
      Chichewa: "奇切瓦语",
      "Chinese Simplified": "简体中文",
      "Chinese Traditional": "繁体中文",
      Corsican: "科西嘉语",
      Croatian: "克罗地亚语",
      Czech: "捷克语",
      Danish: "丹麦语",
      Dutch: "荷兰语",
      English: "英语",
      Esperanto: "世界语",
      Estonian: "爱沙尼亚语",
      Finnish: "芬兰语",
      French: "法语",
      Frisian: "弗里斯兰语",
      Galician: "加利西亚语",
      Georgian: "格鲁吉亚语",
      German: "德语",
      Greek: "希腊语",
      Gujarati: "古吉拉特语",
      "Haitian Creole": "海地语",
      Hausa: "豪萨语",
      Hawaiian: "夏威夷语",
      Hebrew: "希伯来语",
      Hindi: "印地语",
      Hmong: "苗语",
      Hungarian: "匈牙利语",
      Icelandic: "冰岛语",
      Igbo: "伊博语",
      Indonesian: "印度尼西亚语",
      Irish: "爱尔兰语",
      Italian: "意大利语",
      Japanese: "日语",
      Javanese: "爪哇语",
      Kannada: "卡纳达语",
      Kazakh: "哈萨克语",
      Khmer: "高棉语",
      Kinyarwanda: "基尼亚卢旺达语",
      Korean: "韩语",
      Kurdish: "库尔德语",
      Kyrgyz: "吉尔吉斯语",
      Lao: "老挝语",
      Latin: "拉丁语",
      Latvian: "拉脱维亚语",
      Lithuanian: "立陶宛语",
      Luxembourgish: "卢森堡语",
      Macedonian: "马其顿语",
      Malagasy: "马达加斯加语",
      Malay: "马来语",
      Malayalam: "马拉雅拉姆语",
      Maltese: "马耳他语",
      Maori: "毛利语",
      Marathi: "马拉地语",
      Mongolian: "蒙古语",
      Myanmar: "缅甸语",
      Nepali: "尼泊尔语",
      Norwegian: "挪威语",
      Pashto: "普什图语",
      Persian: "波斯语",
      Polish: "波兰语",
      Portuguese: "葡萄牙语",
      Punjabi: "旁遮普语",
      Romanian: "罗马尼亚语",
      Russian: "俄语",
      Samoan: "萨摩亚语",
      "Scots Gaelic": "苏格兰盖尔语",
      Serbian: "塞尔维亚语",
      Sesotho: "塞索托语",
      Shona: "绍纳语",
      Sindhi: "信德语",
      Sinhala: "僧伽罗语",
      Slovak: "斯洛伐克语",
      Slovenian: "斯洛文尼亚语",
      Somali: "索马里语",
      Spanish: "西班牙语",
      Sundanese: "巽他语",
      Swahili: "斯瓦希里语",
      Swedish: "瑞典语",
      Tagalog: "他加禄语",
      Tajik: "塔吉克语",
      Tamil: "泰米尔语",
      Tatar: "鞑靼语",
      Telugu: "泰卢固语",
      Thai: "泰语",
      Turkish: "土耳其语",
      Turkmen: "土库曼语",
      Ukrainian: "乌克兰语",
      Urdu: "乌尔都语",
      Uyghur: "维吾尔语",
      Uzbek: "乌兹别克语",
      Vietnamese: "越南语",
      Welsh: "威尔士语",
      Xhosa: "科萨语",
      Yiddish: "意第绪语",
      Yoruba: "约鲁巴语",
      Zulu: "祖鲁语",
      "Select the language you are fluent in (required)":
        "选择您精通的语言。（必填）",
      "Select the language you want to learn (required)":
        "选择您想学习的语言。（必填）",
      "Select an additional language you want to learn (optional)":
        "选择您想学习的其他语言。（可选）",
      "Info saved, Happy chatting!": "信息已保存，祝您聊天愉快！",
      "Fluent language is the language you are most comfortable speaking or born speaking":
        "精通语言是您最擅长说或出生说的语言",
    },
    "zh-CN": {
      "Invite a friend": "邀请朋友",
      "Invite people to chat with you": "邀请人们与您聊天",
      "introduce yourself and explain your goals with the language you are learning":
        "让它成为一个简单的对话开始者 :)",
      "About me": "关于我",
      "Please, upload a photo": "请上传照片",
      "My interests (optional)": "我的兴趣（可选）",
      "Connect with native speakers in": "在这里找到母语人士",
      "Select the language you want to learn": "选择您想学习的语言",
      "Share your language goals and more with other people!":
        " 与其他人分享您的语言目标等！",
      "Occupation (optional)": "职业（可选）",
      "What do you do for a living?": "你是做什么的？",
      appName: "Langiddy",
      Online: "Online",
      Hidden: "隐藏",
      Home: "首页",
      Help: "教程",
      "My native language is": "我的母语是",
      "I'm learning": "我在学习",
      "Select your native language": "输入您的母语",
      "Find native speakers in": "在这里找到母语人士",
      "Update Langs status": "更新语言状态",
      "Restore purchases": "恢复购买",
      "Account settings": "账户设置",
      "Hide profile or make it visible to other users":
        "隐藏个人资料或使其对其他用户可见",
      "Tap to edit your name": "点击编辑你的名字",
      "First name": "编辑名字",
      "Last name": "编辑姓氏",
      Done: "完成",
      "Select languages below, tap Done to confirm":
        "在下面选择语言，点击完成以确认",
      Africkaans: "南非荷兰语",
      Albanian: "阿尔巴尼亚语",
      Amharic: "阿姆哈拉语",
      Arabic: "阿拉伯语",
      Armenian: "亚美尼亚语",
      Azerbaijani: "阿塞拜疆语",
      Bashkir: "巴什基尔语",
      Basque: "巴斯克语",
      Belarusian: "白俄罗斯语",
      Bengali: "孟加拉语",
      Bosnian: "波斯尼亚语",
      Bulgarian: "保加利亚语",
      Burmese: "缅甸语",
      Catalan: "加泰罗尼亚语",
      Cebuano: "宿雾语",
      Chichewa: "奇切瓦语",
      "Chinese Simplified": "简体中文",
      "Chinese Traditional": "繁体中文",
      Corsican: "科西嘉语",
      Croatian: "克罗地亚语",
      Czech: "捷克语",
      Danish: "丹麦语",
      Dutch: "荷兰语",
      English: "英语",
      Esperanto: "世界语",
      Estonian: "爱沙尼亚语",
      Finnish: "芬兰语",
      French: "法语",
      Frisian: "弗里斯兰语",
      Galician: "加利西亚语",
      Georgian: "格鲁吉亚语",
      German: "德语",
      Greek: "希腊语",
      Gujarati: "古吉拉特语",
      "Haitian Creole": "海地语",
      Hausa: "豪萨语",
      Hawaiian: "夏威夷语",
      Hebrew: "希伯来语",
      Hindi: "印地语",
      Hmong: "苗语",
      Hungarian: "匈牙利语",
      Icelandic: "冰岛语",
      Igbo: "伊博语",
      Indonesian: "印度尼西亚语",
      Irish: "爱尔兰语",
      Italian: "意大利语",
      Japanese: "日语",
      Javanese: "爪哇语",
      Kannada: "卡纳达语",
      Kazakh: "哈萨克语",
      Khmer: "高棉语",
      Kinyarwanda: "基尼亚卢旺达语",
      Korean: "韩语",
      Kurdish: "库尔德语",
      Kyrgyz: "吉尔吉斯语",
      Lao: "老挝语",
      Latin: "拉丁语",
      Latvian: "拉脱维亚语",
      Lithuanian: "立陶宛语",
      Luxembourgish: "卢森堡语",
      Macedonian: "马其顿语",
      Malagasy: "马达加斯加语",
      Malay: "马来语",
      Malayalam: "马拉雅拉姆语",
      Maltese: "马耳他语",
      Maori: "毛利语",
      Marathi: "马拉地语",
      Mongolian: "蒙古语",
      Myanmar: "缅甸语",
      Nepali: "尼泊尔语",
      Norwegian: "挪威语",
      Pashto: "普什图语",
      Persian: "波斯语",
      Polish: "波兰语",
      Portuguese: "葡萄牙语",
      Punjabi: "旁遮普语",
      Romanian: "罗马尼亚语",
      Russian: "俄语",
      Samoan: "萨摩亚语",
      "Scots Gaelic": "苏格兰盖尔语",
      Serbian: "塞尔维亚语",
      Sesotho: "塞索托语",
      Shona: "绍纳语",
      Sindhi: "信德语",
      Sinhala: "僧伽罗语",
      Slovak: "斯洛伐克语",
      Slovenian: "斯洛文尼亚语",
      Somali: "索马里语",
      Spanish: "西班牙语",
      Sundanese: "巽他语",
      Swahili: "斯瓦希里语",
      Swedish: "瑞典语",
      Tagalog: "他加禄语",
      Tajik: "塔吉克语",
      Tamil: "泰米尔语",
      Tatar: "鞑靼语",
      Telugu: "泰卢固语",
      Thai: "泰语",
      Turkish: "土耳其语",
      Turkmen: "土库曼语",
      Ukrainian: "乌克兰语",
      Urdu: "乌尔都语",
      Uyghur: "维吾尔语",
      Uzbek: "乌兹别克语",
      Vietnamese: "越南语",
      Welsh: "威尔士语",
      Xhosa: "科萨语",
      Yiddish: "意第绪语",
      Yoruba: "约鲁巴语",
      Zulu: "祖鲁语",
      "Select the language you are fluent in (required)":
        "选择您精通的语言。（必填）",
      "Select the language you want to learn (required)":
        "选择您想学习的语言。（必填）",
      "Select an additional language you want to learn (optional)":
        "选择您想学习的其他语言。（可选）",
      "Info saved, Happy chatting!": "信息已保存，祝您聊天愉快！",
      "Fluent language is the language you are most comfortable speaking or born speaking":
        "精通语言是您最擅长说或出生说的语言",
    },
    "zh-TW": {
      "Invite a friend": "邀請朋友",
      "Invite people to chat with you": " 邀請人們與您聊天",
      "Select the language you want to learn": "選擇您想學習的語言",
      "introduce yourself and explain your goals with the language you are learning":
        "讓它成為一個簡單的對話開始者 :)",
      "Please, upload a photo": "請上傳照片",
      "Select your native language": "输入您的母语",
      "Connect with native speakers in": "在这里找到母语人士",
      "About me": "关于我",
      "My interests (optional)": "我的兴趣（可选）",
      "Share your language goals and more with other people!":
        "与其他人分享您的语言目标等！",
      "Occupation (optional)": "职业（可选）",
      "What do you do for a living?": "你是做什么的？",
      appName: "Langiddy",
      Online: "Online",
      Hidden: "隐藏",
      Home: "首页",
      Help: "教程",
      "My native language is": "我的母语是",
      "I'm learning": "我在学习",
      "Find native speakers in": "在这里找到母语人士",
      "Update Langs status": "更新语言状态",
      "Restore purchases": "恢复购买",
      "Account settings": "账户设置",
      "Hide profile or make it visible to other users":
        "隐藏个人资料或使其对其他用户可见",
      "Tap to edit your name": "点击编辑你的名字",
      "First name": "编辑名字",
      "Last name": "编辑姓氏",
      Done: "完成",
      "Select languages below, tap Done to confirm":
        "选择下面的语言，点击完成以确认",
      Africkaans: "南非荷兰语",
      Albanian: "阿尔巴尼亚语",
      Amharic: "阿姆哈拉语",
      Arabic: "阿拉伯语",
      Armenian: "亚美尼亚语",
      Azerbaijani: "阿塞拜疆语",
      Bashkir: "巴什基尔语",
      Basque: "巴斯克语",
      Belarusian: "白俄罗斯语",
      Bengali: "孟加拉语",
      Bosnian: "波斯尼亚语",
      Bulgarian: "保加利亚语",
      Burmese: "缅甸语",
      Catalan: "加泰罗尼亚语",
      Cebuano: "宿雾语",
      Chichewa: "奇切瓦语",
      "Chinese Simplified": "简体中文",
      "Chinese Traditional": "繁体中文",
      Corsican: "科西嘉语",
      Croatian: "克罗地亚语",
      Czech: "捷克语",
      Danish: "丹麦语",
      Dutch: "荷兰语",
      English: "英语",
      Esperanto: "世界语",
      Estonian: "爱沙尼亚语",
      Finnish: "芬兰语",
      French: "法语",
      Frisian: "弗里斯兰语",
      Galician: "加利西亚语",
      Georgian: "格鲁吉亚语",
      German: "德语",
      Greek: "希腊语",
      Gujarati: "古吉拉特语",
      "Haitian Creole": "海地语",
      Hausa: "豪萨语",
      Hawaiian: "夏威夷语",
      Hebrew: "希伯来语",
      Hindi: "印地语",
      Hmong: "苗语",
      Hungarian: "匈牙利语",
      Icelandic: "冰岛语",
      Igbo: "伊博语",
      Indonesian: "印度尼西亚语",
      Irish: "爱尔兰语",
      Italian: "意大利语",
      Japanese: "日语",
      Javanese: "爪哇语",
      Kannada: "卡纳达语",
      Kazakh: "哈萨克语",
      Khmer: "高棉语",
      Kinyarwanda: "基尼亚卢旺达语",
      Korean: "韩语",
      Kurdish: "库尔德语",
      Kyrgyz: "吉尔吉斯语",
      Lao: "老挝语",
      Latin: "拉丁语",
      Latvian: "拉脱维亚语",
      Lithuanian: "立陶宛语",
      Luxembourgish: "卢森堡语",
      Macedonian: "马其顿语",
      Malagasy: "马达加斯加语",
      Malay: "马来语",
      Malayalam: "马拉雅拉姆语",
      Maltese: "马耳他语",
      Maori: "毛利语",
      Marathi: "马拉地语",
      Mongolian: "蒙古语",
      Myanmar: "缅甸语",
      Nepali: "尼泊尔语",
      Norwegian: "挪威语",
      Pashto: "普什图语",
      Persian: "波斯语",
      Polish: "波兰语",
      Portuguese: "葡萄牙语",
      Punjabi: "旁遮普语",
      Romanian: "罗马尼亚语",
      Russian: "俄语",
      Samoan: "萨摩亚语",
      "Scots Gaelic": "苏格兰盖尔语",
      Serbian: "塞尔维亚语",
      Sesotho: "塞索托语",
      Shona: "绍纳语",
      Sindhi: "信德语",
      Sinhala: "僧伽罗语",
      Slovak: "斯洛伐克语",
      Slovenian: "斯洛文尼亚语",
      Somali: "索马里语",
      Spanish: "西班牙语",
      Sundanese: "巽他语",
      Swahili: "斯瓦希里语",
      Swedish: "瑞典语",
      Tagalog: "他加禄语",
      Tajik: "塔吉克语",
      Tamil: "泰米尔语",
      Tatar: "鞑靼语",
      Telugu: "泰卢固语",
      Thai: "泰语",
      Turkish: "土耳其语",
      Turkmen: "土库曼语",
      Ukrainian: "乌克兰语",
      Urdu: "乌尔都语",
      Uyghur: "维吾尔语",
      Uzbek: "乌兹别克语",
      Vietnamese: "越南语",
      Welsh: "威尔士语",
      Xhosa: "科萨语",
      Yiddish: "意第绪语",
      Yoruba: "约鲁巴语",
      Zulu: "祖鲁语",
      "Select the language you are fluent in (required)":
        "选择您精通的语言。（必填）",
      "Select the language you want to learn (required)":
        "选择您想学习的语言。（必填）",
      "Select an additional language you want to learn (optional)":
        "选择您想学习的其他语言。（可选）",
      "Info saved, Happy chatting!": "信息已保存，祝您聊天愉快！",
      "Fluent language is the language you are most comfortable speaking or born speaking":
        "精通语言是您最擅长说或出生说的语言",
    },
  });
  i18n.defaultLocale = "en-US";
  console.log("i18n.defaultLocale", i18n.defaultLocale);
  i18n.locale = locale;
  console.log("i18n.locale", i18n.locale);
  i18n.enableFallback = true;
  console.log("i18n.fallbacks", i18n.enableFallback);
  //! end of localization

  const [fluentIn, setFluentIn] = React.useState([
    { label: i18n.t("Africkaans"), value: "af" },
    { label: i18n.t("Albanian"), value: "sq" },
    { label: i18n.t("Amharic"), value: "am" },
    { label: i18n.t("Arabic"), value: "ar" },
    { label: i18n.t("Armenian"), value: "hy" },
    { label: i18n.t("Azerbaijani"), value: "az" },
    { label: i18n.t("Bashkir"), value: "ba" },
    { label: i18n.t("Basque"), value: "eu" },
    { label: i18n.t("Belarusian"), value: "be" },
    { label: i18n.t("Bengali"), value: "bn" },
    { label: i18n.t("Bosnian"), value: "bs" },
    { label: i18n.t("Bulgarian"), value: "bg" },
    { label: i18n.t("Catalan"), value: "ca" },
    { label: i18n.t("Cebuano"), value: "ceb" },
    { label: i18n.t("Chichewa"), value: "ny" },
    { label: i18n.t("Chinese Simplified"), value: "zh-CN" },
    { label: i18n.t("Chinese Traditional"), value: "zh-TW" },
    { label: i18n.t("Corsican"), value: "co" },
    { label: i18n.t("Croatian"), value: "hr" },
    { label: i18n.t("Czech"), value: "cs" },
    { label: i18n.t("Danish"), value: "da" },
    { label: i18n.t("Dutch"), value: "nl" },
    { label: i18n.t("English"), value: "en" },
    { label: i18n.t("Esperanto"), value: "eo" },
    { label: i18n.t("Estonian"), value: "et" },
    { label: i18n.t("Finnish"), value: "fi" },
    { label: i18n.t("French"), value: "fr" },
    { label: i18n.t("Frisian"), value: "fy" },
    { label: i18n.t("Galician"), value: "gl" },
    { label: i18n.t("Georgian"), value: "ka" },
    { label: i18n.t("German"), value: "de" },
    { label: i18n.t("Greek"), value: "el" },
    { label: i18n.t("Gujarati"), value: "gu" },
    { label: i18n.t("Haitian Creole"), value: "ht" },
    { label: i18n.t("Hausa"), value: "ha" },
    { label: i18n.t("Hawaiian"), value: "haw" },
    { label: i18n.t("Hebrew"), value: "iw" },
    { label: i18n.t("Hindi"), value: "hi" },
    { label: i18n.t("Hmong"), value: "hmn" },
    { label: i18n.t("Hungarian"), value: "hu" },
    { label: i18n.t("Icelandic"), value: "is" },
    { label: i18n.t("Igbo"), value: "ig" },
    { label: i18n.t("Indonesian"), value: "id" },
    { label: i18n.t("Irish"), value: "ga" },
    { label: i18n.t("Italian"), value: "it" },
    { label: i18n.t("Japanese"), value: "ja" },
    { label: i18n.t("Javanese"), value: "jw" },
    { label: i18n.t("Kannada"), value: "kn" },
    { label: i18n.t("Kazakh"), value: "kk" },
    { label: i18n.t("Khmer"), value: "km" },
    { label: i18n.t("Korean"), value: "ko" },
    { label: i18n.t("Kurdish"), value: "ku" },
    { label: i18n.t("Kyrgyz"), value: "ky" },
    { label: i18n.t("Lao"), value: "lo" },
    { label: i18n.t("Latin"), value: "la" },
    { label: i18n.t("Latvian"), value: "lv" },
    { label: i18n.t("Lithuanian"), value: "lt" },
    { label: i18n.t("Luxembourgish"), value: "lb" },
    { label: i18n.t("Macedonian"), value: "mk" },
    { label: i18n.t("Malagasy"), value: "mg" },
    { label: i18n.t("Malay"), value: "ms" },
    { label: i18n.t("Malayalam"), value: "ml" },
    { label: i18n.t("Maltese"), value: "mt" },
    { label: i18n.t("Maori"), value: "mi" },
    { label: i18n.t("Marathi"), value: "mr" },
    { label: i18n.t("Mongolian"), value: "mn" },
    { label: i18n.t("Myanmar"), value: "my" },
    { label: i18n.t("Nepali"), value: "ne" },
    { label: i18n.t("Norwegian"), value: "no" },
    { label: i18n.t("Pashto"), value: "ps" },
    { label: i18n.t("Persian"), value: "fa" },
    { label: i18n.t("Polish"), value: "pl" },
    { label: i18n.t("Portuguese"), value: "pt" },
    { label: i18n.t("Punjabi"), value: "pa" },
    { label: i18n.t("Romanian"), value: "ro" },
    { label: i18n.t("Russian"), value: "ru" },
    { label: i18n.t("Samoan"), value: "sm" },
    { label: i18n.t("Scots Gaelic"), value: "gd" },
    { label: i18n.t("Serbian"), value: "sr" },
    { label: i18n.t("Sesotho"), value: "st" },
    { label: i18n.t("Shona"), value: "sn" },
    { label: i18n.t("Sindhi"), value: "sd" },
    { label: i18n.t("Sinhala"), value: "si" },
    { label: i18n.t("Slovak"), value: "sk" },
    { label: i18n.t("Slovenian"), value: "sl" },
    { label: i18n.t("Somali"), value: "so" },
    { label: i18n.t("Spanish"), value: "es" },
    { label: i18n.t("Sundanese"), value: "su" },
    { label: i18n.t("Swahili"), value: "sw" },
    { label: i18n.t("Swedish"), value: "sv" },
    { label: i18n.t("Tagalog"), value: "tl" },
    { label: i18n.t("Tajik"), value: "tg" },
    { label: i18n.t("Tamil"), value: "ta" },
    { label: i18n.t("Telugu"), value: "te" },
    { label: i18n.t("Thai"), value: "th" },
    { label: i18n.t("Turkish"), value: "tr" },
    { label: i18n.t("Ukrainian"), value: "uk" },
    { label: i18n.t("Urdu"), value: "ur" },
    { label: i18n.t("Uzbek"), value: "uz" },
    { label: i18n.t("Vietnamese"), value: "vi" },
    { label: i18n.t("Welsh"), value: "cy" },
    { label: i18n.t("Xhosa"), value: "xh" },
    { label: i18n.t("Yiddish"), value: "yi" },
    { label: i18n.t("Yoruba"), value: "yo" },
    { label: i18n.t("Zulu"), value: "zu" },
  ]);
  const [lang1, setLang1] = React.useState([
    { label: i18n.t("English"), value: "en" },
    { label: i18n.t("Chinese Simplified"), value: "zh-CN" },
    { label: i18n.t("Chinese Traditional"), value: "zh-TW" },
    { label: i18n.t("Spanish"), value: "es" },
    { label: i18n.t("French"), value: "fr" },
    { label: i18n.t("German"), value: "de" },
    { label: i18n.t("Japanese"), value: "ja" },
    { label: i18n.t("Russian"), value: "ru" },
    { label: i18n.t("Arabic"), value: "ar" },
    { label: i18n.t("Portuguese"), value: "pt" },
    { label: i18n.t("Korean"), value: "ko" },
    { label: i18n.t("Africkaans"), value: "af" },
    { label: i18n.t("Albanian"), value: "sq" },
    { label: i18n.t("Amharic"), value: "am" },
    { label: i18n.t("Armenian"), value: "hy" },
    { label: i18n.t("Azerbaijani"), value: "az" },
    { label: i18n.t("Bashkir"), value: "ba" },
    { label: i18n.t("Basque"), value: "eu" },
    { label: i18n.t("Belarusian"), value: "be" },
    { label: i18n.t("Bengali"), value: "bn" },
    { label: i18n.t("Bosnian"), value: "bs" },
    { label: i18n.t("Bulgarian"), value: "bg" },
    { label: i18n.t("Catalan"), value: "ca" },
    { label: i18n.t("Cebuano"), value: "ceb" },
    { label: i18n.t("Chichewa"), value: "ny" },
    { label: i18n.t("Corsican"), value: "co" },
    { label: i18n.t("Croatian"), value: "hr" },
    { label: i18n.t("Czech"), value: "cs" },
    { label: i18n.t("Danish"), value: "da" },
    { label: i18n.t("Dutch"), value: "nl" },
    { label: i18n.t("Esperanto"), value: "eo" },
    { label: i18n.t("Estonian"), value: "et" },
    { label: i18n.t("Finnish"), value: "fi" },
    { label: i18n.t("Frisian"), value: "fy" },
    { label: i18n.t("Galician"), value: "gl" },
    { label: i18n.t("Georgian"), value: "ka" },
    { label: i18n.t("Greek"), value: "el" },
    { label: i18n.t("Gujarati"), value: "gu" },
    { label: i18n.t("Haitian Creole"), value: "ht" },
    { label: i18n.t("Hausa"), value: "ha" },
    { label: i18n.t("Hawaiian"), value: "haw" },
    { label: i18n.t("Hebrew"), value: "iw" },
    { label: i18n.t("Hindi"), value: "hi" },
    { label: i18n.t("Hmong"), value: "hmn" },
    { label: i18n.t("Hungarian"), value: "hu" },
    { label: i18n.t("Icelandic"), value: "is" },
    { label: i18n.t("Igbo"), value: "ig" },
    { label: i18n.t("Indonesian"), value: "id" },
    { label: i18n.t("Irish"), value: "ga" },
    { label: i18n.t("Italian"), value: "it" },
    { label: i18n.t("Javanese"), value: "jw" },
    { label: i18n.t("Kannada"), value: "kn" },
    { label: i18n.t("Kazakh"), value: "kk" },
    { label: i18n.t("Khmer"), value: "km" },
    { label: i18n.t("Kurdish"), value: "ku" },
    { label: i18n.t("Kyrgyz"), value: "ky" },
    { label: i18n.t("Lao"), value: "lo" },
    { label: i18n.t("Latin"), value: "la" },
    { label: i18n.t("Latvian"), value: "lv" },
    { label: i18n.t("Lithuanian"), value: "lt" },
    { label: i18n.t("Luxembourgish"), value: "lb" },
    { label: i18n.t("Macedonian"), value: "mk" },
    { label: i18n.t("Malagasy"), value: "mg" },
    { label: i18n.t("Malay"), value: "ms" },
    { label: i18n.t("Malayalam"), value: "ml" },
    { label: i18n.t("Maltese"), value: "mt" },
    { label: i18n.t("Maori"), value: "mi" },
    { label: i18n.t("Marathi"), value: "mr" },
    { label: i18n.t("Mongolian"), value: "mn" },
    { label: i18n.t("Myanmar"), value: "my" },
    { label: i18n.t("Nepali"), value: "ne" },
    { label: i18n.t("Norwegian"), value: "no" },
    { label: i18n.t("Pashto"), value: "ps" },
    { label: i18n.t("Persian"), value: "fa" },
    { label: i18n.t("Polish"), value: "pl" },
    { label: i18n.t("Punjabi"), value: "pa" },
    { label: i18n.t("Romanian"), value: "ro" },
    { label: i18n.t("Samoan"), value: "sm" },
    { label: i18n.t("Scots Gaelic"), value: "gd" },
    { label: i18n.t("Serbian"), value: "sr" },
    { label: i18n.t("Sesotho"), value: "st" },
    { label: i18n.t("Shona"), value: "sn" },
    { label: i18n.t("Sindhi"), value: "sd" },
    { label: i18n.t("Sinhala"), value: "si" },
    { label: i18n.t("Slovak"), value: "sk" },
    { label: i18n.t("Slovenian"), value: "sl" },
    { label: i18n.t("Somali"), value: "so" },
    { label: i18n.t("Sundanese"), value: "su" },
    { label: i18n.t("Swahili"), value: "sw" },
    { label: i18n.t("Swedish"), value: "sv" },
    { label: i18n.t("Tagalog"), value: "tl" },
    { label: i18n.t("Tajik"), value: "tg" },
    { label: i18n.t("Tamil"), value: "ta" },
    { label: i18n.t("Telugu"), value: "te" },
    { label: i18n.t("Thai"), value: "th" },
    { label: i18n.t("Turkish"), value: "tr" },
    { label: i18n.t("Ukrainian"), value: "uk" },
    { label: i18n.t("Urdu"), value: "ur" },
    { label: i18n.t("Uzbek"), value: "uz" },
    { label: i18n.t("Vietnamese"), value: "vi" },
    { label: i18n.t("Welsh"), value: "cy" },
    { label: i18n.t("Xhosa"), value: "xh" },
    { label: i18n.t("Yiddish"), value: "yi" },
    { label: i18n.t("Yoruba"), value: "yo" },
    { label: i18n.t("Zulu"), value: "zu" },
  ]);
  const [lang2, setLang2] = React.useState([
    { label: i18n.t("English"), value: "en" },
    { label: i18n.t("Chinese Simplified"), value: "zh-CN" },
    { label: i18n.t("Chinese Traditional"), value: "zh-TW" },
    { label: i18n.t("Spanish"), value: "es" },
    { label: i18n.t("French"), value: "fr" },
    { label: i18n.t("German"), value: "de" },
    { label: i18n.t("Japanese"), value: "ja" },
    { label: i18n.t("Russian"), value: "ru" },
    { label: i18n.t("Arabic"), value: "ar" },
    { label: i18n.t("Portuguese"), value: "pt" },
    { label: i18n.t("Korean"), value: "ko" },
    { label: i18n.t("Africkaans"), value: "af" },
    { label: i18n.t("Albanian"), value: "sq" },
    { label: i18n.t("Amharic"), value: "am" },
    { label: i18n.t("Armenian"), value: "hy" },
    { label: i18n.t("Azerbaijani"), value: "az" },
    { label: i18n.t("Bashkir"), value: "ba" },
    { label: i18n.t("Basque"), value: "eu" },
    { label: i18n.t("Belarusian"), value: "be" },
    { label: i18n.t("Bengali"), value: "bn" },
    { label: i18n.t("Bosnian"), value: "bs" },
    { label: i18n.t("Bulgarian"), value: "bg" },
    { label: i18n.t("Catalan"), value: "ca" },
    { label: i18n.t("Cebuano"), value: "ceb" },
    { label: i18n.t("Chichewa"), value: "ny" },
    { label: i18n.t("Corsican"), value: "co" },
    { label: i18n.t("Croatian"), value: "hr" },
    { label: i18n.t("Czech"), value: "cs" },
    { label: i18n.t("Danish"), value: "da" },
    { label: i18n.t("Dutch"), value: "nl" },
    { label: i18n.t("Esperanto"), value: "eo" },
    { label: i18n.t("Estonian"), value: "et" },
    { label: i18n.t("Finnish"), value: "fi" },
    { label: i18n.t("Frisian"), value: "fy" },
    { label: i18n.t("Galician"), value: "gl" },
    { label: i18n.t("Georgian"), value: "ka" },
    { label: i18n.t("Greek"), value: "el" },
    { label: i18n.t("Gujarati"), value: "gu" },
    { label: i18n.t("Haitian Creole"), value: "ht" },
    { label: i18n.t("Hausa"), value: "ha" },
    { label: i18n.t("Hawaiian"), value: "haw" },
    { label: i18n.t("Hebrew"), value: "iw" },
    { label: i18n.t("Hindi"), value: "hi" },
    { label: i18n.t("Hmong"), value: "hmn" },
    { label: i18n.t("Hungarian"), value: "hu" },
    { label: i18n.t("Icelandic"), value: "is" },
    { label: i18n.t("Igbo"), value: "ig" },
    { label: i18n.t("Indonesian"), value: "id" },
    { label: i18n.t("Irish"), value: "ga" },
    { label: i18n.t("Italian"), value: "it" },
    { label: i18n.t("Javanese"), value: "jw" },
    { label: i18n.t("Kannada"), value: "kn" },
    { label: i18n.t("Kazakh"), value: "kk" },
    { label: i18n.t("Khmer"), value: "km" },
    { label: i18n.t("Kurdish"), value: "ku" },
    { label: i18n.t("Kyrgyz"), value: "ky" },
    { label: i18n.t("Lao"), value: "lo" },
    { label: i18n.t("Latin"), value: "la" },
    { label: i18n.t("Latvian"), value: "lv" },
    { label: i18n.t("Lithuanian"), value: "lt" },
    { label: i18n.t("Luxembourgish"), value: "lb" },
    { label: i18n.t("Macedonian"), value: "mk" },
    { label: i18n.t("Malagasy"), value: "mg" },
    { label: i18n.t("Malay"), value: "ms" },
    { label: i18n.t("Malayalam"), value: "ml" },
    { label: i18n.t("Maltese"), value: "mt" },
    { label: i18n.t("Maori"), value: "mi" },
    { label: i18n.t("Marathi"), value: "mr" },
    { label: i18n.t("Mongolian"), value: "mn" },
    { label: i18n.t("Myanmar"), value: "my" },
    { label: i18n.t("Nepali"), value: "ne" },
    { label: i18n.t("Norwegian"), value: "no" },
    { label: i18n.t("Pashto"), value: "ps" },
    { label: i18n.t("Persian"), value: "fa" },
    { label: i18n.t("Polish"), value: "pl" },
    { label: i18n.t("Punjabi"), value: "pa" },
    { label: i18n.t("Romanian"), value: "ro" },
    { label: i18n.t("Samoan"), value: "sm" },
    { label: i18n.t("Scots Gaelic"), value: "gd" },
    { label: i18n.t("Serbian"), value: "sr" },
    { label: i18n.t("Sesotho"), value: "st" },
    { label: i18n.t("Shona"), value: "sn" },
    { label: i18n.t("Sindhi"), value: "sd" },
    { label: i18n.t("Sinhala"), value: "si" },
    { label: i18n.t("Slovak"), value: "sk" },
    { label: i18n.t("Slovenian"), value: "sl" },
    { label: i18n.t("Somali"), value: "so" },
    { label: i18n.t("Sundanese"), value: "su" },
    { label: i18n.t("Swahili"), value: "sw" },
    { label: i18n.t("Swedish"), value: "sv" },
    { label: i18n.t("Tagalog"), value: "tl" },
    { label: i18n.t("Tajik"), value: "tg" },
    { label: i18n.t("Tamil"), value: "ta" },
    { label: i18n.t("Telugu"), value: "te" },
    { label: i18n.t("Thai"), value: "th" },
    { label: i18n.t("Turkish"), value: "tr" },
    { label: i18n.t("Ukrainian"), value: "uk" },
    { label: i18n.t("Urdu"), value: "ur" },
    { label: i18n.t("Uzbek"), value: "uz" },
    { label: i18n.t("Vietnamese"), value: "vi" },
    { label: i18n.t("Welsh"), value: "cy" },
    { label: i18n.t("Xhosa"), value: "xh" },
    { label: i18n.t("Yiddish"), value: "yi" },
    { label: i18n.t("Yoruba"), value: "yo" },
    { label: i18n.t("Zulu"), value: "zu" },
  ]);

  const [hidden, setHidden] = React.useState(userData.hidden);

  const firstName = userData.firstName || "";
  const lastName = userData.lastName || "";
  const email = userData.email || "";
  const about = userData.about || "";
  const language = userData.language || value2 || "";
  const languageTwo = userData.languageTwo || value3 || "";
  const languageFrom = userData.languageFrom || value || "";
  const immersionLevel = userData.immersionLevel || "";
  const relationshipStatus = userData.relationshipStatus || "";
  const nextTrip = userData.nextTrip || "";
  const status = userData.status || "";
  const timeChat = userData.timeChat || "";

  //TODO - add available hours to chat

  const initialState = {
    inputValues: {
      firstName,
      lastName,
      email,
      about,
      immersionLevel,
      language,
      languageTwo,
      languageFrom,
      relationshipStatus,
      nextTrip,
      hidden,
      status,
      timeChat,
    },

    inputValidities: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      about: undefined,
      immersionLevel: undefined,
      language: undefined,
      languageTwo: undefined,
      languageFrom: undefined,
      relationshipStatus: undefined,
      nextTrip: undefined,
      status: undefined,
      timeChat: undefined,
    },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const [allUsers, setAllUsers] = useState([]);
  const [langs, setLangs] = useState([]);

  // gets all users from the database
  const getAllUsers = async () => {
    const allUsers = await searchUsersLanguage(
      userData.language,
      userData.languageFrom
    );
    setAllUsers(allUsers);
    setLangs(Object.values(allUsers));
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    //TODO: filter users by language connect people randomly learning the same language
    //? could also just get rid of filter and people can just connect with somone learning any language
    dispatch(
      // setStoredUsers({
      //   newUsers: langs.filter(
      //     (user) =>
      //       user.userId !== userData.userId &&
      //       user.language === userData.language &&
      //       user.languageFrom === userData.languageFrom
      //   ),
      // })
      setStoredUsers({
        newUsers: langs,
      })
    );
  }, [langs, dispatch]);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  const saveHandler = useCallback(async () => {
    const updatedValues = formState.inputValues;

    try {
      setIsLoading(true);
      await updateSignedInUserData(userData.userId, updatedValues);
      dispatch(updateLoggedInUserData({ newData: updatedValues }));

      if (userData.language !== "" || userData.languageFrom !== "") {
        // Display the alert with the updated userData.language
        Alert.alert(
          "You're All Set!",
          `
  Type in ${
    (value === "af" && "Afrikaans") ||
    (value === "ar" && "Arabic") ||
    (value === "sq" && "Albanian") ||
    (value === "am" && "Amharic") ||
    (value === "hy" && "Armenian") ||
    (value === "az" && "Azerbaijani") ||
    (value === "eu" && "Basque") ||
    (value === "be" && "Belarusian") ||
    (value === "bn" && "Bengali") ||
    (value === "bs" && "Bosnian") ||
    (value === "bg" && "Bulgarian") ||
    (value === "ca" && "Catalan") ||
    (value === "ceb" && "Cebuano") ||
    (value === "ny" && "Chichewa") ||
    (value === "zh-CN" && "Chinese") ||
    (value === "zh-TW" && "Chinese") ||
    (value === "co" && "Corsican") ||
    (value === "hr" && "Croatian") ||
    (value === "cs" && "Czech") ||
    (value === "da" && "Danish") ||
    (value === "nl" && "Dutch") ||
    (value === "en" && "English") ||
    (value === "eo" && "Esperanto") ||
    (value === "et" && "Estonian") ||
    (value === "tl" && "Filipino") ||
    (value === "fi" && "Finnish") ||
    (value === "fr" && "French") ||
    (value === "fy" && "Frisian") ||
    (value === "gl" && "Galician") ||
    (value === "ka" && "Georgian") ||
    (value === "de" && "German") ||
    (value === "el" && "Greek") ||
    (value === "gu" && "Gujarati") ||
    (value === "ht" && "Haitian Creole") ||
    (value === "ha" && "Hausa") ||
    (value === "haw" && "Hawaiian") ||
    (value === "iw" && "Hebrew") ||
    (value === "hi" && "Hindi") ||
    (value === "hmn" && "Hmong") ||
    (value === "hu" && "Hungarian") ||
    (value === "is" && "Icelandic") ||
    (value === "ig" && "Igbo") ||
    (value === "id" && "Indonesian") ||
    (value === "ga" && "Irish") ||
    (value === "it" && "Italian") ||
    (value === "ja" && "Japanese") ||
    (value === "jw" && "Javanese") ||
    (value === "kn" && "Kannada") ||
    (value === "kk" && "Kazakh") ||
    (value === "km" && "Khmer") ||
    (value === "ko" && "Korean") ||
    (value === "ku" && "Kurdish (Kurmanji)") ||
    (value === "ky" && "Kyrgyz") ||
    (value === "lo" && "Lao") ||
    (value === "la" && "Latin") ||
    (value === "lv" && "Latvian") ||
    (value === "lt" && "Lithuanian") ||
    (value === "lb" && "Luxembourgish") ||
    (value === "mk" && "Macedonian") ||
    (value === "mg" && "Malagasy") ||
    (value === "ms" && "Malay") ||
    (value === "ml" && "Malayalam") ||
    (value === "mt" && "Maltese") ||
    (value === "mi" && "Maori") ||
    (value === "mr" && "Marathi") ||
    (value === "mn" && "Mongolian") ||
    (value === "my" && "Myanmar (Burmese)") ||
    (value === "ne" && "Nepali") ||
    (value === "no" && "Norwegian") ||
    (value === "ny" && "Nyanja (Chichewa)") ||
    (value === "ps" && "Pashto") ||
    (value === "fa" && "Persian") ||
    (value === "pl" && "Polish") ||
    (value === "pt" && "Portuguese") ||
    (value === "pa" && "Punjabi") ||
    (value === "ro" && "Romanian") ||
    (value === "ru" && "Russian") ||
    (value === "sm" && "Samoan") ||
    (value === "gd" && "Scots Gaelic") ||
    (value === "sr" && "Serbian") ||
    (value === "st" && "Sesotho") ||
    (value === "sn" && "Shona") ||
    (value === "sd" && "Sindhi") ||
    (value === "si" && "Sinhala") ||
    (value === "sk" && "Slovak") ||
    (value === "sl" && "Slovenian") ||
    (value === "so" && "Somali") ||
    (value === "es" && "Spanish") ||
    (value === "su" && "Sundanese") ||
    (value === "sw" && "Swahili") ||
    (value === "sv" && "Swedish") ||
    (value === "tg" && "Tajik") ||
    (value === "ta" && "Tamil") ||
    (value === "te" && "Telugu") ||
    (value === "th" && "Thai") ||
    (value === "tr" && "Turkish") ||
    (value === "uk" && "Ukrainian") ||
    (value === "ur" && "Urdu") ||
    (value === "uz" && "Uzbek") ||
    (value === "vi" && "Vietnamese") ||
    (value === "cy" && "Welsh") ||
    (value === "xh" && "Xhosa") ||
    (value === "yi" && "Yiddish") ||
    (value === "yo" && "Yoruba") ||
    (value === "zu" && "Zulu")
  }, learn ${
            (value2 === "af" && "Afrikaans") ||
            (value2 === "ar" && "Arabic") ||
            (value2 === "sq" && "Albanian") ||
            (value2 === "am" && "Amharic") ||
            (value2 === "hy" && "Armenian") ||
            (value2 === "az" && "Azerbaijani") ||
            (value2 === "eu" && "Basque") ||
            (value2 === "be" && "Belarusian") ||
            (value2 === "bn" && "Bengali") ||
            (value2 === "bs" && "Bosnian") ||
            (value2 === "bg" && "Bulgarian") ||
            (value2 === "ca" && "Catalan") ||
            (value2 === "ceb" && "Cebuano") ||
            (value2 === "ny" && "Chichewa") ||
            (value2 === "zh-CN" && "Chinese") ||
            (value2 === "zh-TW" && "Chinese") ||
            (value2 === "co" && "Corsican") ||
            (value2 === "hr" && "Croatian") ||
            (value2 === "cs" && "Czech") ||
            (value2 === "da" && "Danish") ||
            (value2 === "nl" && "Dutch") ||
            (value2 === "en" && "English") ||
            (value2 === "eo" && "Esperanto") ||
            (value2 === "et" && "Estonian") ||
            (value2 === "tl" && "Filipino") ||
            (value2 === "fi" && "Finnish") ||
            (value2 === "fr" && "French") ||
            (value2 === "fy" && "Frisian") ||
            (value2 === "gl" && "Galician") ||
            (value2 === "ka" && "Georgian") ||
            (value2 === "de" && "German") ||
            (value2 === "el" && "Greek") ||
            (value2 === "gu" && "Gujarati") ||
            (value2 === "ht" && "Haitian Creole") ||
            (value2 === "ha" && "Hausa") ||
            (value2 === "haw" && "Hawaiian") ||
            (value2 === "iw" && "Hebrew") ||
            (value2 === "hi" && "Hindi") ||
            (value2 === "hmn" && "Hmong") ||
            (value2 === "hu" && "Hungarian") ||
            (value2 === "is" && "Icelandic") ||
            (value2 === "ig" && "Igbo") ||
            (value2 === "id" && "Indonesian") ||
            (value2 === "ga" && "Irish") ||
            (value2 === "it" && "Italian") ||
            (value2 === "ja" && "Japanese") ||
            (value2 === "jw" && "Javanese") ||
            (value2 === "kn" && "Kannada") ||
            (value2 === "kk" && "Kazakh") ||
            (value2 === "km" && "Khmer") ||
            (value2 === "ko" && "Korean") ||
            (value2 === "ku" && "Kurdish (Kurmanji)") ||
            (value2 === "ky" && "Kyrgyz") ||
            (value2 === "lo" && "Lao") ||
            (value2 === "la" && "Latin") ||
            (value2 === "lv" && "Latvian") ||
            (value2 === "lt" && "Lithuanian") ||
            (value2 === "lb" && "Luxembourgish") ||
            (value2 === "mk" && "Macedonian") ||
            (value2 === "mg" && "Malagasy") ||
            (value2 === "ms" && "Malay") ||
            (value2 === "ml" && "Malayalam") ||
            (value2 === "mt" && "Maltese") ||
            (value2 === "mi" && "Maori") ||
            (value2 === "mr" && "Marathi") ||
            (value2 === "mn" && "Mongolian") ||
            (value2 === "my" && "Myanmar (Burmese)") ||
            (value2 === "ne" && "Nepali") ||
            (value2 === "no" && "Norwegian") ||
            (value2 === "ny" && "Nyanja (Chichewa)") ||
            (value2 === "ps" && "Pashto") ||
            (value2 === "fa" && "Persian") ||
            (value2 === "pl" && "Polish") ||
            (value2 === "pt" && "Portuguese") ||
            (value2 === "pa" && "Punjabi") ||
            (value2 === "ro" && "Romanian") ||
            (value2 === "ru" && "Russian") ||
            (value2 === "sm" && "Samoan") ||
            (value2 === "gd" && "Scots Gaelic") ||
            (value2 === "sr" && "Serbian") ||
            (value2 === "st" && "Sesotho") ||
            (value2 === "sn" && "Shona") ||
            (value2 === "sd" && "Sindhi") ||
            (value2 === "si" && "Sinhala") ||
            (value2 === "sk" && "Slovak") ||
            (value2 === "sl" && "Slovenian") ||
            (value2 === "so" && "Somali") ||
            (value2 === "es" && "Spanish") ||
            (value2 === "su" && "Sundanese") ||
            (value2 === "sw" && "Swahili") ||
            (value2 === "sv" && "Swedish") ||
            (value2 === "tg" && "Tajik") ||
            (value2 === "ta" && "Tamil") ||
            (value2 === "te" && "Telugu") ||
            (value2 === "th" && "Thai") ||
            (value2 === "tr" && "Turkish") ||
            (value2 === "uk" && "Ukrainian") ||
            (value2 === "ur" && "Urdu") ||
            (value2 === "uz" && "Uzbek") ||
            (value2 === "vi" && "Vietnamese") ||
            (value2 === "cy" && "Welsh") ||
            (value2 === "xh" && "Xhosa") ||
            (value2 === "yi" && "Yiddish") ||
            (value2 === "yo" && "Yoruba") ||
            (value2 === "zu" && "Zulu")
          }!

  Feel giddy learning through messaging :)
 `,
          [
            {
              text: "Stay here",
              onPress: () => {
                // exit out of alert and stay on current page
              },
              style: "cancel",
            },
            {
              text: "Start chatting",
              onPress: async () => {
                const storedUsersArray = Object.values(storedUsers);
                const filteredStoredUsers = storedUsersArray.filter(
                  (user) =>
                    user.userId !== userData.userId &&
                    !user.hidden &&
                    user.isOnline
                );

                const shuffledUsers = shuffleArray(filteredStoredUsers);

                const randomUser = shuffledUsers[0];

                if (!randomUser) {
                  props.navigation.navigate("NewChat", {
                    isGroupChat: false,
                  });
                  return;
                }

                const chatData = userChats.find(
                  (chat) =>
                    !chat.isGroupChat && chat.users.includes(randomUser.userId)
                );

                if (chatData) {
                  props.navigation.navigate("Chat", {
                    chatId: chatData.key,
                  });
                  return;
                }

                props.navigation.navigate("Chat", {
                  newChatData: {
                    users: [randomUser.userId, userData.userId],
                  },
                });
              },
            },
          ],
          { cancelable: false }
        );
      }

      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, [formState.inputValues, dispatch, value, value2, value3]);

  function shuffleArray(array) {
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const saveHandlerName = useCallback(async () => {
    const updatedValues = formState.inputValues;

    try {
      setIsLoading(true);
      await updateSignedInUserData(userData.userId, updatedValues);
      dispatch(updateLoggedInUserData({ newData: updatedValues }));
      setEditName(!editName);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, [formState.inputValues, dispatch, value, value2, value3]);

  const dirctionsHandler = () => {
    saveHandler();
    saveHandlerLanguage();
  };

  // handler for language saving
  const saveHandlerLanguage = useCallback(async () => {
    try {
      setIsLoading(true);

      // Perform the updateSignedInUserData operation
      await updateSignedInUserData(userData.userId, {
        language: value2,
        languageTwo: value3,
        languageFrom: value,
      });

      // Dispatch the updateLoggedInUserData action
      dispatch(
        updateLoggedInUserData({
          newData: {
            language: value2,
            languageTwo: value3,
            languageFrom: value,
          },
        })
      );

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (err) {
      // Handle error if needed
      console.log("Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [value2, value3, value, userData.userId, dispatch]);

  const StarRatingDisplay = ({ averageStars }) => {
    const renderStars = () => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        const starIconName = i <= averageStars ? "star" : "star-border";
        stars.push(
          <MaterialIcons
            key={i}
            name={starIconName}
            size={20} // Adjust the size as needed
            style={styles.starIcon}
          />
        );
      }
      return stars;
    };

    return <View style={styles.starContainer}>{renderStars()}</View>;
  };

  //! HIDDEN HANDLER new
  const hiddenHandler = useCallback(async () => {
    // set hidden to true or false depending on current state of hidden
    try {
      setIsLoading(true);
      await updateSignedInUserData(userData.userId, { hidden: !hidden });
      dispatch(updateLoggedInUserData({ newData: { hidden: !hidden } }));

      setHidden(!hidden);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, [hidden, dispatch]);

  const hasChanges = () => {
    const currentValues = formState.inputValues;

    return (
      currentValues.firstName != firstName ||
      currentValues.lastName != lastName ||
      currentValues.email != email ||
      currentValues.about != about ||
      currentValues.immersionLevel != immersionLevel ||
      currentValues.relationshipStatus != relationshipStatus ||
      currentValues.nextTrip != nextTrip ||
      currentValues.status != status ||
      currentValues.timeChat != timeChat
    );
  };

  // toggle editName state
  const toggleEditName = () => {
    setEditName(!editName);
  };

  // mark in user data that user wants to see romanized text
  const [romanized, setRomanized] = React.useState(userData.romanized || false);

  const toggleRomanized = useCallback(async () => {
    try {
      setIsLoading(true);
      await updateSignedInUserData(userData.userId, {
        romanized: !romanized,
      });
      dispatch(updateLoggedInUserData({ newData: { romanized: !romanized } }));
      setRomanized(!romanized);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, [romanized, dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainerAll}>
        <View style={styles.homeContainer}>
          <PageTitle title={i18n.t("Home")} style={styles.pageTitle} />
        </View>

        <TouchableOpacity
          style={styles.invitecontainer}
          onPress={() => {
            props.navigation.navigate("Help");
          }}
        >
          <Text
            style={{
              color: colors.orange,
              fontSize: 20.5,
              fontFamily: "medium",
              paddingHorizontal: 20,
            }}
          >
            {i18n.t("Help")}
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        style={styles.containerKeyboard}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 95 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          {!userData.profilePic && (
            <>
              <Text style={styles.uploadText}>Ready to share your smile?</Text>
              <Text style={styles.uploadSubText}>
                Upload a photo and make your profile shine!
              </Text>
            </>
          )}
          {userData.profilePic ? (
            <MainProfilePic
              size={200}
              userId={userData.userId}
              uri={userData.profilePic}
              showEditButton={true}
            />
          ) : (
            <ImageSettingsHelper
              size={200}
              userId={userData.userId}
              uri={userData.profilePic}
              showEditButton={true}
            />
          )}
          <View style={styles.form}>
            <View style={styles.nameContainer}>
              {!hidden ? (
                <View
                  style={{
                    // flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={styles.hiddenContainer}>Online</Text>
                  <TouchableOpacity
                    onLongPress={() => {
                      Alert.alert(
                        i18n.t("Hide profile or make it visible to other users")
                      );
                    }}
                    onPress={hiddenHandler}
                    style={styles.hiddenContainer}
                  >
                    <MaterialCommunityIcons
                      name="toggle-switch"
                      size={40}
                      color="orange"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={styles.hiddenContainer}>Invisible</Text>
                  <TouchableOpacity
                    onLongPress={() => {
                      Alert.alert("Hide profile or make it visible.");
                    }}
                    onPress={hiddenHandler}
                    style={styles.hiddenContainer}
                  >
                    <MaterialCommunityIcons
                      name="toggle-switch-off-outline"
                      size={40}
                      color="orange"
                    />
                  </TouchableOpacity>
                </View>
              )}

              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  top: -18,
                }}
              >
                <TouchableOpacity
                  onPress={toggleEditName}
                  onLongPress={() => {
                    Alert.alert(i18n.t("Tap to edit your name"));
                  }}
                >
                  <Feather
                    style={{
                      ...styles.fullNameText,
                      color: colors.orange,
                      position: "absolute",
                      marginLeft: -170,
                    }}
                    name="edit"
                    size={24}
                    color="black"
                    position="absolute"
                  />
                </TouchableOpacity>
                <Text adjustsFontSizeToFit style={styles.fullNameText}>
                  {userData.firstName && userData.lastName
                    ? `${userData.firstName} ${userData.lastName}`
                    : userData.firstLast}
                </Text>

                {/* {userData.totalRatings && (
                  <StarRatingDisplay averageStars={userData.averageStars} />
                )} */}
              </View>

              {!editName && (
                <>
                  <Input
                    id="firstName"
                    label={i18n.t("First name")}
                    icon={"user"}
                    placeholder={"Please enter your first name"}
                    iconPack={Feather}
                    iconSize={24}
                    autoCapitalize={true}
                    onInputChanged={inputChangedHandler}
                    error={formState.inputValidities.firstName}
                    initialValue={userData.firstName}
                    maxLength={12}
                  />
                  <Input
                    id="lastName"
                    label={i18n.t("Last name")}
                    icon={"user"}
                    iconPack={Feather}
                    iconSize={24}
                    placeholder={"Please enter your last name"}
                    autoCapitalize={true}
                    onInputChanged={inputChangedHandler}
                    error={formState.inputValidities.lastName}
                    initialValue={userData.lastName}
                    maxLength={12}
                  />
                  <SubmitButtonLogin
                    title={"Save name"}
                    onPress={saveHandlerName}
                    disabled={!formState.formIsValid}
                    style={{ marginTop: 20, borderRadius: 10, width: "100%" }}
                    color={colors.orange}
                  />
                </>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: -10,
                paddingVertical: 10,
              }}
            >
              <>
                <Text
                  style={{
                    color: colors.defaultTextColor,
                    fontFamily: "medium",
                    fontSize: 16,
                    marginTop: -8,
                    paddingRight: "7%",
                    padding: 8,
                    // marginBottom: 10,
                  }}
                  // using localization here for instructions
                >
                  {i18n.t("Select languages below, tap Done to confirm")}.
                </Text>
              </>
            </View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {userData.languageFrom ? (
                  <Text
                    style={{
                      fontFamily: "semiBold",
                      fontSize: 16,
                      marginTop: 10,
                      color: colors.black,
                    }}
                  >
                    {i18n.t("My native language is")}:
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontFamily: "semiBold",
                      fontSize: 16,
                      marginTop: 10,
                      color: colors.black,
                    }}
                  >
                    {i18n.t("Select your native language")}:
                  </Text>
                )}
              </View>

              <DropDownPicker
                labelStyle={{
                  fontSize: 16,
                  fontFamily: "medium",
                  color: colors.black,
                }}
                textStyle={{
                  fontSize: 16,
                  fontFamily: "medium",
                  color: colors.black,
                }}
                searchable={true}
                searchPlaceholder="Enter native language"
                // autoScroll={true}
                open={open}
                value={value}
                items={fluentIn}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setFluentIn}
                listMode="MODAL"
                onChangeValue={(value) => {
                  saveHandlerLanguage();
                }}
                placeholder={
                  userData.languageFrom
                    ? userData.languageFrom
                    : i18n.t("Select the language you are fluent in (required)")
                }
                style={styles.dropDown}
              />

              {userData.language ? (
                <Text
                  style={{
                    fontFamily: "semiBold",
                    fontSize: 16,
                    marginTop: 10,
                    color: colors.black,
                  }}
                >
                  {i18n.t("I'm learning")}:
                </Text>
              ) : (
                <Text
                  style={{
                    fontFamily: "semiBold",
                    fontSize: 16,
                    marginTop: 10,
                    color: colors.black,
                  }}
                >
                  {i18n.t("Select the language you want to learn")}:
                </Text>
              )}

              <DropDownPicker
                labelStyle={{
                  fontSize: 16,
                  fontFamily: "medium",
                  color: colors.black,
                }}
                textStyle={{
                  fontSize: 16,
                  fontFamily: "medium",
                  color: colors.black,
                }}
                searchable={true}
                searchPlaceholder="Enter a language"
                autoScroll={true}
                open={open2}
                value={value2}
                items={lang1}
                setOpen={setOpen2}
                setValue={setValue2}
                setItems={setLang1}
                listMode="MODAL"
                onChangeValue={(value) => {
                  saveHandlerLanguage();
                }}
                placeholder={
                  userData.language
                    ? userData.language
                    : i18n.t("Select the language you want to learn (required)")
                }
                style={styles.dropDown}
              />

              {userData.languageTwo ? (
                <Text
                  style={{
                    fontFamily: "semiBold",
                    fontSize: 16,
                    marginTop: 10,
                    color: colors.black,
                  }}
                >
                  {i18n.t("Find native speakers in")}:
                </Text>
              ) : (
                <Text
                  style={{
                    fontFamily: "semiBold",
                    fontSize: 16,
                    marginTop: 10,
                    color: colors.black,
                  }}
                >
                  {i18n.t("Connect with native speakers in")}:
                </Text>
              )}
              <DropDownPicker
                labelStyle={{
                  fontSize: 16,
                  fontFamily: "medium",
                  color: colors.black,
                }}
                textStyle={{
                  fontSize: 16,
                  fontFamily: "medium",
                  color: colors.black,
                }}
                searchable={true}
                searchPlaceholder="Enter a language "
                autoScroll={true}
                open={open3}
                value={value3}
                items={lang2}
                setOpen={setOpen3}
                setValue={setValue3}
                setItems={setLang2}
                listMode="MODAL"
                onChangeValue={(value) => {
                  saveHandlerLanguage();
                }}
                placeholder={
                  userData.languageTwo
                    ? userData.languageTwo
                    : i18n.t(
                        "Select an additional language you want to learn (optional)"
                      )
                }
                style={styles.dropDown}
              />
            </View>
            <View style={styles.languageSelectContainer}>
              {romanized ? (
                <View
                  style={
                    {
                      // flexDirection: "row",
                      // alignItems: "center",
                      // justifyContent: "center",
                    }
                  }
                >
                  <Text
                    style={{
                      color: colors.black,
                      fontFamily: "regular",
                    }}
                  >
                    Romanized ABC
                  </Text>
                  <TouchableOpacity
                    onLongPress={() => {
                      Alert.alert(
                        "Romanization",
                        "Romanized translation is a phonetic translation of the language you are learning. It is useful for beginners to learn the pronunciation of the language they are learning. For example, if you are learning Chinese, you can choose to display the romanized translation of the Chinese characters. If you are learning English, you can choose to display the romanized translation of the English words."
                      );
                    }}
                    onPress={toggleRomanized}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 10,
                      paddingBottom: 2,
                      left: 2,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="toggle-switch"
                      size={40}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={
                    {
                      // alignItems: "center",
                      // justifyContent: "center",
                    }
                  }
                >
                  <Text
                    style={{
                      color: colors.black,
                      fontFamily: "regular",
                    }}
                  >
                    Characters 字数
                  </Text>
                  <TouchableOpacity
                    onLongPress={() => {
                      Alert.alert(
                        "Romanization",
                        "Romanized translation is a phonetic translation of the language you are learning. It is useful for beginners to learn the pronunciation of the language they are learning. For example, if you are learning Chinese, you can choose to display the romanized translation of the Chinese characters. If you are learning English, you can choose to display the romanized translation of the English words."
                      );
                    }}
                    onPress={toggleRomanized}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 10,
                      left: 2,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="toggle-switch-off-outline"
                      size={40}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.nameContainer}>
              <InputAbout
                id="timeChat"
                icon={"calendar-clock"}
                label={"Chat Availability:             "}
                keyboardType="default"
                autoCapitalize="sentences"
                autoCorrect
                blurOnSubmit={true}
                placeholderMultiLine={true}
                placeholder={"Monday - Friday, 9am - 5pm"}
                iconPack={MaterialCommunityIcons}
                iconSize={26}
                onInputChanged={inputChangedHandler}
                error={formState.inputValidities.timeChat}
                initialState={userData.timeChat}
                initialValue={userData.timeChat}
                maxLength={80}
                numberOfLines={3}
                multiline={true}
                showsVerticalScrollIndicator={false}
              />
              <InputAbout
                id="status"
                icon={"comment-text-outline"}
                label={"Chat Invitation:"}
                keyboardType="default"
                autoCapitalize="sentences"
                autoCorrect
                blurOnSubmit={true}
                placeholderMultiLine={true}
                placeholder={"I am looking for a language partner!"}
                iconPack={MaterialCommunityIcons}
                iconSize={26}
                onInputChanged={inputChangedHandler}
                error={formState.inputValidities.status}
                initialState={userData.status}
                initialValue={userData.status}
                maxLength={80}
                numberOfLines={3}
                multiline={true}
                showsVerticalScrollIndicator={false}
              />
              {/* <Text></Text> */}
              <InputAbout
                numberOfLines={4}
                id="about"
                label={"About Me:"}
                icon={"book"}
                placeholder={
                  ("Share your language goals and more with other people!",
                  i18n.t(
                    "Share your language goals and more with other people!"
                  ))
                }
                iconPack={Feather}
                iconSize={24}
                autoCapitalize={"none"}
                onInputChanged={inputChangedHandler}
                error={formState.inputValidities.about}
                initialState={userData.about}
                initialValue={userData.about}
                style={{ height: 100 }}
                maxLength={150}
                multiline={true}
              />
            </View>

            {showSuccessMessage && (
              <Text
                style={{
                  color: "green",
                  textAlign: "center",
                  fontFamily: "semiBold",
                }}
              >
                Successfully updated!
              </Text>
            )}
            {isLoading ? (
              <ActivityIndicator
                size="large"
                color={colors.primary}
                style={{ marginTop: 20 }}
              />
            ) : (
              <SubmitButtonLogin
                title={("Done", i18n.t("Done"))}
                onPress={dirctionsHandler}
                // disabled={!formState.formIsValid}
                style={{ marginTop: 20, borderRadius: 10 }}
                color={colors.orange}
              />
            )}
            <SubmitButtonLogin
              title={("Account settings", i18n.t("Account settings"))}
              // disabled={!formState.formIsValid}
              onPress={() =>
                props.navigation.navigate("accountSetting", {
                  userId: userData.id,
                })
              }
              style={{ marginBottom: 40, borderRadius: 10 }}
              color={colors.defaultTextColor}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SettingsScreen;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: Platform.isPad ? 170 : 0,
    flex: 1,
  },
  containerKeyboard: {
    flex: 1,
    backgroundColor: "white",
  },
  formContainer: {
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    width: "100%",
    maxWidth: Platform.isPad ? 900 : 400,
    padding: 20,
  },
  buttonAddFriend: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "black",
    color: "black",
    height: 50,
    width: 200,
    // borderWidth: 1,
  },
  buttonContainerAddFriends: {
    marginTop: 20,
    borderRadius: 5,
    backgroundColor: "white",
    color: "black",
    height: 30,
    width: 150,
    // borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainerAddFriends: {
    alignItems: "center",
    justifyContent: "center",
    color: "black",
  },
  buttonTextAddFriends: {
    color: colors.defaultTextColor,
    fontSize: 15,
    marginBottom: 10,
    fontWeight: "bold",
    fontFamily: "bold",
  },
  buttonContainerAll: {
    flexDirection: "row",
    alignItems: "space-between",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: `8%`,
  },
  languageContainer: {
    flexDirection: "row",
    // borderBottomColor: colors.lightGrey,
    // borderBottomWidth: 1,
  },
  arrowContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
  },
  text: {
    color: colors.defaultTextColor,
    fontSize: 18,
    textAlign: "center",
    fontFamily: "regular",
  },
  dropDown: {
    backgroundColor: colors.lightGrey,
    borderColor: "lightgrey",
    borderRadius: 10,
    marginBottom: 20,
    borderBottomEndRadius: 0,
    marginTop: 20,
    marginBottom: 5,
    zIndex: 1000,
    elevation: 1000,
  },
  nameContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    // borderBottomColor: colors.black,
    // borderBottomWidth: 1,
    paddingBottom: 10,
  },
  headers: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "bold",
    color: colors.defaultTextColor,
    marginBottom: 10,
  },
  languageSelectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,

    paddingBottom: 10,
  },
  invitecontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    fontFamily: "bold",
    paddingBottom: 10,
  },
  homeContainer: {
    marginLeft: 20,
  },
  defaultImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.lightGrey,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowIcon: {
    color: colors.defaultTextColor,
    fontSize: 20,
    marginTop: 40,
    opacity: 0.5,
  },
  textExplain: {
    color: colors.grey,
    fontSize: 15,
    textAlign: "center",
    fontFamily: "regular",
  },
  hiddenContainer: {
    marginLeft: "82%",
  },
  heartIcon: {
    marginLeft: Platform.isPad ? 600 : 126,
    marginBottom: 18,
    opacity: 0.8,
  },
  fullNameText: {
    marginTop: 45,
    // fontSize: 20,
    fontSize: Platform.isPad ? 35 : 22,
    fontFamily: "bold",
    color: colors.black,
    fontFamily: "bold",
    overflow: "hidden",
  },
  starContainer: {
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    color: "#ffb300", // Adjust the color as needed
    marginRight: 3, // Adjust the spacing between stars
  },
  uploadText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  uploadSubText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
});
