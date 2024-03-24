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
  const monthNumber = (date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth());
  return `${date.getFullYear()}-${monthNumber}-${monthDate}`;

}

/**
 * Преобразование даты в строку дд-мм-гггг
 */
export function parseDateToDMYString(date) {

  const monthDate = (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate());
  const monthNumber = (date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth());
  return `${monthDate}-${monthNumber}-${date.getFullYear()}`;

}

/**
 * Получение строкового представления диапозона дат новостей в формате дд-мм-гггг/гггг-мм-дд
 * @returns Object {nowDateStr, fromDateStr}
 */
export function getNewsPeriod(isYearFirst) {

  const nowDate = new Date();
  nowDate.setHours(23,59,59,999);

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - Properties.newsList.newsPeriod);
  fromDate.setHours(0,0,0,0);

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