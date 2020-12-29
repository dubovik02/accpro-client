import Properties from '../properties/Properties';
/**
 * Библиотека функций работы с датами
 */
/*----------------------------------------------------------------------------- */

/**
 * Преобразование даты в строку гггг-мм-дд
 */
export function parseDateToYMDString(date) {

  const monthDate = (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate());
  return `${date.getFullYear()}-${date.getMonth() + 1}-${monthDate}`;

}

/**
 * Преобразование даты в строку дд-мм-гггг
 */
export function parseDateToDMYString(date) {

  const monthDate = (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate());
  return `${monthDate}-${date.getMonth() + 1}-${date.getFullYear()}`;

}

/**
 * Получение строкового представления диапозона дат новостей в формате гггг-мм-дд
 * @returns Object {nowDateStr, fromDateStr}
 */
// export function getNewsPeriod() {
//   const nowDate = new Date();
//   nowDate.setHours(23,59,59,999);
//   const nowDateStr = parseDateToYMDString(nowDate);

//   const fromDate = new Date();
//   fromDate.setDate(fromDate.getDate() - Properties.newsList.newsPeriod);
//   fromDate.setHours(0,0,0,0);
//   const fromDateStr = parseDateToYMDString(fromDate);

//   return {
//     nowDateStr: nowDateStr,
//     fromDateStr: fromDateStr,
//   }
// }

/**
 * Получение строкового представления диапозона дат новостей в формате дд-мм-гггг/гггг-мм-дд
 * @returns Object {nowDateStr, fromDateStr}
 */
export function getNewsPeriod(isYearFirst) {

  const nowDate = new Date();
  nowDate.setHours(23,59,59,999);
  //const nowDateStr = parseDateToYMDString(nowDate);

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - Properties.newsList.newsPeriod);
  fromDate.setHours(0,0,0,0);
  //const fromDateStr = parseDateToYMDString(fromDate);

  if (isYearFirst) {
    return {
      nowDateStr: parseDateToYMDString(nowDate),
      fromDateStr: parseDateToYMDString(fromDate),
    }
  }
  else {
    return {
      nowDateStr: parseDateToDMYString(nowDate),
      fromDateStr: parseDateToDMYString(fromDate),
    }
  }

}