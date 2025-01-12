import flows_en from '../../images/brief_flows_en.png';
import account_en from '../../images/account_en.png';

export default {

  // Свойства страницы
  page: {
    baseTitle: 'Debit-Credit - Main',
    baseDescription: 'Open library of accounting entries. Debit, credit and double entry. Find. Suggest. Share.',
    searchTitle: 'Debit-Credit - Search',
    searchDescription: 'Looking for double-entries',
  },

  // общие
  general: {
    copy: 'copy',
    or: 'or',
    document: 'Document',
  },

  // заголовок
  header: {
    mainTitle: 'Main',
    searchTitle: 'Search',
    sandBoxTitle: 'Sandbox',
    login: 'Login',
    logout: 'Logout',
  },

  // главная страница
  main: {
    briefTitle: 'The open library of accounting entries',
    briefSubTitle: 'Find, suggest, share',
    buttonFind: 'Search',
    libraryTitle: 'The library that helps',
    librarySearch: 'Find',
    libraryText: 'Just make a search request and get solutions',
    librarySuggest: 'Suggest',
    librarySuggestText: 'Publish the solution in the library in journal entry format',
    libraryShare: 'Share',
    libraryShareText: 'Share your solution. Send a link to the journal entries in the library',

    accountTitle: 'Accounts, stocks and flows',
    accountP1: 'Accounting is the staff of life. Account - the main accounting instrument.',
    accountP2: 'An account is a data structure that describes interrelated indicators of the availability and movement of accounting objects in monetary terms in a certain period of time.',
    accountP3: 'Registration of information on accounting accounts is called reflection of the transaction on the account.',
    accountP4: 'The presence of accounting objects reflected in the corresponding accounts is called the balance: the balance at the beginning (incoming balances) and the balance at the end of the period (outgoing balances).',
    accountP5: 'Operations to increase or decrease indicators on an account are called turnover. Turnovers are recorded in the debit or credit of the account.',
    accountP6: 'Account balances and turnover are integrated: the account balance at the beginning of the period, taking into account the turnover, forms the balance at the end of the period.',
    accountP7: 'In our Sandbox, everything is exactly the same - account balances and account turnover live together.',

    doubleEntryTitle: 'Double entry and accounting entry',
    doubleEntryP1: 'The exact time and place of birth of double entry is impossible to determine, but its widespread distribution began with the publication in Italy in the 15th century of the work of the Italian mathematician Fra Luca Bartolomeo de Pacioli, “Treatise on Accounts and Records,” which for the first time talks about double accounting.',
    doubleEntryP2: 'The accounting method in which each transaction is reflected in two equal entries in the debit and credit of the corresponding accounts is called the double entry method.',
    doubleEntryP3: 'The essence of the double entry method is to generate comprehensive information about the movement of assets and liabilities, income and expenses and the sources of their formation.',
    doubleEntryP4: 'The relationship between accounts that arises as a result of registration using the double entry method is called correspondence of accounts, and accounts are correspondent.',
    doubleEntryP5: 'In our Sandbox, everything is exactly the same - accounting entries are recorded in double entry format.',
  },

  // поиск
  search: {
    searchTitle: 'Search',
    searchSubTitle: 'Looking for a notebook',
    noSearchResult: 'Unfortunately nothing was found :(',
    inputSearchObject: 'Accounting objects, contents of the transaction or postings...',
    searchIn: 'Search in',
    searchDocument: 'document',
    searchName: 'name',
    searchDescription: 'description',
    searchHashTags: 'hashtags',
    buttonFind: 'Find',

  },

  // панель результатов поиска
  searchPanel: {
    results: 'result(s)',
    found: 'Found',
    byquery: 'by request',
    additional: 'more details',
    hide: 'hide',
  },

  // описание полей тетради
  notebook: {
    id: 'ID',
    notebook: 'Notebook',
    create: 'Created(changed)',
    name: 'Name',
    hashtags: 'Hashtags',
    description: 'Description',
    share: 'General access',
    unshare: 'Hide',
    noname: 'Unsaved',
    myNotebook: 'My notebook',
    myDescription: 'Set of transactions',
    myTags: '#MyTag',
    refresh: 'Updated',
  },

  // песочница
  sandbox: {
    menu: {
      new: 'New',
      open: 'Open',
      save: 'Save',
      saveCopy: 'Save copy',
      print: 'Print',
      props: 'Properties',
      share: 'Share',
      unshare: 'Hide',
      calc: 'Calc',
      calcIncome: 'Incomes',
      calcOutcome: 'Outcomes',
      refresh: 'Reload document',
      like: 'Likes',
      view: 'Views',
    },

    grids: {
      incomeTitle: 'Incomes',
      flowTitle: 'Flows',
      outcomeTitle: 'Outcomes',
      account: 'Account',
      debitStock: 'Debit balance',
      creditStock: 'Credit balance',
      accDebit: 'Debit account',
      accCredit: 'Credit account',
      summ: 'Summ',
      flowNote: 'Flow description',
      note: 'Notes',
      contextMenu: {
        addRowUp: 'Add row up',
        addRowDown: 'Add row down',
        removeRow: 'Delete row',
        markSameValues: 'Highlight similar',
      },
    }

  },

  // диалоги
  dialogs: {
    searchWordLimit: 'Search string has to have enough count of symbols',
    hashTagsError: 'Error while getting hashtags',
    enterSearchQuery: 'Please, specify your search query',
    waitPlease: 'Wait a minute please...',
    close: 'Close',
    copy: 'Copy',
    yes: 'Yes',
    no: 'No',
    confirm: 'Confirmation',
    saveOrNo: 'The notebook has been changed. Do you want to save it?',

  },

  // попапы
  popups: {
    signinTitle: 'Sign in',
    signupTitle: 'User registration',
    restorePassTitle: 'Restore password',
    notebookPropTitle: 'Notebook properties',
    selectNotebookTitle: 'Selecting a notebook',

    email: 'Email',
    enterEmail: 'Enter email',
    enterRegEmail: 'Enter registration email',

    password: 'Password',
    enterPassword: 'Enter password',
    newPassword: 'New password',
    enterNewPassword: 'Enter new password',
    changePassword: 'Change password',
    forgotPassword: 'Forgot your password',
    restorePassword: 'Restore password',

    name: 'Name',
    enterName: 'Enter name',

    signUp: 'Sign up',
    signIn: 'Sign in',

    restore: 'Restore',
    open: 'Open',
    inputValue: 'Input a value',
    apply: 'Apply',
    notebookDescNote: 'Indicate the contents of the notebook: objects, operations, situations. It will be easier for other users to find and understand the solution.',
    tagsNote: '#enter#tags',
    inProgress: 'In progress',
    copied: 'Copied',
  },

  // ошибки
  errors: {
    error: 'Error',
    code: 'Code',
    copyToBufferError: 'Error while coping to the buffer',
    SizeErrMessage: 'It must has 2-30 symbols',
    MissingErrMessage: 'Required value',
    LinkErrMessage: 'There should be a link here',
    EmailErrMessage: 'Please enter a valid e-mail',
    PasswordLengthErrMessage: 'Must be at least 8 characters',
    AllowLettersMessage: 'Use only letters and hyphens',
    AllowTagsMessage: 'No more than 5 tags. Tag length up to 20 characters.',
    saveNotebook: `You must save your notebook first`,
    notebookNotFound: `The document was not found or the owner has stopped publishing it`,
    notebookNotSelected: 'No document selected',
  },

  // сообщения
  promts: {
    sendRestorePass: `Password recovery instructions have been sent to your email`,
    newPassChanged: 'Password has been changed and sent to',
    notebookLink: 'Link to this notebook',
  },

  // печать
  print : {
    dateOfPrint: 'Date of print',
  },

  // картинки
  pictures: {
    account: account_en,
    flows: flows_en,
  }

}