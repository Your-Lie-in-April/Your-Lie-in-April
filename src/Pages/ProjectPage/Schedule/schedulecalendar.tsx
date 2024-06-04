import { DateContext } from '#/hooks/context/dateContext';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import dayjs from 'dayjs';
import { FC, useContext, useMemo } from 'react';
import Calendar from 'react-calendar';
import styled from 'styled-components';

const StyledCalendarDiv = styled.div`
  // 오늘 날짜 스타일
  .react-calendar__tile--now {
    background: transparent;
    border-radius: 0;
  }

  // 선택한 날짜 스타일
  .react-calendar__tile--active {
    background: transparent;
    color: #ffffff;
    border-radius: 50px;
    border: none;
    outline: none;
  }

  // 날짜칸 스타일
  .react-calendar__tile {
    font-size: 24px;
    color: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 3px;
  }

  // 전체적 캘린더 틀
  .react-calendar {
    width: 290px;
    height: 290px;
    border-radius: 10px;
    background: #fbfbfb;
    box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.25);
    font-family: Pretendard;
    font-weight: 700;
    color: #000000;
    line-height: normal;
    padding: 3px;
    box-sizing: border-box;
  }

  // 요일 스타일
  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font: inherit;
    font-size: 28px;
    color: #000000;
    font-weight: 700;
    gap: 2px;
    width: 272px;
    height: 30px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
  }

  // 요일 스타일
  .react-calendar__month-view__weekdays__weekday {
    border-radius: 5px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  // 네비게이션
  .react-calendar__navigation {
    display: flex;
    margin-bottom: 0;
    align-items: center;
  }

  .react-calendar__navigation button {
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
  }

  // 월 선택 부분 스타일
  .react-calendar__year-view__months__month {
    background: transparent;
    border-radius: 10px;
    padding: 0px;
    height: 60px;
    font-size: 22px;
  }

  .react-calendar__year-view__months__month--active {
    border: none;
    outline: none;
  }

  // 선택한 주차의 색 입히기
  .highlight {
    background-color: #b79fff;
    color: #ffffff;
    font-size: 24px;
    border-radius: 0;
    border: none;
  }

  .highlight.start-of-week {
    border-left: 2px solid #ffffff;
  }

  .highlight.end-of-week {
    border-right: 2px solid #ffffff;
  }

  .react-calendar__month-view__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: 1fr;
  }

  .react-calendar__tile {
    width: 100%;

  }
`;

const StyledCalendar = styled(Calendar)`
  .react-calendar__tile--active {
    background-color: inherit;
    border-radius: 0;
    border: none;
    outline: none;
  }

  .react-calendar__navigation__prev2-button,
  .react-calendar__navigation__next2-button {
    display: none;
  }

  .react-calendar__navigation__prev-button,
  .react-calendar__navigation__next-button {
    color: #d9d9d9;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .react-calendar__navigation__label {
    font-size: 32px;
    font-weight: 700;
    color: #000000;
  }

  .react-calendar__navigation__label__labelText {
    font-size: 28px;
    font-weight: 700;
    color: #000000;
  }

  .react-calendar__tile {
    max-width: 100%;
  }
`;

const ScheduleCalendar: FC = () => {
  const { selectedDate, setSelectedDate } = useContext(DateContext) || {};

  const [startDate, endDate] = useMemo(() => {
    if (!selectedDate) return [null, null];

    const selected = dayjs(selectedDate);
    const startOfWeek = selected.startOf('week');
    const endOfWeek = selected.endOf('week');

    return [startOfWeek.toDate(), endOfWeek.toDate()];
  }, [selectedDate]);

  const tileClassName = ({ date }: { date: Date }) => {
    if (startDate && endDate) {
      if (date >= startDate && date <= endDate) {
        if (date.getTime() === startDate.getTime()) {
          return 'highlight start-of-week';
        }
        if (date.getTime() === endDate.getTime()) {
          return 'highlight end-of-week';
        }
        return 'highlight';
      }
    }
    return null;
  };

  const handleDateChange = (date: Date | Date[] | null) => {
    if (date instanceof Date && setSelectedDate) {
      setSelectedDate(date.toISOString());
    }
  };

  return (
    <StyledCalendarDiv>
      <StyledCalendar
        value={selectedDate}
        onChange={handleDateChange}
        formatDay={(locale, date) => dayjs(date).format('D')}
        formatYear={(locale, date) => dayjs(date).format('YYYY')}
        formatMonthYear={(locale, date) => dayjs(date).format('MM')}
        formatShortWeekday={(locale, date) =>
          ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]
        }
        showNeighboringMonth={false}
        next2Label={null}
        prev2Label={null}
        minDetail='year'
        selectRange={false}
        tileClassName={tileClassName}
        calendarType='gregory'
        prevLabel={
          <ArrowLeftIcon
            style={{ fill: '#D9D9D9', width: '22px', height: '22px' }}
          />
        }
        nextLabel={
          <ArrowRightIcon
            style={{ fill: '#D9D9D9', width: '22px', height: '22px' }}
          />
        }
      />
    </StyledCalendarDiv>
  );
};

export default ScheduleCalendar;
