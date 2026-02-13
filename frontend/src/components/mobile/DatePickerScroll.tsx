import { format, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DatePickerScrollProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  daysToShow?: number;
  hasEventsOn?: Date[];
}

export function DatePickerScroll({
  selectedDate,
  onSelectDate,
  daysToShow = 14,
  hasEventsOn = [],
}: DatePickerScrollProps) {
  const dates = Array.from({ length: daysToShow }, (_, i) => addDays(new Date(), i));

  const hasEvents = (date: Date) => {
    return hasEventsOn.some((eventDate) => isSameDay(eventDate, date));
  };

  return (
    <div className="date-picker-scroll">
      {dates.map((date, index) => {
        const isSelected = isSameDay(date, selectedDate);
        const dayLabel = format(date, 'EEE', { locale: ptBR }).toUpperCase();
        const dateNumber = format(date, 'd');

        return (
          <button
            key={index}
            onClick={() => onSelectDate(date)}
            className={`date-picker-item ${isSelected ? 'selected' : ''}`}
          >
            <span className="date-picker-item-day">{dayLabel}</span>
            <span className="date-picker-item-date">{dateNumber}</span>
            {hasEvents(date) && (
              <div className="date-picker-item-dots">
                <span className="date-picker-item-dot" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
