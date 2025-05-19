import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { addDays, format, isToday, isSameDay, subDays } from 'date-fns';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
};

export default function CalendarHeader({ onDateSelect, selectedDate }: Props) {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [startDate, setStartDate] = useState(subDays(new Date(), 3));
  
  // Generate array of dates (5 dana)
  const dates = Array.from({ length: 5 }, (_, i) => addDays(startDate, i));

  const handleDateSelect = (date: Date) => {
    setDatePickerVisible(false);
    onDateSelect(date);
  };

  const handlePrevious = () => {
    const newStartDate = subDays(startDate, 5);
    setStartDate(newStartDate);
    onDateSelect(addDays(newStartDate, 2)); // Select middle date
  };

  const handleNext = () => {
    const newStartDate = addDays(startDate, 5);
    setStartDate(newStartDate);
    onDateSelect(addDays(newStartDate, 2)); // Select middle date
  };

  const renderDate = (date: Date) => {
    const isSelected = isSameDay(date, selectedDate);
    const dayName = format(date, 'EEE');
    const dayNumber = format(date, 'd');
    const isCurrentDay = isToday(date);

    return (
      <TouchableOpacity
        key={date.toISOString()}
        style={[
          styles.dateContainer,
          isSelected && styles.selectedDate,
          isCurrentDay && styles.currentDate,
        ]}
        onPress={() => onDateSelect(date)}
      >
        <Text style={[
          styles.dayName,
          isSelected && styles.selectedText,
          isCurrentDay && styles.currentText,
        ]}>
          {dayName}
        </Text>
        <Text style={[
          styles.dayNumber,
          isSelected && styles.selectedText,
          isCurrentDay && styles.currentText,
        ]}>
          {dayNumber}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={handlePrevious}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.datesRow}>
          {dates.map(renderDate)}
        </View>

        <View style={styles.rightButtons}>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={handleNext}
          >
            <Ionicons name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.calendarButton}
            onPress={() => setDatePickerVisible(true)}
          >
            <Ionicons name="calendar" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateSelect}
        onCancel={() => setDatePickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  calendarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    alignItems: 'center',
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    minWidth: 45,
  },
  selectedDate: {
    backgroundColor: '#6B4EFF',
  },
  currentDate: {
    backgroundColor: '#F0EEFF',
  },
  dayName: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  selectedText: {
    color: '#fff',
  },
  currentText: {
    color: '#6B4EFF',
  },
  arrowButton: {
    padding: 8,
  },
  calendarButton: {
    padding: 8,
    marginLeft: 8,
  },
  datesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
}); 