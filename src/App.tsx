import './App.css'

//*/
import { ClockIcon } from '@heroicons/react/outline'
///*
//import { getContext } from 'svelte';
import {
  ActionHash,
  AppSignal,
  AppWebsocket,
  InstalledAppInfo,
  Record,
} from '@holochain/client'
import { decode } from '@msgpack/msgpack'
import { format } from 'date-fns'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import { useEffect, useState } from 'react'
import Div100vh from 'react-div-100vh'
import { convertCompilerOptionsFromJson } from 'typescript'

import { AlertContainer } from './components/alerts/AlertContainer'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { DatePickerModal } from './components/modals/DatePickerModal'
import { InfoModal } from './components/modals/InfoModal'
import { MigrateStatsModal } from './components/modals/MigrateStatsModal'
import { SettingsModal } from './components/modals/SettingsModal'
import { StatsModal } from './components/modals/StatsModal'
import { Navbar } from './components/navbar/Navbar'
import {
  DATE_LOCALE,
  DISCOURAGE_INAPP_BROWSERS,
  LONG_ALERT_TIME_MS,
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
  WELCOME_INFO_MODAL_MS,
} from './constants/settings'
import {
  CORRECT_WORD_MESSAGE,
  DISCOURAGE_INAPP_BROWSER_TEXT,
  GAME_COPIED_MESSAGE,
  HARD_MODE_ALERT_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  SHARE_FAILURE_TEXT,
  WIN_MESSAGES,
  WORD_NOT_FOUND_MESSAGE,
} from './constants/strings'
import { useAlert } from './context/AlertContext'
import { appInfoContext } from './contexts'
import { isInAppBrowser } from './lib/browser'
import {
  getStoredIsHighContrastMode, //loadGameStateFromLocalStorage,
  //saveGameStateToLocalStorage,
  setStoredIsHighContrastMode,
} from './lib/localStorage'
import {
  addStatsForCompletedGame,
  loadDefaultStats,
  loadStats,
} from './lib/stats'
import {
  findFirstUnusedReveal,
  getGameDate,
  getIsLatestGame,
  isWinningWord,
  isWordInWordList,
  setGameDate,
  solution,
  solutionGameDate,
  unicodeLength,
} from './lib/words'
//import { appWebsocketContext, appInfoContext } from './contexts';
import { StoredGameState, UpdateStoredGameState } from './types/dna_0/zome_0'
import { GameStats } from './types/dna_0/zome_1'

//<!--script lang = "ts"-->
//console.log("before Holochain code");
let gameWasWon: boolean = false
let gameWasLost: boolean = false
let gameIsOn: boolean = false
let isNewGuess: boolean = false
let todayStart: boolean = true
let testVar: String = 'testVar before callZome'
let holBool: String = '1'
let appInfo: InstalledAppInfo
let gStats: GameStats = loadDefaultStats()
let statsUpdated: number = 0
let loaded: StoredGameState = {
  local: new Date().toString(),
  guesses: [],
  solution: '',
}
console.log(
  'loaded value changed guesses[0], solution: ' +
    loaded.guesses[0] +
    ',' +
    loaded.solution
)
//let appInfoBool: boolean = false;
let client: AppWebsocket
let connectString: String = 'connecth'
let actionHash: ActionHash
let isLoaded: boolean = false
localStorage.setItem('holConnect', 'No')
let todaysGameLoaded = 0
let actionHashString = String(localStorage.getItem('actionHashString'))
// let und: string = localStorage.getItem("actionHashString"));
// }

//actionHash = new TextEncoder().encode(actionHashString);
actionHash = Uint8Array.from(
  actionHashString.split(',').map((x) => parseInt(x, 10))
)
//localStorage.getItem("actionHashString"):und);

///*

//const { appWS } = getContext(appWebsocketContext);
//let appWebsocket: AppWebsocket = appWS.getAppWebsocket();

//const dispatch = createEventDispatcher();
export function holMount() {
  console.log('in holMount, before hMount')
  const hMount = async () => {
    //experiments.topLevelAwait(true)
    console.log('in hMount, before Admin connect')
    /*  const admin = await AdminWebsocket.connect(`ws://localhost:44179`, 30000)
    console.log ("in hMount, after Admin connect");
    if(!admin) {console.log("Adminwebsocket.connect is null");}
  await admin.generateAgentPubKey()
  console.log ("in hMount, after AgentPubKey");*/

    //Set experiments.topLevelAwait: true;
    console.log('in hMount before signalCb')

    const signalCb = (signal: AppSignal) => {
      console.log('SIGNAL:', signal)
      // impl...
      // resolve()
    }
    console.log('in hMount after signalCb, before connect')
    // const TIMEOUT = 12000
    // default timeout is set to 12000
    try {
      client = await AppWebsocket.connect(`ws://localhost:8000`)
    } catch (e) {
      console.log('AppWebsocket failed:', e)
    }
    if (!client) {
      console.log('Appwebsocket.connect is null')
    }
    console.log('Appwebsocket.connect:', client)

    //let {appInfo}: InstalledAppInfo;
    // document.createElement("script");
    // setContext(appInfoContext, { getAppInfo: () => appInfo });
    // const { appIC } = getContext(appInfoContext);
    //let insAppId: InstalledAppId = client.overrideInstalledAppId;
    //let appInfoReq: AppInfoRequest = {insAppId}
    //let insAppId : InstalledAppId = 'hwordle';

    //const t = async() => {
    console.log('in t')
    const insAppId = 'hwordle'
    //let appInfoReq: AppInfoRequest = {insAppId}
    appInfo = await client.appInfo({ installed_app_id: insAppId })
    if (!appInfo) {
      console.log('appInfo after await - null')
    } else {
      console.log('appInfo after await not null' + appInfo)
    }
  }
  //*/

  hMount()

  console.log(hMount)
  console.log('after Holochain code ' + testVar)
}

export function callHapp() {
  if (!appInfo) {
    console.log('appInfo is null')
    return
  } else {
    const cHapp = async () => {
      const cellData = await appInfo.cell_data
      const cell_id = await cellData[0].cell_id
      //const cellIds = admin.listCellIds;
      //const cellData = signalCb.data;
      //const cellReq = cellIds.Requester;
      //const cellData = cellIds.void;
      //const cellData = appInfo["hwordle"];

      //console.log ("after connect "+appInfo.cell_data[0].cell_id);
      // default timeout set here (30000) will overwrite the defaultTimeout(12000) set above
      console.log('in callHapp cHapp - code before callZome' + testVar)
      testVar = await client.callZome(
        {
          cap_secret: null,
          cell_id: cell_id,
          zome_name: 'zome_0',
          fn_name: 'get_test',
          provenance: cell_id[1],
          payload: connectString,
        },
        30000
      )
      console.log('in callHapp cHapp - code after callZome' + testVar)
    }
    console.log('outout is ' + testVar)
    cHapp()
    console.log(cHapp)
  }
  console.log('callHapp else code ran - did callZome work? ' + testVar)
  return
}

export function callHappSaveGame(guesses: string[], solution: string) {
  if (!appInfo) {
    console.log(
      'appInfo is null. guesses[0], solution: ' + guesses[0] + ',' + solution
    )
    return
  } else {
    const cHappSaveGame = async () => {
      const cellData = await appInfo.cell_data
      const cell_id = await cellData[0].cell_id
      const gameState: StoredGameState = {
        local: new Date().toString(),
        guesses: guesses,
        solution: solution,
      }
      console.log(
        'gameState guesses: ' +
          gameState.guesses[0] +
          ',' +
          gameState.guesses[1] +
          ',' +
          gameState.guesses[2] +
          ',' +
          gameState.guesses[3]
      )

      console.log(
        'in callHappSaveGame cHappSaveGame - code before callZome' +
          new TextDecoder('utf-8').decode(actionHash)
      )
      if (todayStart) {
        actionHash = await client.callZome(
          {
            cap_secret: null,
            cell_id: cell_id,
            zome_name: 'zome_0',
            fn_name: 'save_game_to_local_storage',
            provenance: cell_id[1],
            payload: gameState,
          },
          30000
        )
        //actionHashString = new TextDecoder("utf-8").decode(actionHash);
        actionHashString = actionHash.toString()
        localStorage.setItem('actionHashString', actionHashString)
        console.log(
          'in callHappSaveGame cHappSaveGame - code after callZome' +
            actionHashString
        )
        todayStart = false
        //localStorage.setItem("actionHashString",actionHashString);
      } else {
        console.log('callHappUpdateGame has to be coded here')
        let loadHash: ActionHash = actionHash
        const updatedGameState: UpdateStoredGameState = {
          original_action_hash: loadHash,
          updated_stored_game_state: gameState,
        }
        const updateActionHash = await client.callZome(
          {
            cap_secret: null,
            cell_id: cell_id,
            zome_name: 'zome_0',
            fn_name: 'update_game_to_local_storage',
            provenance: cell_id[1],
            payload: updatedGameState,
          },
          30000
        )
        actionHashString = updateActionHash.toString()
        localStorage.setItem('actionHashString', actionHashString)
        actionHash = updateActionHash
        todayStart = false
      }
    }
    cHappSaveGame()
  }
  console.log(
    'callHappSaveGame else code ran - did callZome work? ' +
      new TextDecoder('utf-8').decode(actionHash)
  )
  //App();
  return
}

export function callHappLoadGame() {
  loaded = { local: new Date().toString(), guesses: [''], solution: '' }
  if (!appInfo) {
    console.log('appInfo is null')
    return loaded
  } else {
    const cHappLoadGame = async () => {
      const cellData = await appInfo.cell_data
      const cell_id = await cellData[0].cell_id
      /*  const gameState: StoredGameState = {
    guesses: guesses,
        content: solution
  };*/

      console.log(
        'in callHappLoadGame cHappLoadGame - code before loadHash assigned value' +
          actionHashString
      )
      let loadHash: ActionHash = actionHash
      /* if (!actionHash) {console.log("actionHash is null")} else {
   loadHash = actionHash;
   }*/
      console.log(
        'in callHappLoadGame cHappLoadGame - code after loadHash assigned value: ' +
          new TextDecoder('utf-8').decode(loadHash)
      )
      const record: Record | undefined = await client.callZome(
        {
          cap_secret: null,
          cell_id: cell_id,
          zome_name: 'zome_0',
          fn_name: 'load_game_state_from_local_storage',
          provenance: cell_id[1],
          payload: loadHash,
        },
        30000
      )
      console.log(
        'in callHappLoadGame cHappLoadGame - code after callZome' + testVar
      )
      if (record) {
        console.log('in if record before decode')
        loaded = decode((record.entry as any).Present.entry) as StoredGameState
        console.log(
          'in if record after decode' +
            loaded.solution +
            loaded.guesses[0] +
            loaded.guesses[1]
        )
        let tempDate: Date = new Date()
        let tempDate1: Date = new Date(loaded.local)
        if (
          tempDate1.getFullYear() == tempDate.getFullYear() &&
          tempDate1.getMonth() == tempDate.getMonth() &&
          tempDate1.getDate() == tempDate.getDate()
        ) {
          console.log("we already have today's entry, so update has to be run")
          todayStart = false
        }
      }
    }
    console.log('outout is ')
    cHappLoadGame()
    console.log(cHappLoadGame)
  }
  console.log('callHappLoadGame else code ran - did callZome work? ')
}

function App() {
  console.log('start of App')

  let isParallelConnect: boolean = false
  const isLatestGame = getIsLatestGame()
  const gameDate = getGameDate()
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const {
    showError: showErrorAlert,
    showSuccess: showSuccessAlert,
    welcomeBack: showWelcomeBack,
  } = useAlert()
  const [currentGuess, setCurrentGuess] = useState('')
  const [appInfoBool, setAppInfoBool] = useState(false)
  const [isGameWon, setIsGameWon] = useState(false)
  const [isGameOn, setIsGameOn] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isDatePickerModalOpen, setIsDatePickerModalOpen] = useState(false)
  const [isMigrateStatsModalOpen, setIsMigrateStatsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [currentRowClass, setCurrentRowClass] = useState('')
  const [isGameLost, setIsGameLost] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : prefersDarkMode
      ? true
      : false
  )
  const [isHighContrastMode, setIsHighContrastMode] = useState(
    getStoredIsHighContrastMode()
  )
  const [isRevealing, setIsRevealing] = useState(false)
  if (localStorage.getItem('gameDate') != new Date().toLocaleDateString()) {
    localStorage.setItem('gameDate', new Date().toLocaleDateString())
    localStorage.setItem('actionHashString', '')
  }

  const [isHardMode, setIsHardMode] = useState(
    localStorage.getItem('gameMode')
      ? localStorage.getItem('gameMode') === 'hard'
      : false
  )

  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal
    //if (!loadGameStateFromLocalStorage(true)) {
    if (localStorage.getItem('gameDate') != new Date().toLocaleDateString()) {
      setTimeout(() => {
        console.log(
          'localgameDate on loading is ' + localStorage.getItem('gameDate')
        )
        setIsInfoModalOpen(true)
      }, WELCOME_INFO_MODAL_MS)
      localStorage.setItem('gameDate', new Date().toLocaleDateString())
      localStorage.setItem('actionHashString', '')
      console.log(
        'localgameDate has been updated to ' + localStorage.getItem('gameDate')
      )
    }
  })

  useEffect(() => {
    DISCOURAGE_INAPP_BROWSERS &&
      isInAppBrowser() &&
      showErrorAlert(DISCOURAGE_INAPP_BROWSER_TEXT, {
        persist: false,
        durationMs: 7000,
      })
  }, [showErrorAlert])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [isDarkMode, isHighContrastMode])

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const handleHardMode = (isHard: boolean) => {
    if (
      loaded.guesses.length === 0 ||
      localStorage.getItem('gameMode') === 'hard'
    ) {
      setIsHardMode(isHard)
      localStorage.setItem('gameMode', isHard ? 'hard' : 'normal')
    } else {
      showErrorAlert(HARD_MODE_ALERT_MESSAGE)
    }
  }

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast)
    setStoredIsHighContrastMode(isHighContrast)
  }

  const clearCurrentRowClass = () => {
    setCurrentRowClass('')
  }

  useEffect(() => {
    console.log(
      'isGameWon:' +
        isGameWon +
        'isGameLost:' +
        isGameLost +
        'isGameOn:' +
        isGameOn
    )
    if (isGameWon) {
      console.log('inside useEffect isGameWon')
      /*const won = async() => {
      console.log("inside useEffect isGameWon about to call SaveGame");
      await callHappSaveGame(guesses, solution);
      console.log("inside useEffect isGameWon called SaveGame");*/
      const winMessage =
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
      const delayMs = REVEAL_TIME_MS * solution.length

      showSuccessAlert(winMessage, {
        delayMs,
        onClose: () => setIsStatsModalOpen(true),
      })
    }

    if (isGameLost) {
      /*const lost = async() => {
      await callHappSaveGame(guesses, solution);*/
      setTimeout(() => {
        setIsStatsModalOpen(true)
      }, (solution.length + 1) * REVEAL_TIME_MS)
    }
    if (isGameOn) {
      console.log('UseEffect Game on')
      const welcomeMessage = 'Welcome Back'
      const delayMs = REVEAL_TIME_MS * solution.length

      showSuccessAlert(welcomeMessage, {
        delayMs,
        onClose: () => {
          gameIsOn = false
          setIsGameOn(false)
        },
      })
      /* const winMessage =
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
      const delayMs = REVEAL_TIME_MS * solution.length

      showSuccessAlert(winMessage, {
        delayMs,
        onClose: () => setIsStatsModalOpen(true),
      })*/
    }
  }, [isGameWon, isGameLost, showSuccessAlert, isGameOn])

  const onChar = (value: string) => {
    let tempDate: Date = new Date()
    let tempDate1: Date = new Date(loaded.local)
    if (
      !(
        tempDate1.getFullYear() === tempDate.getFullYear() &&
        tempDate1.getMonth() === tempDate.getMonth() &&
        tempDate1.getDate() === tempDate.getDate()
      )
    ) {
      window.location.reload()
      return
    }

    if (
      unicodeLength(`${currentGuess}${value}`) <= solution.length &&
      loaded.guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setCurrentGuess(`${currentGuess}${value}`)
    }
  }

  const onDelete = () => {
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
    )
  }

  const onEnter = async () => {
    let tempDate: Date = new Date()
    let tempDate1: Date = new Date(loaded.local)
    if (
      !(
        tempDate1.getFullYear() === tempDate.getFullYear() &&
        tempDate1.getMonth() === tempDate.getMonth() &&
        tempDate1.getDate() === tempDate.getDate()
      )
    ) {
      window.location.reload()
      return
    }
    if (isGameWon || isGameLost) {
      return
    }

    if (!(unicodeLength(currentGuess) === solution.length)) {
      setCurrentRowClass('jiggle')
      //setAppInfoBool(true);
      //    setIsRevealing(true)
      //  isLoaded = true;
      //console.log ("isLoaded value is set to "+isLoaded);
      // turn this back off after all
      // chars have been revealed
      //setTimeout(() => {
      //setIsRevealing(false)
      //}, REVEAL_TIME_MS * solution.length)
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    if (!isWordInWordList(currentGuess)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    // enforce hard mode - all guesses must contain all previously revealed letters
    if (isHardMode) {
      const firstMissingReveal = findFirstUnusedReveal(
        currentGuess,
        loaded.guesses
      )
      if (firstMissingReveal) {
        setCurrentRowClass('jiggle')
        return showErrorAlert(firstMissingReveal, {
          onClose: clearCurrentRowClass,
        })
      }
    }

    setIsRevealing(true)
    // turn this back off after all
    // chars have been revealed
    setTimeout(() => {
      setIsRevealing(false)
    }, REVEAL_TIME_MS * solution.length)

    const winningWord = isWinningWord(currentGuess)

    if (
      unicodeLength(currentGuess) === solution.length &&
      loaded.guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      console.log('inside big if in onEnter')
      loaded.guesses.push(currentGuess)
      setCurrentGuess('')
      await callHappSaveGame(loaded.guesses, solution)

      if (winningWord) {
        if (isLatestGame) {
          gStats = await addStatsForCompletedGame(
            loaded.guesses.length - 1,
            client,
            appInfo
          )
          console.log(
            'after gStats updated: ' +
              gStats.total_games +
              gStats.win_distribution[0] +
              gStats.win_distribution[1] +
              gStats.win_distribution[2] +
              gStats.win_distribution[3] +
              gStats.win_distribution[4] +
              gStats.win_distribution[5] +
              gStats.win_distribution[6]
          )
        }
        return setIsGameWon(true)
      }

      if (loaded.guesses.length === MAX_CHALLENGES) {
        if (isLatestGame) {
          gStats = await addStatsForCompletedGame(
            loaded.guesses.length,
            client,
            appInfo
          )
        }
        setIsGameLost(true)
        showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
          persist: true,
          delayMs: REVEAL_TIME_MS * solution.length + 1,
        })
      }
    }
  }
  const cHappLoadGame = async () => {
    let loaded3: StoredGameState = {
      local: new Date().toString(),
      guesses: [],
      solution: '',
    }
    if (!appInfo) {
      console.log('in cHappLoadGame. appInfo is null!!!')
      return loaded3
    }
    const cellData = await appInfo.cell_data
    const cell_id = await cellData[0].cell_id

    console.log(
      'in cHappLoadGame - code before loadHash assigned value' +
        actionHashString
    )
    let loadHash: ActionHash = actionHash
    /* if (!actionHash) {console.log("actionHash is null")} else {
   loadHash = actionHash;
   }*/
    console.log(
      'in cHappLoadGame - code after loadHash assigned value: ' +
        new TextDecoder('utf-8').decode(loadHash)
    )
    const record: Record | undefined = await client.callZome(
      {
        cap_secret: null,
        cell_id: cell_id,
        zome_name: 'zome_0',
        fn_name: 'load_game_state_from_local_storage',
        provenance: cell_id[1],
        payload: loadHash,
      },
      30000
    )
    console.log('in cHappLoadGame - code after callZome' + todayStart)
    if (record) {
      console.log('in if record before decode')
      loaded3 = decode((record.entry as any).Present.entry) as StoredGameState
      console.log(
        'in if record after decode' +
          loaded3.solution +
          loaded3.guesses[0] +
          loaded3.guesses[1] +
          loaded3.guesses[2] +
          loaded3.guesses[3]
      )
      let tempDate: Date = new Date()
      let tempDate1: Date = new Date(loaded3.local)
      if (
        loaded3.guesses.length > 0 &&
        tempDate1.getFullYear() == tempDate.getFullYear() &&
        tempDate1.getMonth() == tempDate.getMonth() &&
        tempDate1.getDate() == tempDate.getDate()
      ) {
        console.log("we already have today's entry, so update has to be run")
        todayStart = false
      } else {
        console.log(
          'date changed. The date in Holochain entry is: ' +
            tempDate1.getFullYear() +
            tempDate1.getMonth() +
            tempDate1.getDate()
        )
        localStorage.setItem('actionHashString', '')
        loaded3 = { local: new Date().toString(), guesses: [], solution: '' }
        todayStart = true
        loaded = loaded3
        return loaded3
      }
    }
    console.log(
      'in cHappLoadGame just before return: ' +
        loaded3.local +
        loaded3.solution +
        'guesses[0]:' +
        loaded3.guesses[0] +
        'guesses[1]:' +
        loaded3.guesses[1]
    )
    return loaded3
  }

  const hoMount = async () => {
    let loaded2: StoredGameState = loaded
    console.log('in hoMount, before Admin connect')
    /*  const admin = await AdminWebsocket.connect(`ws://localhost:44179`, 30000)
    console.log ("in hoMount, after Admin connect");
    if(!admin) {console.log("Adminwebsocket.connect is null");}
  await admin.generateAgentPubKey()
  console.log ("in hoMount, after AgentPubKey");*/

    console.log('in hoMount before signalCb')

    const signalCb = (signal: AppSignal) => {
      // impl...
      // resolve()
    }
    console.log('in hoMount after signalCb, before connect')
    const appPort = process.env.REACT_APP_HC_PORT
    console.log('connecting to:', appPort, process.env)
    // const TIMEOUT = 12000
    // default timeout is set to 12000
    client = await AppWebsocket.connect(
      `ws://localhost:${appPort}`,
      12000,
      signalCb
    )
    if (!client) {
      console.log('Appwebsocket.connect is null')
    }

    const insAppId = 'hwordle'
    //let appInfoReq: AppInfoRequest = {insAppId}
    console.log('{ installed_app_id: insAppId }', insAppId)
    appInfo = await client.appInfo({ installed_app_id: insAppId })
    if (!appInfo) {
      console.log('appInfo after await - null')
    } else {
      if (!isLoaded) {
        console.log(
          'appInfo after await not null' +
            appInfo +
            loaded2.guesses[0] +
            loaded2.guesses[1]
        )
        isLoaded = true
        console.log('isLoaded value is ' + isLoaded)
        try {
          gStats = await loadStats(client, appInfo)
        } catch (err) {
          console.log(err)
        }
        console.log('initiating gStats total_games: ' + gStats.total_games)
      } else {
        console.log('appInfo already loaded')
        isParallelConnect = true
        return
      }

      console.log('at the end of else block of if(!appInfo)')
    }

    console.log('before checking actioHashString')
    if (localStorage.getItem('actionHashString') == '') {
      todaysGameLoaded = 0
      return
    }
    console.log('before cHappLoadGame is called')
    loaded2 = await cHappLoadGame()
    console.log(
      'before hoMount return loaded2:  ' +
        loaded2.local +
        'guesses[0]:' +
        loaded2.guesses[0] +
        'guesses[1]:' +
        loaded2.guesses[1] +
        loaded2.solution
    )

    if (loaded2?.solution !== solution) {
      todayStart = true
      return []
    }
    let tempDate: Date = new Date()
    let tempDate1: Date = new Date(loaded2.local)
    if (
      loaded2.guesses.length > 0 &&
      tempDate1.getFullYear() == tempDate.getFullYear() &&
      tempDate1.getMonth() == tempDate.getMonth() &&
      tempDate1.getDate() == tempDate.getDate()
    ) {
      console.log('date has not changed')
      console.log('system date is ' + tempDate)
      console.log('Holochain entry date is ' + tempDate1)
      todayStart = false
    } else {
      todayStart = true
      console.log('date has changed')
      console.log(
        'system date is ' +
          tempDate.getFullYear() +
          tempDate.getMonth() +
          tempDate.getDate()
      )
      console.log(
        'Holochain entry date is ' +
          tempDate1.getFullYear() +
          tempDate1.getMonth() +
          tempDate1.getDate()
      )
      return []
    }
    gameWasWon = loaded2.guesses.includes(solution)
    console.log('gameWasWon: ' + gameWasWon)
    if (gameWasWon) {
      await setIsGameWon(true)
      console.log('isGameWon: ' + isGameWon)
    }
    if (loaded2.guesses.length === MAX_CHALLENGES && !gameWasWon) {
      gameWasLost = true
      setIsGameLost(true)
      showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
        persist: true,
      })
    } else {
      console.log('setting Game on')
      gameIsOn = !gameWasWon
      if (gameIsOn) {
        await setIsGameOn(true)
        console.log('Finished setting Game on')
      }
    }
    loaded = loaded2
    console.log('loaded is now the output of cHappLoadGame' + loaded.guesses[0])
    return loaded2
  }

  //if (!isParallelConnect) {
  if (gameWasWon && !isGameWon) {
    console.log('game was won')
    setIsGameWon(true)
    console.log('is game won is ' + isGameWon)
    isParallelConnect = true
  }
  if (gameWasLost && !isGameLost) {
    console.log('game was lost')
    setIsGameLost(true)
    console.log('is game lost is ' + isGameLost)
    isParallelConnect = true
  }
  if (gameIsOn && !isGameOn) {
    console.log('game is on second loop')
    setIsGameOn(true)
    console.log('is game On is ' + isGameOn)
    isParallelConnect = true
  }
  if (localStorage.getItem('holConnect') == 'No' && !isParallelConnect) {
    const loadTodaysGame = async () => {
      await hoMount()
      if (!isParallelConnect) {
        console.log('holConnect value is ' + localStorage.getItem('holConnect'))
        if (isLoaded) {
          console.log('holConnect being changed to Yes')
          localStorage.setItem('holConnect', 'Yes')
          loaded.solution = solution
        }
        console.log('after hoMount in holConnect check')
        console.log(
          'after hoMount in holConnect check loaded.guesses updated: ' +
            loaded.guesses[0] +
            ',' +
            loaded.guesses[1] +
            ',' +
            loaded.guesses[2] +
            ',' +
            loaded.guesses[3]
        )
        /*if ((!todayStart)) {
			  	
			  	todaysGameLoaded++;
			  	console.log("todaysGameLoaded(holochain being connected) is "+todaysGameLoaded);
			  	if((todaysGameLoaded == 1)) {
		  	  console.log("setting guesses as holochain entry already updated today(holochain being connected)"+loaded.guesses[0]);
			  setGuesses([...loaded.guesses]);

			  console.log("guesses(holochain being connected) are "+guesses[0]+guesses[1]);
				} else {console.log("not 1");}
			  	
			  	}*/
      }
    }
    loadTodaysGame()
  } /*else {
	  if (!isParallelConnect) {
		  console.log("holochain already connected");
		  console.log("todaysGameLoaded (holochain already connected, before if) is "+todaysGameLoaded);
		  if(todaysGameLoaded == 2) {
		  	  console.log("setting guesses as holochain entry already updated today(holochain already connected)");
			  setGuesses([...loaded.guesses]);
			  console.log("guesses(holochain already connected) are "+guesses[0]+guesses[1]);
				}
			todaysGameLoaded++;
			console.log("todaysGameLoaded (holochain already connected, after if) is "+todaysGameLoaded);
		  }
		 }*/
  isParallelConnect = false
  //} else {isParallelConnect = false;}

  /* useEffect(() => {
    console.log ("in useEffect loaded at the start");
    if ((loaded.guesses.length > 0) && (loaded.guesses[0]!='') && isLoaded) {
    console.log ("in useEffect loaded.guesses.length>0 and first guess not blank, before setGuesses");
    setGuesses(loaded.guesses);
    console.log ("in useEffect loaded loaded.guesses.length>0 and first guess not blank, setGuesses done");
    }
    console.log ("in useEffect loaded loaded.guesses.lenth!>0 OR first guess blank or !isLoaded");
  }, [todaysGameLoaded])*/
  /*useEffect(() => {
    if (appInfoBool) {
      console.log("useEffect working when appInfoBool turned to "+appInfoBool);
    }
    },[appInfoBool])*/

  //console.log("Just before statsUpdated, gStats.total_games: " +gStats.total_games);

  return (
    <Div100vh>
      <div className="flex h-full flex-col">
        <Navbar
          setIsInfoModalOpen={setIsInfoModalOpen}
          setIsStatsModalOpen={setIsStatsModalOpen}
          setIsDatePickerModalOpen={setIsDatePickerModalOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
        />

        {!isLatestGame && (
          <div className="flex items-center justify-center">
            <ClockIcon className="h-6 w-6 stroke-gray-600 dark:stroke-gray-300" />
            <p className="text-base text-gray-600 dark:text-gray-300">
              {format(gameDate, 'd MMMM yyyy', { locale: DATE_LOCALE })}
            </p>
          </div>
        )}

        <div className="mx-auto flex w-full grow flex-col px-1 pt-2 pb-8 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 short:pt-2">
          <div className="flex grow flex-col justify-center pb-6 short:pb-2">
            <Grid
              solution={solution}
              guesses={loaded.guesses}
              currentGuess={currentGuess}
              isRevealing={isRevealing}
              currentRowClassName={currentRowClass}
            />
          </div>
          <Keyboard
            onChar={onChar}
            onDelete={onDelete}
            onEnter={onEnter}
            solution={solution}
            guesses={loaded.guesses}
            isRevealing={isRevealing}
          />
          <InfoModal
            isOpen={isInfoModalOpen}
            handleClose={() => {
              setIsInfoModalOpen(false)
              let tempDate: Date = new Date()
              let tempDate1: Date = new Date(loaded.local)
              if (
                !(
                  tempDate1.getFullYear() === tempDate.getFullYear() &&
                  tempDate1.getMonth() === tempDate.getMonth() &&
                  tempDate1.getDate() === tempDate.getDate()
                )
              ) {
                window.location.reload()
              }
            }}
          />
          <StatsModal
            isOpen={isStatsModalOpen}
            handleClose={() => {
              setIsStatsModalOpen(false)
              let tempDate: Date = new Date()
              let tempDate1: Date = new Date(loaded.local)
              if (
                !(
                  tempDate1.getFullYear() === tempDate.getFullYear() &&
                  tempDate1.getMonth() === tempDate.getMonth() &&
                  tempDate1.getDate() === tempDate.getDate()
                )
              ) {
                window.location.reload()
              }
            }}
            solution={solution}
            guesses={loaded.guesses}
            gameStats={gStats}
            isLatestGame={isLatestGame}
            isGameLost={isGameLost}
            isGameWon={isGameWon}
            handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
            handleShareFailure={() =>
              showErrorAlert(SHARE_FAILURE_TEXT, {
                durationMs: LONG_ALERT_TIME_MS,
              })
            }
            handleMigrateStatsButton={() => {
              setIsStatsModalOpen(false)
              setIsMigrateStatsModalOpen(true)
              console.log('migrate stats button clicked')
            }}
            isHardMode={isHardMode}
            isDarkMode={isDarkMode}
            isHighContrastMode={isHighContrastMode}
            numberOfGuessesMade={loaded.guesses.length}
          />
          <DatePickerModal
            isOpen={isDatePickerModalOpen}
            initialDate={solutionGameDate}
            handleSelectDate={(d) => {
              setIsDatePickerModalOpen(false)
              setGameDate(d)
            }}
            handleClose={() => setIsDatePickerModalOpen(false)}
          />
          <MigrateStatsModal
            isOpen={isMigrateStatsModalOpen}
            handleClose={() => setIsMigrateStatsModalOpen(false)}
          />
          <SettingsModal
            isOpen={isSettingsModalOpen}
            handleClose={() => {
              setIsSettingsModalOpen(false)
              let tempDate: Date = new Date()
              let tempDate1: Date = new Date(loaded.local)
              if (
                !(
                  tempDate1.getFullYear() === tempDate.getFullYear() &&
                  tempDate1.getMonth() === tempDate.getMonth() &&
                  tempDate1.getDate() === tempDate.getDate()
                )
              ) {
                window.location.reload()
              }
            }}
            isHardMode={isHardMode}
            handleHardMode={handleHardMode}
            isDarkMode={isDarkMode}
            handleDarkMode={handleDarkMode}
            isHighContrastMode={isHighContrastMode}
            handleHighContrastMode={handleHighContrastMode}
          />
          <AlertContainer />
        </div>
      </div>
    </Div100vh>
  )
}

export default App
