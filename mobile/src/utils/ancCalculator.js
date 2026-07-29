export const calculateAncVisitDates = (lmpDateString) => {
  const lmpDate = new Date(lmpDateString);

  const addWeeks = (date, weeks) => {
    const result = new Date(date);
    result.setDate(result.getDate() + weeks * 7);
    return result.toISOString().split('T')[0];
  };

  return {
    visit1Date: addWeeks(lmpDate, 12),
    visit2Date: addWeeks(lmpDate, 20),
    visit3Date: addWeeks(lmpDate, 28),
    visit4Date: addWeeks(lmpDate, 36),
  };
};